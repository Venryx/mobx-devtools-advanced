"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx = __importStar(require("mobx")); // eslint-disable-line
const libmst = __importStar(require("mobx-state-tree")); // eslint-disable-line
const track = root => {
    const hook = global.__MOBX_DEVTOOLS_GLOBAL_HOOK__; // eslint-disable-line no-underscore-dangle
    if (hook && hook.inject)
        hook.inject({ mobx, mst: libmst });
    if (!hook)
        return;
    for (const mobxid in hook.collections) {
        if (Object.prototype.hasOwnProperty.call(hook.collections, mobxid)) {
            const { mst } = hook.collections[mobxid];
            if (mst && mst.isStateTreeNode(root) && mst.isRoot(root)) {
                hook.emit("mst-root", { root, mobxid });
                const disposer = hook.sub("get-mst-roots", () => hook.emit("mst-root", { root, mobxid }));
                mst.addDisposer(root, disposer);
                return;
            }
        }
    }
};
exports.default = root => {
    track(root);
    return root;
};
