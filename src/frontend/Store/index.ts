import {observable, autorun, reaction} from "mobx";
import {Bridge} from "../../Bridge";

// todo: have store persist (some props globally, some per domain)
export class Store {
	@observable autoSerializeDepth = 7;

	@observable selectedMobXObjectPath: string;
}

export const store = new Store();

/*autorun(()=>{
	if (Bridge.main == null) return;
	Bridge.main.send("notify-settings", {
		autoSerializeDepth: store.autoSerializeDepth,
	});
});*/
// we have to use reaction, since we can't make Bridge.main an observable (since backend uses it too, and backend can't use mobx)
reaction(()=>store.autoSerializeDepth, ()=>{
	//console.log(`Maybe notifying of settings. @Bridge(${Bridge.main}) @store:`, store);
	if (Bridge.main == null) return;
	Bridge.main.send("notify-settings", {
		autoSerializeDepth: store.autoSerializeDepth,
	});
});