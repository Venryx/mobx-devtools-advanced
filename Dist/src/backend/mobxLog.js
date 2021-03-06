"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const changesProcessor_1 = __importDefault(require("../utils/changesProcessor"));
const consoleLogChange_1 = __importDefault(require("./utils/consoleLogChange"));
const inspector_1 = __importDefault(require("./utils/inspector"));
const storaTempValueInGlobalScope_1 = __importDefault(require("./utils/storaTempValueInGlobalScope"));
const summary = change => {
    const sum = Object.create(null);
    sum.summary = true;
    sum.id = change.id;
    sum.type = change.type;
    sum.name = change.name;
    sum.objectName = change.objectName;
    sum.oldValue = change.oldValue;
    sum.newValue = change.newValue;
    sum.hasChildren = change.children.length > 0;
    sum.timestamp = change.timestamp;
    sum.addedCount = change.addedCount;
    sum.removedCount = change.removedCount;
    sum.object = change.object;
    return sum;
};
exports.default = (bridge, hook) => {
    let logEnabled = false;
    let consoleLogEnabled = false;
    const logFilter = undefined;
    let itemsById = {};
    const inspector = inspector_1.default(({ inspectedObject, path, data }) => {
        bridge.send("inspect-change-result", { changeId: inspectedObject.id, path, data });
    });
    const changesProcessor = changesProcessor_1.default(change => {
        if (logFilter) {
            try {
                const accept = logFilter(change);
                if (!accept)
                    return;
            }
            catch (e) {
                console.warn("Error while evaluating logFilter:", e); // eslint-disable-line no-console
            }
        }
        if (logEnabled) {
            if (change) {
                itemsById[change.id] = change;
                bridge.send("appended-log-item", summary(change));
            }
        }
        if (consoleLogEnabled) {
            consoleLogChange_1.default(change);
        }
    });
    const disposables = [
        bridge.sub("set-log-enabled", value => {
            logEnabled = value;
            bridge.send("log-enabled", value);
            if (!logEnabled && !consoleLogEnabled)
                changesProcessor.reset();
        }),
        bridge.sub("set-console-log-enabled", value => {
            consoleLogEnabled = value;
            bridge.send("console-log-enabled", value);
            if (!logEnabled && !consoleLogEnabled)
                changesProcessor.reset();
        }),
        bridge.sub("get-log-item-details", id => {
            bridge.send("log-item-details", itemsById[id]);
            return itemsById[id];
        }),
        bridge.sub("remove-log-items", ids => {
            ids.forEach(id => {
                delete itemsById[id];
            });
        }),
        bridge.sub("remove-all-log-items", () => {
            itemsById = {};
        }),
        bridge.sub("inspect-change", ({ changeId, path }) => {
            if (!inspector.inspectedObject || changeId !== inspector.inspectedObject.id) {
                inspector.setInspectedObject(itemsById[changeId]);
            }
            inspector.inspect(path);
        }),
        bridge.sub("stop-inspecting-change", ({ changeId, path }) => {
            if (inspector.inspectedObject && changeId === inspector.inspectedObject.id) {
                inspector.forget(path);
            }
        }),
        bridge.sub("log:makeGlobal", ({ changeId, path }) => {
            const change = itemsById[changeId];
            const value = path.reduce((acc, next) => acc && acc[next], change);
            storaTempValueInGlobalScope_1.default(value);
        }),
    ];
    return {
        setup(mobxid, collection) {
            if (collection.mobx) {
                disposables.push(collection.mobx.spy(change => {
                    if (logEnabled || consoleLogEnabled) {
                        const changeObj_mobxSym = change.object == null ? null : Object.getOwnPropertySymbols(change.object).filter(a => a.toString() == "Symbol(mobx administration)")[0];
                        if (changeObj_mobxSym != null && changeObj_mobxSym != collection.mobx.$mobx) {
                            debugger;
                            throw new Error(`
									MobX symbol is different between change.object[$mobx] and collection.mobx.$mobx.
									This means there are multiple instances of MobX in the webpage.
									To resolve, use dev-tools to find locations of two instances, then remove the extraneous one.
									1) Find path to change.object MobX: inspect change.object.Symbol(mobx adminstration).defaultEnhancer.[[Function location]]
									2) Find path to collection.mobx MobX: inspect collection.mobx.getDebugName.[[Function location]]
								`);
                        }
                        changesProcessor.push(change, collection.mobx);
                    }
                }));
            }
        },
        dispose() {
            disposables.forEach(fn => fn());
        },
    };
};
