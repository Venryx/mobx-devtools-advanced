import {symbols} from "../Bridge";

export function ShallowEquals(objA, objB, options?: {propsToIgnore?: string[]}) {
	if (objA === objB) return true;

	const keysA = Object.keys(objA || {});
	const keysB = Object.keys(objB || {});
	if (keysA.length !== keysB.length) return false;

	// Test for A's keys different from B.
	const hasOwn = Object.prototype.hasOwnProperty;
	for (let i = 0; i < keysA.length; i++) {
		const key = keysA[i];
		if (options && options.propsToIgnore && options.propsToIgnore.indexOf(key) != -1) continue;
		if (!hasOwn.call(objB, key) || objA[key] !== objB[key]) return false;

		const valA = objA[key];
		const valB = objB[key];
		if (valA !== valB) return false;
	}

	return true;
}

export function ShallowChanged(objA, objB) {
	return !ShallowEquals(objA, objB);
}

export function GetBySymbol(obj: Object, symbolName: string) {
	const symbols = Object.getOwnPropertySymbols(obj);
	const symbol = symbols.find(a=>a.toString() == `Symbol(${symbolName})`);
	return obj[symbol];
}

export function GetValueByPath(obj: any, path: string[], createObjIfMissing = false) {
	//return path.reduce((acc, next)=>acc && acc[next], change);
	let result = obj;
	for (const segment of path) {
		if (result != null) {
			let nextValue = GetNextValueInPath(result, segment);
			if (nextValue === undefined && createObjIfMissing) {
				nextValue = SetNextValueInPath(result, segment, {});
			}
			result = nextValue;
		}
	}
	return result;
}
export function GetNextValueInPath(currentObj: any, currentSegment: string) {
	if (currentSegment == symbols.entries && (currentObj instanceof Map || currentObj instanceof Set)) {
		return [...currentObj.entries()];
	}
	if (currentSegment == symbols.proto) {
		return currentObj.__proto__;
	}
	return currentObj[currentSegment];
}
export function SetNextValueInPath<T>(currentObj: any, currentSegment: string, newValue: T): T {
	if (currentSegment == symbols.entries && (currentObj instanceof Map || currentObj instanceof Set)) {
		throw new Error("Not yet implemented.");
	}
	if (currentSegment == symbols.proto) {
		throw new Error("Not yet implemented.");
	}
	return currentObj[currentSegment] = newValue;
}