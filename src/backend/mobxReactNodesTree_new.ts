import {Component} from "react";
import {GetBySymbol} from "../utils/General";

export class FiberRootNode {
	current: FiberNode;
}
export class FiberNode {
	type: string | Function;
	child: FiberNode;
	sibling: FiberNode;
	stateNode: Element | Component;
}

export class CompTreeNode {
	static _sendFull = true; // makes-so bridge sends full object instead of stubbing it

	path: string;
	get RenderFuncPath() {
		return `${this.path}/render`;
	}

	typeName: string;
	compIsObservable: boolean;
	compRenderIsObserver: boolean;

	children = [] as CompTreeNode[];
}

export function GetCompTreeForRoots(fiberRoots: FiberRootNode[]): CompTreeNode {
	console.log("GetCompTree... fiberRoots:", fiberRoots);
	if (fiberRoots.length == 0) return new CompTreeNode();
	return GetCompTree(fiberRoots[0].current);
}
export function GetCompTree(fiber: FiberNode, parentPath?: string, indexInParent?: number): CompTreeNode {
	const comp = typeof fiber.type == "function" ? fiber.stateNode as Component : null;

	const result = new CompTreeNode();
	result.path = parentPath == null ? "" : `${parentPath}/children/${indexInParent}`;
	result.typeName = fiber.type == null ? null : typeof fiber.type == "string" ? fiber.type : fiber.type.name;
	if (comp) {
		if (GetBySymbol(comp, "mobx administration")) {
			result.compIsObservable = true;
		}
		if (GetBySymbol(comp["render"], "mobx administration")) {
			result.compRenderIsObserver = true;
		}
	}

	let nextChild = fiber.child;
	while (nextChild != null) {
		const childIndex = result.children.length;
		const childNode = GetCompTree(nextChild, result.path, childIndex);
		result.children.push(childNode);
		nextChild = nextChild.sibling;
	}

	return result;
}

export default (bridge, hook)=>{
	const reactHook = hook.getReactHook();

	const disposables = [
		bridge.sub("backend:getCompTree", ({componentId})=>{
			const fiberRoots = reactHook.fiberRoots.toJSON();
			const compTree = GetCompTreeForRoots(fiberRoots);
			console.log("Got comp-tree:", compTree);
			bridge.send("frontend:receiveCompTree", {compTree});
		}),
	];

	return {
		setup(mobxid, collection) {
		},
		dispose() {
			disposables.forEach(fn=>fn());
		},
	};
};