import {observable} from "mobx";

export class Store {
	@observable selectedMobXObjectPath: string;
}

export const store = new Store();