"use strict";
/* global chrome */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const frontend_1 = __importDefault(require("../../frontend"));
const debugConnection_1 = __importDefault(require("../../utils/debugConnection"));
let onDisconnect;
const whenTabLoaded = (tabId, cb) => {
    chrome.tabs.get(tabId, tab => {
        if (tab.status !== "loading") {
            cb();
            return;
        }
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                cb();
            }
        });
    });
};
const inject = (contentTabId, done) => whenTabLoaded(contentTabId, () => {
    const code = `
          // the prototype stuff is in case document.createElement has been modified
          var script = document.constructor.prototype.createElement.call(document, 'script');
          script.src = "${chrome.runtime.getURL("backend.js")}";
          document.documentElement.appendChild(script);
          script.parentNode.removeChild(script);
        `;
    chrome.tabs.executeScript(contentTabId, { code }, () => {
        let disconnected = false;
        const port = chrome.runtime.connect({
            name: `${contentTabId}`,
        });
        port.onDisconnect.addListener(() => {
            debugConnection_1.default("[background -x FRONTEND]");
            disconnected = true;
            if (onDisconnect) {
                onDisconnect();
            }
        });
        const wall = {
            listen(fn) {
                port.onMessage.addListener(message => {
                    debugConnection_1.default("[background -> FRONTEND]", message);
                    fn(message);
                });
            },
            send(data) {
                if (disconnected)
                    return;
                debugConnection_1.default("[FRONTEND -> background]", data);
                port.postMessage(data);
            },
        };
        done(wall, () => port.disconnect());
    });
});
chrome.runtime.getBackgroundPage(({ contentTabId }) => frontend_1.default({
    node: document.getElementById("container"),
    debugName: "Window UI",
    reloadSubscribe: reloadFn => {
        onDisconnect = () => reloadFn();
        return () => {
            onDisconnect = undefined;
        };
    },
    inject: done => inject(contentTabId, done),
}));
