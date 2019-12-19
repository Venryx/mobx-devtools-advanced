import {E, Assert} from "js-vextensions";
import {_path} from "./utils/changesProcessor";
import {GetValueByPath} from "./utils/General";

const now = typeof window.performance === "object" && window.performance.now
	? ()=>window.performance.now()
	: ()=>Date.now();

//export const allowedComplexObjects = new Set();

export const symbols = {
	type: "@@type",
	name: "@@name",
	entries: "@@entries",
	reference: "@@reference",
	proto: "@@proto",
	inspected: "@@inspected",
	editable: "@@editable",
	mobxObject: "@@mobxObject",
	serializationException: "@@serializationException",
};

export class SerializeOptions {
	autoSerializeDepth? = 7;
}
export class SerializeExtras {
	isObjProp?: boolean;
	sendFull?: boolean;
	lateInspecting?: boolean;
	lateInspect_pathInSerializeRoot?: string[];
	lateInspect_pathInChange?: string[];
}
export function Serialize(opt: SerializeOptions, data, path = [] as string[], seen = new Map(), extras?: SerializeExtras) {
	opt = Object.assign(new SerializeOptions(), opt);
	extras = extras || {};

	try {
		if (!data || typeof data !== "object") {
			/*if (typeof data === "string" && data.length > 500) {
				return `${data.slice(0, 500)}...`;
			}*/
			if (typeof data === "symbol") {
				return {
					[symbols.type]: "symbol",
					[symbols.name]: data.toString(),
				};
			}
			if (typeof data === "function") {
				return {
					[symbols.type]: "function",
					[symbols.name]: data.name,
				};
			}
			return data;
		}

		const seenPath = seen.get(data);
		if (seenPath) {
			return {
				[symbols.reference]: seenPath,
			};
		}
		seen.set(data, path);

		// start non-cached serializing
		const prototype = Object.getPrototypeOf(data);
		//const directlyInspecting = allowedComplexObjects.has(data);
		const lateInspecting_root = extras.lateInspect_pathInSerializeRoot != null && path.join("/") == extras.lateInspect_pathInSerializeRoot.join("/");
		const lateInspecting = extras.lateInspecting || lateInspecting_root;
		//let withinLateInspect = extras.lateInspect_pathInSerializeRoot != null && path.slice(0, extras.lateInspect_pathInSerializeRoot.length).every((segment, index)=>segment == extras.lateInspect_pathInSerializeRoot[index]);
		const withinLateInspect = extras.lateInspect_pathInSerializeRoot != null && path.join("/").startsWith(extras.lateInspect_pathInSerializeRoot.join("/"));
		let serializeData: boolean;
		if (withinLateInspect) {
			/*const pathInChangeData = path.slice(extras.lateInspect_pathInChange.length);
			const pathInLateInspect = extras.lateInspect_pathInChange.concat(pathInChangeData);
			var inAutoSerializeDepth = pathInLateInspect.length <= opt.autoSerializeDepth;*/
			serializeData = lateInspecting_root; // only serialize one new layer at a time
		} else {
			var inAutoSerializeDepth = path.length <= opt.autoSerializeDepth;
			serializeData = inAutoSerializeDepth;
		}

		const childExtras_base = E(extras, {isObjProp: null, inspecting: lateInspecting});

		// custom
		if (data._serialize) {
			return data._serialize(path, seen);
		}
		if (extras.sendFull || data._sendFull || (prototype && prototype.constructor._sendFull)) {
			if (typeof data == "object") {
				// temp
				//if (path.length > 10) return `Path too deep. @type(${data.constructor.name}) @keys(${Object.keys(data).join(",")})`;

				const clone = data instanceof Array ? [] : {};
				for (const prop in data) {
					if (Object.prototype.hasOwnProperty.call(data, prop)) {
						clone[prop] = Serialize(opt, data[prop], path.concat(prop), seen, E(childExtras_base, {isObjProp: true, sendFull: true}));
					}
				}
				// special keys to copy, even though non-enumerable
				//if (data[_path]) clone["_path"] = data[_path];
				return clone;
			}
			return data;
		}

		if (data instanceof RegExp || data instanceof Date) {
			return data;
		}

		if (data instanceof Array) {
			return data.map((o, i)=>Serialize(opt, o, path.concat(`${i}`), seen, childExtras_base));
		}

		// object-like (meaning we can add metadata)
		// ==========

		const result = {
			[symbols.name]: data.constructor && data.constructor.name,
			[symbols.mobxObject]: "$mobx" in data,
		};
		const complexObject = prototype && prototype !== Object.prototype;
		const canBeLateInspected = !inAutoSerializeDepth || lateInspecting_root;
		// if can be inspected, we need to signify that by adding the "@@inspected" key, even if its value is false atm
		if (canBeLateInspected) {
			Object.assign(result, {
				[symbols.inspected]: lateInspecting_root,
			});
		}

		if (data instanceof Map || (prototype && prototype.isMobXObservableMap)) {
			Object.assign(result, {
				[symbols.type]: "map",
				[symbols.editable]: false, // TODO: figure out the way to edit maps
			});
			if (serializeData) {
				result[symbols.entries] = [...(data as Map<any, any>).entries()].map(([key, value], i)=>{
					return [
						Serialize(opt, key, path.concat(symbols.entries, `${i}`, "0"), seen, childExtras_base),
						Serialize(opt, value, path.concat(symbols.entries, `${i}`, "1"), seen, childExtras_base),
					];
				});
			}
		} else if (data instanceof Set || (prototype && prototype.isMobXObservableSet)) {
			Object.assign(result, {
				[symbols.type]: "set",
				[symbols.editable]: false, // TODO: figure out the way to edit sets
			});
			if (serializeData) {
				result[symbols.entries] = [...(data as Set<any>).entries()].map(([key, value], i)=>{
					return [
						Serialize(opt, key, path.concat(symbols.entries, `${i}`, "0"), seen, childExtras_base),
						Serialize(opt, value, path.concat(symbols.entries, `${i}`, "1"), seen, childExtras_base),
					];
				});
			}
		} else {
			//const complexObject = prototype && prototype !== Object.prototype;
			Object.assign(result, {
				[symbols.type]: "object",
			});
			// If value is complex object (dom node or mobx.something), add some extra metadata
			if (complexObject) {
				Object.assign(result, {
					//[symbols.type]: "object",
					[symbols.editable]: true,
					[symbols.proto]: {
						[symbols.type]: "object",
						[symbols.name]: prototype.constructor && prototype.constructor.name,
						[symbols.inspected]: false,
						[symbols.editable]: false,
					},
				});
			}
			if (serializeData) {
				for (const key in data) {
					if (Object.prototype.hasOwnProperty.call(data, key)) {
						result[key] = Serialize(opt, data[key], path.concat(key), seen, E(childExtras_base, {isObjProp: true}));
					}
				}
			}
		}

		return result;
	} catch (error) {
		return {
			[symbols.type]: "serializationError",
			message: error && error.message,
		};
	}
}

export function Deserialize(data, root?) {
	if (!data || typeof data !== "object") return data;
	if (data instanceof Array) {
		return data.map(o=>Deserialize(o, root || data));
	}
	if (data[symbols.reference]) {
		//return data[symbols.reference].reduce((acc, next)=>acc[next], root || data);
		const path = data[symbols.reference];
		return GetValueByPath(root || data, path);
	}
	for (const prop in data) {
		if (Object.prototype.hasOwnProperty.call(data, prop)) {
			data[prop] = Deserialize(data[prop], root || data);
		}
	}
	return data;
}

// Custom polyfill that runs the queue with a backoff.
// If you change it, make sure it behaves reasonably well in Firefox.
let lastRunTimeMS = 5;
const cancelIdleCallback = window["cancelIdleCallback"] || clearTimeout;
const requestIdleCallback = window["requestIdleCallback"]
	|| function reqIdleCallback(cb) {
		// Magic numbers determined by tweaking in Firefox.
		// There is no special meaning to them.
		let delayMS = 3000 * lastRunTimeMS;
		if (delayMS > 500) {
			delayMS = 500;
		}

		return setTimeout(()=>{
			const startTime = now();
			cb({
				didTimeout: false,
				timeRemaining() {
					return Infinity;
				},
			});
			const endTime = now();
			lastRunTimeMS = (endTime - startTime) / 1000;
		}, delayMS);
	};

export class Bridge {
	//@observable static main: Bridge;
	static main: Bridge;

	$listeners = [];

	$buffer = [];

	$wall;
	serialize = Serialize;
	serializeOptions = new SerializeOptions();
	deserialize = Deserialize;
	constructor(wall) {
		Bridge.main = this;
		this.$wall = wall;
		wall.listen(this.$handleMessage.bind(this));
	}

	serializationOff() {
		// When there is no need in serialization, dont waste resources
		this.serialize = a=>a;
		this.deserialize = a=>a;
	}

	send(eventName, eventData = {}) {
		this.$buffer.push({type: "event", eventName, eventData});
		this.scheduleFlush();
	}

	pause() {
		this.$wall.send({type: "pause"});
	}

	resume() {
		this.$wall.send({type: "resume"});
	}

	sub(eventName, fn) {
		if (this.$listeners[eventName] === undefined) {
			this.$listeners[eventName] = [];
		}
		this.$listeners[eventName].push(fn);
		return ()=>{
			const ix = this.$listeners[eventName].indexOf(fn);
			if (ix !== -1) {
				this.$listeners[eventName].splice(ix, 1);
			}
		};
	}

	$flushHandle;
	$paused;
	scheduleFlush() {
		if (!this.$flushHandle && this.$buffer.length) {
			const timeout = this.$paused ? 5000 : 500;
			this.$flushHandle = requestIdleCallback(this.flushBufferWhileIdle.bind(this), {
				timeout,
			});
		}
	}

	cancelFlush() {
		if (this.$flushHandle) {
			cancelIdleCallback(this.$flushHandle);
			this.$flushHandle = null;
		}
	}

	flushBufferWhileIdle(deadline) {
		this.$flushHandle = null;

		// Magic numbers were determined by tweaking in a heavy UI and seeing
		// what performs reasonably well both when DevTools are hidden and visible.
		// The goal is that we try to catch up but avoid blocking the UI.
		// When paused, it's okay to lag more, but not forever because otherwise
		// when user activates React tab, it will freeze syncing.
		const chunkCount = this.$paused ? 20 : 10;
		const chunkSize = Math.round(this.$buffer.length / chunkCount);
		const minChunkSize = this.$paused ? 50 : 100;

		while (this.$buffer.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
			const take = Math.min(this.$buffer.length, Math.max(minChunkSize, chunkSize));
			const currentBuffer = this.$buffer.splice(0, take);
			this.flushBufferSlice(currentBuffer);
		}

		if (this.$buffer.length) {
			this.scheduleFlush();
		} else {
			//allowedComplexObjects.clear();
		}
	}

	flushBufferSlice(bufferSlice) {
		const events = bufferSlice.map(({eventName, eventData})=>{
			const extras = {} as SerializeExtras;
			if (eventName == "inspect-change-result") {
				extras.lateInspect_pathInSerializeRoot = ["data"];
				extras.lateInspect_pathInChange = eventData.path;
			}
			return {
				eventName,
				eventData: this.serialize(this.serializeOptions, eventData, undefined, undefined, extras),
			};
		});
		this.$wall.send({type: "many-events", events});
	}

	once(eventName, fn) {
		const self = this;
		function listener(e, eventData) {
			fn.call(this, e, eventData);
			const ix = self.$listeners[eventName].indexOf(listener);
			if (ix !== -1) {
				self.$listeners[eventName].splice(ix, 1);
			}
		}
		return this.sub(eventName, listener);
	}

	$handleMessage(payload) {
		if (typeof payload === "string") {
			const handlers = this.$listeners[payload];
			if (handlers) {
				handlers.forEach(fn=>fn());
			}
		}

		if (payload.type === "resume") {
			this.$paused = false;
			this.scheduleFlush();
			return;
		}

		if (payload.type === "pause") {
			this.$paused = true;
			this.cancelFlush();
			return;
		}

		if (payload.type === "event") {
			const handlers = this.$listeners[payload.eventName];
			const eventData = this.deserialize(payload.eventData);
			if (handlers) {
				handlers.forEach(fn=>fn(eventData));
			}
		}

		if (payload.type === "many-events") {
			payload.events.forEach(event=>{
				const handlers = this.$listeners[event.eventName];
				const eventData = this.deserialize(event.eventData);
				if (handlers) {
					handlers.forEach(fn=>fn(eventData));
				}
			});
		}
	}
}