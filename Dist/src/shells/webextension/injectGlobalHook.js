"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const installGlobalHook_1 = __importDefault(require("../../backend/utils/installGlobalHook"));
const script = document.createElement("script");
script.textContent = `;(${installGlobalHook_1.default.toString()}(window))`;
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
// if (__DEV__) {
window.addEventListener("test-open-mobx-devtools-window", () => {
    console.log("test-open-mobx-devtools-window"); // eslint-disable-line no-console
    chrome.runtime.sendMessage({ eventName: "open-mobx-devtools-window" });
});
// }
