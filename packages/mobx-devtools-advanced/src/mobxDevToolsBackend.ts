// I'm assuming this file is for if the app page wants to manually control initialization of the backend / connection to the dev-tools frontend?
// Anyway, it's not used in the default setup. (just installing devtools, without [app/project]-specific setup)

import {parse, stringify} from "flatted";
import {InitBackend} from "../../../src/backend";
import {Bridge, SerializeOptions} from "../../../src/Bridge";
import debugConnection from "../../../src/utils/debugConnection";
import installGlobalHook from "../../../src/backend/utils/installGlobalHook";

installGlobalHook(window);
const hook = window["__MOBX_DEVTOOLS_GLOBAL_HOOK__"]; // eslint-disable-line no-underscore-dangle

// not recommended to use mobx store in backend; it creates another instance in page, which can cause conflicts
/*export class BackendStore {
	@observable autoSerializeDepth: number;
}
export const backendStore = new BackendStore();*/

declare var __DEV__;
export function connectToDevTools(options) {
	const {host = "localhost", port = 8098} = options;
	const messageListeners = [];
	const uri = `ws://${host}:${port}`;
	const ws = new window.WebSocket(uri);
	ws.onclose = handleClose;
	ws.onerror = handleClose;
	ws.onmessage = handleMessage;
	ws.onopen = ()=>{
		let listeners = [];

		const bridge = new Bridge({
			listen(fn) {
				messageListeners.push(fn);
			},
			send(data) {
				//ws.send(JSON.stringify(data));
				ws.send(stringify(data));
			},
		});

		const disposeBackend = InitBackend(bridge, hook);

		bridge.once("disconnect", ()=>{
			debugConnection("[contentScript -x BACKEND]");
			listeners.forEach(listener=>window.removeEventListener("message", listener));
			listeners = [];
			disposeBackend();
		});

		bridge.sub("notify-settings", (settings: SerializeOptions)=>{
			//backendStore.autoSerializeDepth = settings.autoSerializeDepth;
			bridge.serializeOptions.autoSerializeDepth = settings.autoSerializeDepth;
			//console.log("Auto-serialize depth set on manual-backend to:", settings.autoSerializeDepth);
		});
	};

	let hasClosed = false;
	function handleClose() {
		if (!hasClosed) {
			hasClosed = true;
			setTimeout(()=>connectToDevTools(options), 2000);
		}
	}

	function handleMessage(evt) {
		let data;
		try {
			//data = JSON.parse(evt.data);
			data = parse(evt.data);
		} catch (e) {
			if (__DEV__) {
				console.error(e); // eslint-disable-line no-console
			}
			return;
		}
		messageListeners.forEach(fn=>{
			try {
				fn(data);
			} catch (e) {
				if (__DEV__) {
					console.error(e); // eslint-disable-line no-console
				}
				throw e;
			}
		});
	}
}