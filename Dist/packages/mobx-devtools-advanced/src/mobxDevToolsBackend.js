"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backend_1 = __importDefault(require("../../../src/backend"));
const Bridge_1 = __importDefault(require("../../../src/Bridge"));
const debugConnection_1 = __importDefault(require("../../../src/utils/debugConnection"));
const installGlobalHook_1 = __importDefault(require("../../../src/backend/utils/installGlobalHook"));
installGlobalHook_1.default(window);
const hook = window.__MOBX_DEVTOOLS_GLOBAL_HOOK__; // eslint-disable-line no-underscore-dangle
const connectToDevTools = (options) => {
    const { host = 'localhost', port = 8098 } = options;
    const messageListeners = [];
    const uri = `ws://${host}:${port}`;
    const ws = new window.WebSocket(uri);
    ws.onclose = handleClose;
    ws.onerror = handleClose;
    ws.onmessage = handleMessage;
    ws.onopen = () => {
        let listeners = [];
        const bridge = new Bridge_1.default({
            listen(fn) {
                messageListeners.push(fn);
            },
            send(data) {
                ws.send(JSON.stringify(data));
            },
        });
        const disposeBackend = backend_1.default(bridge, hook);
        bridge.once('disconnect', () => {
            debugConnection_1.default('[contentScript -x BACKEND]');
            listeners.forEach(listener => window.removeEventListener('message', listener));
            listeners = [];
            disposeBackend();
        });
    };
    let hasClosed = false;
    function handleClose() {
        if (!hasClosed) {
            hasClosed = true;
            setTimeout(() => connectToDevTools(options), 2000);
        }
    }
    function handleMessage(evt) {
        let data;
        try {
            data = JSON.parse(evt.data);
        }
        catch (e) {
            if (__DEV__) {
                console.error(e); // eslint-disable-line no-console
            }
            return;
        }
        messageListeners.forEach((fn) => {
            try {
                fn(data);
            }
            catch (e) {
                if (__DEV__) {
                    console.error(e); // eslint-disable-line no-console
                }
                throw e;
            }
        });
    }
};
module.exports = { connectToDevTools };
