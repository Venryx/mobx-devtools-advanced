import {Component} from "react";
import {GetBySymbol} from "../utils/General";
import {Serialize} from "../Bridge";

export class FiberRootNode {
	current: FiberNode;
}
export class FiberNode {
	type: string | Function;
	child: FiberNode;
	sibling: FiberNode;
	stateNode: Element | Component;
}

export class CompTreeNode {
	static _sendFull = true; // makes-so bridge sends full object instead of stubbing it

	path: string;
	get RenderFuncPath() {
		return `${this.path}/render`;
	}

	fiber: FiberNode;
	typeName: string;
	compIsObservable: boolean;
	compRenderIsObserver: boolean;

	children = [] as CompTreeNode[];

	_serialize(path: string[], seen: Map<any, any>) {
		const clone = {} as any;
		for (const prop in this) {
			if (prop == "fiber") continue; // custom
			if (Object.prototype.hasOwnProperty.call(this, prop)) {
				clone[prop] = Serialize(this, path.concat(prop), seen, prop, true);
			}
		}
		return clone;
	}
}

export function GetCompTreeForRoots(fiberRoots: FiberRootNode[]): CompTreeNode {
	console.log("GetCompTree... fiberRoots:", fiberRoots);
	if (fiberRoots.length == 0) return new CompTreeNode();
	return GetCompTree(fiberRoots[0].current);
}
export function GetCompTree(fiber: FiberNode, parentPath?: string, indexInParent?: number): CompTreeNode {
	const comp = typeof fiber.type == "function" ? fiber.stateNode as Component : null;

	const result = new CompTreeNode();
	result.fiber = fiber;
	result.path = parentPath == null ? "" : `${parentPath.length ? `${parentPath}/` : ""}children/${indexInParent}`;
	result.typeName = fiber.type == null ? null : typeof fiber.type == "string" ? fiber.type : fiber.type.name;
	if (comp) {
		if (GetBySymbol(comp, "mobx administration")) {
			result.compIsObservable = true;
		}
		if (GetBySymbol(comp["render"], "mobx administration")) {
			result.compRenderIsObserver = true;
		}
	}

	let nextChild = fiber.child;
	while (nextChild != null) {
		const childIndex = result.children.length;
		const childNode = GetCompTree(nextChild, result.path, childIndex);
		result.children.push(childNode);
		nextChild = nextChild.sibling;
	}

	return result;
}

export default (bridge, hook)=>{
	const reactHook = hook.getReactHook();

	function MobXObserverToPlainObj(mobx) {
		const result = {} as any;
		result.name = mobx.name;
		result.observing = mobx.observing.map(observable=>MobXObservableToPlainObj(observable));
		return result;
	}
	function MobXObservableToPlainObj(mobx) {
		const result = {} as any;
		result.name = mobx.name;
		if ("value" in mobx) {
			result.value = mobx.value;
			/*if (mobx.value == null) result.value = mobx.value;
			if (typeof mobx.value == "object") {
				if (mobx.value.constructor.name == "ScalarNode") {
					result.value = mobx.value.storedValue;
				} else {
					result.value = `[Object @type(${mobx.value.constructor.name}) @keys:${Object.keys(mobx.value).join(",")}]`;
				}
			} else {
				result.value = mobx.value;
			}*/
		}
		result.lastAccessedBy = mobx.lastAccessedBy;
		if (mobx.values) {
			result.values = mobx.values.toJSON().map(a=>a[1]).map(observable=>MobXObservableToPlainObj(observable));
		}
		if (mobx.observing) {
			result.observing = mobx.observing.map(observable=>MobXObservableToPlainObj(observable));
		}
		return result;
	}
	function GetMobXObjectData(path: string) {
		const parts = path.split("/");
		const fiberRoots = reactHook.fiberRoots.toJSON();
		const compTree = GetCompTreeForRoots(fiberRoots);
		let nextNode = compTree;
		for (const part of parts) {
			if (part == "children") continue;
			if (part == "render") {
				return MobXObserverToPlainObj(GetBySymbol(nextNode.fiber.stateNode["render"], "mobx administration"));
			}
			nextNode = nextNode.children[part];
		}
		return MobXObservableToPlainObj(GetBySymbol(nextNode.fiber.stateNode, "mobx administration"));
	}

	const disposables = [
		bridge.sub("backend:getCompTree", ({componentId})=>{
			const fiberRoots = reactHook.fiberRoots.toJSON();
			const compTree = GetCompTreeForRoots(fiberRoots);
			console.log("Got comp-tree:", compTree);
			bridge.send("frontend:receiveCompTree", {compTree});
		}),
		bridge.sub("backend:GetMobXObjectData", ({path})=>{
			const data = GetMobXObjectData(path);
			console.log("Got mobx-object data:", data);
			data._sendFull = true;
			bridge.send("frontend:ReceiveMobXObjectData", {data});
		}),
	];

	return {
		setup(mobxid, collection) {
		},
		dispose() {
			disposables.forEach(fn=>fn());
		},
	};
};