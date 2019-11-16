import {Component} from "react";

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

	typeName: string;
	children = [] as CompTreeNode[];
}

export function GetCompTreeForRoots(fiberRoots: FiberRootNode[]): CompTreeNode {
	console.log("GetCompTree... fiberRoots:", fiberRoots);
	if (fiberRoots.length == 0) return new CompTreeNode();
	return GetCompTree(fiberRoots[0].current);
}
export function GetCompTree(fiber: FiberNode): CompTreeNode {
	const result = new CompTreeNode();
	result.typeName = fiber.type == null ? null : typeof fiber.type == "string" ? fiber.type : fiber.type.name;

	let nextChild = fiber.child;
	while (nextChild != null) {
		result.children.push(GetCompTree(nextChild));
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