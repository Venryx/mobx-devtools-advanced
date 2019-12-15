"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActionsStore_1 = __importDefault(require("./ActionsStore"));
const UpdatesHighlighterStore_1 = __importDefault(require("./UpdatesHighlighterStore"));
const TreeExplorerStore_1 = __importDefault(require("./TreeExplorerStore"));
const MSTChangesStore_1 = __importDefault(require("./MSTChangesStore"));
const CapabilitiesStore_1 = __importDefault(require("./CapabilitiesStore"));
exports.default = bridge => ({
    actionsLoggerStore: new ActionsStore_1.default(bridge),
    updatesHighlighterStore: new UpdatesHighlighterStore_1.default(bridge),
    mstLoggerStore: new MSTChangesStore_1.default(bridge),
    treeExplorerStore: new TreeExplorerStore_1.default(bridge),
    capabilitiesStore: new CapabilitiesStore_1.default(bridge),
});
