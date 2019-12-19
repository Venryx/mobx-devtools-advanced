import {GetValueByPath} from "../../utils/General";
import {TreeExplorerStore} from "../stores/TreeExplorerStore";
import {ActionsStore} from "../stores/ActionsStore";

export abstract class AccessorPack {
	abstract getValueByPath(path): any;
	abstract change(path: string[], value: any): void;
	abstract inspect(path: string[]): void;
	abstract stopInspecting(path: string[]): void;
	abstract showMenu(event, val: any, path: string[]): void;
}
export class RawAccessorPack extends AccessorPack {
	constructor(public data: any, public allowChanging = true) { super(); }
	getValueByPath(path: string[]) {
		return GetValueByPath(this.data, path);
	}
	change(path: string[], value: any): void {
		if (!this.allowChanging) return;
		//let obj = GetValueByPath(this.data, path.slice(0, -1), true);
		const obj = GetValueByPath(this.data, path.slice(0, -1));
		obj[path.slice(-1)[0]] = value;
	}
	inspect() {}
	stopInspecting() {}
	showMenu() {}
}
// used to access TreeExplorerStore.nodesById (which is currently not populated)
/*export class NodeAccessorPack extends AccessorPack {
	constructor(public nodeID: number) { super(); }
	getValueByPath(path: string[]) {
		return GetValueByPath(TreeExplorerStore.main.nodesById[this.nodeID], path);
	}
	change(path: string[], value: any) {
		TreeExplorerStore.main.changeValue({path, value});
	}
	inspect(path: string[]) {
		TreeExplorerStore.main.inspect(path);
	}
	stopInspecting(path: string[]) {
		TreeExplorerStore.main.stopInspecting(path);
	}
	showMenu(e, val, path) {
		e.preventDefault();
		const {nodesById, selectedNodeId} = TreeExplorerStore.main;
		TreeExplorerStore.main.showContextMenu("attr", e, selectedNodeId, nodesById[selectedNodeId], val, path);
	}
}*/
export class ChangeAccessorPack extends AccessorPack {
	constructor(public changeID: number) { super(); }
	getValueByPath(path: string[]) {
		return GetValueByPath(ActionsStore.main.logItemsById[this.changeID], path);
	}
	change(path: string[], value: any) {
		//ActionsStore.main.changeValue(this.changeID, {path, value});
	}
	inspect(path: string[]) {
		ActionsStore.main.inspect(this.changeID, path);
	}
	stopInspecting(path: string[]) {
		ActionsStore.main.stopInspecting(this.changeID, path);
	}
	showMenu() {}
}