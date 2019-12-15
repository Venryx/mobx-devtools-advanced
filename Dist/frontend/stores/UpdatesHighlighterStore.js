"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractStore_1 = __importDefault(require("./AbstractStore"));
class UpdatesHighlighterStore extends AbstractStore_1.default {
    constructor(bridge) {
        super();
        this.updatesEnabled = false;
        this.updatesFilterByDuration = { slow: false, medium: false, fast: false };
        this.bridge = bridge;
    }
    toggleShowingUpdates(value = !this.updatesEnabled) {
        this.setUpdatesFilterByDuration({ slow: value, medium: value, fast: value });
    }
    setUpdatesFilterByDuration({ slow, medium, fast }) {
        const updatesEnabled = slow || medium || fast;
        this.updatesEnabled = updatesEnabled;
        this.emit("updatesEnabled");
        this.updatesFilterByDuration = { slow, medium, fast };
        this.emit("updatesFilterByDuration");
        this.bridge.send("backend-mobx-react:set-displaying-updates-enabled", updatesEnabled);
        this.bridge.send("backend-mobx-react:set-displaying-updates-filter-by-duration", { slow, medium, fast });
    }
}
exports.default = UpdatesHighlighterStore;
