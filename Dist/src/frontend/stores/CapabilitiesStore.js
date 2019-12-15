"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractStore_1 = __importDefault(require("./AbstractStore"));
class CapabilitiesStore extends AbstractStore_1.default {
    constructor(bridge) {
        super();
        this.bridge = bridge;
        this.addDisposer(bridge.sub("capabilities", capabilities => {
            this.capabilities = capabilities;
            Object.keys(capabilities).forEach(key => {
                if (this[key] !== capabilities[key]) {
                    this[key] = capabilities[key];
                    this.emit(key);
                }
            });
        }));
        bridge.send("get-capabilities");
    }
}
exports.default = CapabilitiesStore;
