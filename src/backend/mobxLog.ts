import {MakeChangesProcessor, Change, _path} from "../utils/changesProcessor";
import consoleLogChange from "./utils/consoleLogChange";
import makeInspector from "./utils/inspector";
import storaTempValueInGlobalScope from "./utils/storaTempValueInGlobalScope";
import {Bridge} from "../Bridge";
import {GetValueByPath} from "../utils/General";

export function InitMobxLogBackend(bridge: Bridge, hook) {
	let logEnabled = false;
	let consoleLogEnabled = false;
	const logFilter = undefined;

	let itemsById = {};

	const inspector = makeInspector(({inspectedObject, path, data})=>{
		bridge.send("inspect-change-result", {changeId: inspectedObject.id, path, data});
	});

	const changesProcessor = MakeChangesProcessor(change=>{
		if (logFilter) {
			try {
				const accept = logFilter(change);
				if (!accept) return;
			} catch (e) {
				console.warn("Error while evaluating logFilter:", e); // eslint-disable-line no-console
			}
		}
		if (logEnabled) {
			if (change) {
				itemsById[change.id] = change;
				bridge.send("appended-log-item", change);
			}
		}
		if (consoleLogEnabled) {
			consoleLogChange(change);
		}
	});

	const disposables = [
		bridge.sub("set-log-enabled", value=>{
			logEnabled = value;
			bridge.send("log-enabled", value);
			if (!logEnabled && !consoleLogEnabled) changesProcessor.reset();
		}),
		bridge.sub("set-console-log-enabled", value=>{
			consoleLogEnabled = value;
			bridge.send("console-log-enabled", value);
			if (!logEnabled && !consoleLogEnabled) changesProcessor.reset();
		}),
		bridge.sub("get-log-item-details", id=>{
			bridge.send("log-item-details", itemsById[id]);
			return itemsById[id];
		}),
		bridge.sub("remove-log-items", ids=>{
			ids.forEach(id=>{
				delete itemsById[id];
			});
		}),
		bridge.sub("remove-all-log-items", ()=>{
			itemsById = {};
		}),
		bridge.sub("inspect-change", ({changeId, path})=>{
			if (!inspector.inspectedObject || changeId !== inspector.inspectedObject.id) {
				inspector.setInspectedObject(itemsById[changeId]);
			}
			inspector.inspect(path);
		}),
		bridge.sub("stop-inspecting-change", ({changeId, path})=>{
			if (inspector.inspectedObject && changeId === inspector.inspectedObject.id) {
				inspector.forget(path);
			}
		}),
		bridge.sub("log:makeGlobal", ({changeId, path})=>{
			const change = itemsById[changeId];
			const value = GetValueByPath(change, path);
			storaTempValueInGlobalScope(value);
		}),
	];

	return {
		setup(mobxid, collection) {
			if (collection.mobx) {
				disposables.push(
					(collection.mobx as MobX).spy(change=>{
						if (logEnabled || consoleLogEnabled) {
							const changeObj_mobxSym = change.object == null ? null : Object.getOwnPropertySymbols(change.object).filter(a=>a.toString() == "Symbol(mobx administration)")[0];
							if (changeObj_mobxSym != null && changeObj_mobxSym != collection.mobx.$mobx) {
								debugger;
								throw new Error(`
									MobX symbol is different between change.object[$mobx] and collection.mobx.$mobx.
									This means there are multiple instances of MobX in the webpage.
									To resolve, use dev-tools to find locations of the two instances, then remove the extraneous one.
									1) Find path to change.object MobX: inspect change.object.Symbol(mobx adminstration).defaultEnhancer.[[Function location]]
									2) Find path to collection.mobx MobX: inspect collection.mobx.getDebugName.[[Function location]]
								`);
							}
							changesProcessor.push(change, collection.mobx);
						}
					}),
				);
			}
		},
		dispose() {
			disposables.forEach(fn=>fn());
		},
	};
}