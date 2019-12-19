import {IObjectDidChange, IValueDidChange, IArrayChange, IArraySplice, ISetDidChange, IMapDidChange, ISetWillChange, IValueWillChange, IMapWillChange, IObjectWillChange, IArrayWillSplice, IArrayWillChange} from "mobx";

const getId = (()=>{
	let i = 0;
	return ()=>{
		i += 1;
		return i;
	};
})();

function observableName(mobx: MobX, object) {
	if (!object || typeof object !== "object") {
		return "";
	}
	return mobx.getDebugName(object);
}

function isPrimitive(value) {
	return (
		value === null
    || value === undefined
    || typeof value === "string"
    || typeof value === "number"
    || typeof value === "boolean"
	);
}

function getNameForThis(mobx: MobX, who) {
	if (who === null || who === undefined) {
		return "";
	} if (who && typeof who === "object") {
		const $mobx = mobx.$mobx || "$mobx";
		if (who && who[$mobx]) {
			return who[$mobx].name;
		} if (who.constructor) {
			return who.constructor.name || "object";
		}
	}
	return `${typeof who}`;
}

function formatValue(mobx: MobX, value) {
	if (isPrimitive(value)) {
		if (typeof value === "string" && value.length > 100) {
			return `${value.substr(0, 97)}...`;
		}
		return value;
	}
	//return `(${getNameForThis(mobx, value)})`;
	//return JSON.stringify({"@typeName": getNameForThis(mobx, value), ...value});
	return value;
}

export const Change_types: ChangeType[] = ["action", "transaction", "reaction", "add", "delete", "update", "splice", "compute", "error", "scheduled-reaction", "create"];
export type ChangeType<T = Change> = T extends {type?: infer Subtype} ? Subtype : never;
/*export type ChangeType = "action" | "transaction" | "reaction" | "add" | "delete" | "update" | "splice" | "compute" | "error" | "scheduled-reaction" | "create";
export class Change {
	type: ChangeType;
}*/
export type Change_CombinedWithOr =
	IValueWillChange<any> | IArrayWillChange<any> | IArrayWillSplice<any> | ISetWillChange<any> | IMapWillChange<any, any> | IObjectWillChange | // will X
	IValueDidChange<any> | IArrayChange<any> | IArraySplice<any> | ISetDidChange<any> | IMapDidChange<any, any> | IObjectDidChange | // did X
	{type: "action" | "transaction" | "scheduled-reaction" | "reaction" | "compute" | "error" | "create"}; // from Change types without an interface (eg. "scheduled-reaction" from mobx.module.js)
export type Change = Partial<
	Omit<
		IValueWillChange<any> & IArrayWillChange<any> & IArrayWillSplice<any> & ISetWillChange<any> & IMapWillChange<any, any> & IObjectWillChange & // will X
		IValueDidChange<any> & IArrayChange<any> & IArraySplice<any> & ISetDidChange<any> & IMapDidChange<any, any> & IObjectDidChange, // did X
	"type">
	// fix "type" prop
	& Pick<Change_CombinedWithOr, "type">
	// custom props added
	& {
		id: number;
		timestamp: number;
		children: any[];
		spyReportStart: boolean;
		spyReportEnd: boolean;
		time: number;
		objectName: string;
		targetName: string;
		target: any;
		summary: boolean;
		hasChildren: boolean;
		open: boolean;
		height: number;
		message: string;
	}
>;

function ProcessChange(change: Change, firstCall: boolean) {
	const objPath = change.object?.[_path] ?? [];
	change["object_path"] = objPath.join("/");
	if (change.type == "add" || change.type == "update") {
		if (typeof change.newValue == "object" && change.newValue != null) {
			/*if (change.oldValue["_path"]) {
				delete change.oldValue["_path"];
			}*/
			//const newValuePath = objPath.concat(change.name);
			const newValuePath = objPath.concat(change["key"] || "n/a");
			change["newValue_path"] = newValuePath.join("/");

			// also store path on the object, so we can build up information
			//console.log(`Storing _path: ${newValuePath} on:`, change.newValue, "Change:", change);
			//console.log(`Storing _path: ${newValuePath} on:`, change.newValue);
			Object.defineProperty(change.newValue, _path, {configurable: true, value: newValuePath});
			// temp
			//Object.defineProperty(change.newValue, "__path", {configurable: true, enumerable: true, value: newValuePath});
			//Object.defineProperty(change.newValue, "__path", {configurable: true, enumerable: true, value: newValuePath.join("/")});
			//Object.defineProperty(change.newValue, "__path", {configurable: true, value: newValuePath.join("/")});
			//change.newValue["__path"] = newValuePath.join("/");
		}
	}

	// hook letting the user modify the change object, before it's send to the dev-tools front-end
	if (firstCall && window["mobxDevtools_processChange"]) {
		window["mobxDevtools_processChange"](change);
	}

	//console.log("Children:", change.children);
	if (change.children != null) {
		for (const child of change.children) {
			//console.log("Looping into:", child);
			ProcessChange(child, firstCall);
		}
	}
}

export const _path = Symbol("_path");

export function MakeChangesProcessor(onChange: (change: Change)=>void) {
	let path = [];

	const push = (change_basic: Change, mobx: MobX)=>{
		const change = Object.create(null) as Change;
		for (const p in change_basic) {
			if (Object.prototype.hasOwnProperty.call(change_basic, p)) {
				change[p] = change_basic[p];
			}
		}
		change.id = getId();
		change.timestamp = Date.now();
		change.children = [];

		//console.log("Change:", change);
		ProcessChange(change, true);
		setTimeout(()=>ProcessChange(change, false));

		const isGroupStart = change.spyReportStart === true;
		const isGroupEnd = change.spyReportEnd === true;

		if (isGroupEnd) {
			if (path.length === 0) {
				// eslint-disable-next-line no-console
				if (__DEV__) console.warn("groupStart & groupEnd mismatch");
				return;
			}
			const superChange = path[path.length - 1];
			path.splice(path.length - 1);
			superChange.time = change.time;
			change.time = undefined;
			if (path.length === 0) {
				onChange(superChange);
			}
		} else {
			if (path.length > 0) {
				path[path.length - 1].children.push(change);
			}
			if (isGroupStart) {
				path.push(change);
			}
			switch (change.type) {
				case "action":
					// name, target, arguments, fn
					change.targetName = getNameForThis(mobx, change.target);
					break;
				case "transaction":
					// name, target
					change.targetName = getNameForThis(mobx, change.target);
					break;
				case "scheduled-reaction":
					// object
					change.objectName = observableName(mobx, change.object);
					break;
				case "reaction":
					// object, fn
					change.objectName = observableName(mobx, change.object);
					break;
				case "compute":
					// object, target, fn
					change.objectName = observableName(mobx, change.object);
					change.targetName = getNameForThis(mobx, change.target);
					break;
				case "error":
					// message
					if (path.length > 0) {
						onChange(path[0]);
						reset();
					} else {
						onChange(change);
					}
					return; // game over
				case "update":
					// (array) object, index, newValue, oldValue
					// (map, obbject) object, name, newValue, oldValue
					// (value) object, newValue, oldValue
					change.objectName = observableName(mobx, change.object);
					change.newValue = formatValue(mobx, change.newValue);
					change.oldValue = formatValue(mobx, change.oldValue);
					break;
				case "splice":
					change.objectName = observableName(mobx, change.object);
					// (array) object, index, added, removed, addedCount, removedCount
					break;
				case "add":
					// (map, object) object, name, newValue
					change.objectName = observableName(mobx, change.object);
					change.newValue = formatValue(mobx, change.newValue);
					break;
				case "delete":
					// (map) object, name, oldValue
					change.objectName = observableName(mobx, change.object);
					change.oldValue = formatValue(mobx, change.oldValue);
					break;
				case "create":
					// (value) object, newValue
					change.objectName = observableName(mobx, change.object);
					change.newValue = formatValue(mobx, change.newValue);
					break;
				default:
					break;
			}

			if (path.length === 0) {
				onChange(change);
			}
		}
	};

	const reset = ()=>{
		if (path.length > 0) {
			path = [];
		}
	};

	return {push, reset};
}