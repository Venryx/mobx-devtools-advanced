import initCapabilitiesBackend from "./cababilities";
import initMSTBackend from "./mst";
import initMobxReactNodesTreeBackend from "./mobxReactNodesTree";
import initMobxReactNodesTreeBackend_new from "./mobxReactNodesTree_new";
import initMobxReactUpdatesHighlighter from "./mobxReactUpdatesHighlighter";
import initMobxLogBackend from "./mobxLog";

export function InitBackend(bridge, hook) {
	if (!hook) {
		if (__DEV__) {
			throw new Error("");
		}
		return ()=>{};
	}

	const disposables = [];

	const backends = [
		initCapabilitiesBackend(bridge, hook),
		initMSTBackend(bridge, hook),
		initMobxReactNodesTreeBackend(bridge, hook),
		initMobxReactNodesTreeBackend_new(bridge, hook),
		initMobxReactUpdatesHighlighter(bridge, hook),
		initMobxLogBackend(bridge, hook),
	];

	backends.forEach(({dispose})=>disposables.push(dispose));

	Object.keys(hook.collections).forEach(mobxid=>{
		backends.forEach(({setup})=>setup(mobxid, hook.collections[mobxid]));
	});

	disposables.push(
		bridge.sub("backend:ping", ()=>bridge.send("frontend:pong")),
		hook.sub("instances-injected", mobxid=>{
			backends.forEach(p=>p.setup(mobxid, hook.collections[mobxid]));
		}),
	);

	return function dispose() {
		disposables.forEach(fn=>{ fn(); });
	};
}