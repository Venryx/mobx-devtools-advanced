"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cababilities_1 = __importDefault(require("./cababilities"));
const mst_1 = __importDefault(require("./mst"));
const mobxReactNodesTree_1 = __importDefault(require("./mobxReactNodesTree"));
const mobxReactNodesTree_new_1 = __importDefault(require("./mobxReactNodesTree_new"));
const mobxReactUpdatesHighlighter_1 = __importDefault(require("./mobxReactUpdatesHighlighter"));
const mobxLog_1 = __importDefault(require("./mobxLog"));
function InitBackend(bridge, hook) {
    if (!hook) {
        if (__DEV__) {
            throw new Error("");
        }
        return () => { };
    }
    const disposables = [];
    const backends = [
        cababilities_1.default(bridge, hook),
        mst_1.default(bridge, hook),
        mobxReactNodesTree_1.default(bridge, hook),
        mobxReactNodesTree_new_1.default(bridge, hook),
        mobxReactUpdatesHighlighter_1.default(bridge, hook),
        mobxLog_1.default(bridge, hook),
    ];
    backends.forEach(({ dispose }) => disposables.push(dispose));
    Object.keys(hook.collections).forEach(mobxid => {
        backends.forEach(({ setup }) => setup(mobxid, hook.collections[mobxid]));
    });
    disposables.push(bridge.sub("backend:ping", () => bridge.send("frontend:pong")), hook.sub("instances-injected", mobxid => {
        backends.forEach(p => p.setup(mobxid, hook.collections[mobxid]));
    }));
    return function dispose() {
        disposables.forEach(fn => { fn(); });
    };
}
exports.InitBackend = InitBackend;
