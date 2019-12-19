import {observable, autorun, reaction} from "mobx";
import {CE, ObjectCE} from "js-vextensions";
import {Bridge} from "../../Bridge";

// todo: have store persist (some props globally, some per domain)
export class Store {
	@observable inferPaths = true;
	@observable autoSerializeDepth = 7;

	@observable selectedMobXObjectPath: string;
}

export const store = new Store();

export type BackendStore_Source = ReturnType<typeof GetBackendStoreData>;
export function GetBackendStoreData() {
	return ObjectCE(store).Including("inferPaths", "autoSerializeDepth");
}

/*autorun(()=>{
	if (Bridge.main == null) return;
	Bridge.main.send("notify-settings", {
		autoSerializeDepth: store.autoSerializeDepth,
	});
});*/
// we have to use reaction, since we can't make Bridge.main an observable (since backend uses it too, and backend can't use mobx)
reaction(()=>GetBackendStoreData(), ()=>{
	console.log(`Maybe notifying of settings. @Bridge(${Bridge.main}) @store:`, store, "@backendStoreData:", GetBackendStoreData());
	if (Bridge.main == null) return;
	/*Bridge.main.send("notify-settings", {
		autoSerializeDepth: store.autoSerializeDepth,
	});*/
	Bridge.main.send("notify-settings", GetBackendStoreData());
});