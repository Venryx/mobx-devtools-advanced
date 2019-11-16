import getId from "../utils/getId";
import getDependencyTree from "../utils/getDependencyTree";
import {hightlight, stopHighlightingAll} from "./utils/highlight";
import domNodePicker from "./utils/domNodePicker";
import makeInspector from "./utils/inspector";
import storaTempValueInGlobalScope from "./utils/storaTempValueInGlobalScope";
import {symbols} from "../Bridge";

export default (bridge, hook)=>{
	const reactHook = hook.getReactHook();

	const disposables = [
		bridge.sub("backend:getFiberRoots", ({componentId})=>{
			const fiberRoots = reactHook.fiberRoots.toJSON();
			console.log("In: backend:getFiberRoots", fiberRoots);
			//return reactHook.fiberRoots.length;
			bridge.send("frontend:receiveFiberRoots", {fiberRoots});
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