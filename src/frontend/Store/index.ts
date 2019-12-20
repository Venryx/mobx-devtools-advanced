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

// run once bridge is set up
//Bridge.main_onSet.push(UpdateBackendStoreData);
/*Bridge.main_onSet.push(()=>{
	setTimeout(()=>UpdateBackendStoreData(), 5000);
});*/
Bridge.main_onConnected.push(UpdateBackendStoreData);

// then run whenever a (backend-used) store value is changed
//autorun(UpdateBackendStoreData);
// we have to use reaction, since we can't make Bridge.main an observable (since backend uses it too, and backend can't use mobx)
reaction(()=>GetBackendStoreData(), UpdateBackendStoreData);
export function UpdateBackendStoreData() {
	//console.log(`UpdateBackendStoreData called. @Bridge(${Bridge.main}) @store:`, store, "@backendStoreData:", GetBackendStoreData());
	if (Bridge.main == null) return;
	/*Bridge.main.send("notify-settings", {
		autoSerializeDepth: store.autoSerializeDepth,
	});*/
	Bridge.main.send("notify-settings", GetBackendStoreData());
}