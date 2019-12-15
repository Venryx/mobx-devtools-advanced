"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const now = typeof window.performance === "object" && window.performance.now
    ? () => window.performance.now()
    : () => Date.now();
exports.allowedComplexObjects = new Set();
exports.symbols = {
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
function serialize(data, path = [], seen = new Map(), propToExtract, sendFull = false) {
    try {
        if (propToExtract !== undefined) {
            data = data[propToExtract]; // eslint-disable-line no-param-reassign
        }
        if (!data || typeof data !== "object") {
            // custom removed
            /*if (typeof data === "string" && data.length > 500) {
                return `${data.slice(0, 500)}...`;
            }*/
            if (typeof data === "symbol") {
                return {
                    [exports.symbols.type]: "symbol",
                    [exports.symbols.name]: data.toString(),
                };
            }
            if (typeof data === "function") {
                return {
                    [exports.symbols.type]: "function",
                    [exports.symbols.name]: data.name,
                };
            }
            return data;
        }
        const seenPath = seen.get(data);
        if (seenPath) {
            return {
                [exports.symbols.reference]: seenPath,
            };
        }
        seen.set(data, path);
        // start non-cached serializing
        const prototype = Object.getPrototypeOf(data);
        const inspecting = exports.allowedComplexObjects.has(data);
        // custom
        if (data._serialize) {
            return data._serialize(path, seen);
        }
        if (sendFull || data._sendFull || (prototype && prototype.constructor._sendFull)) {
            if (typeof data == "object") {
                // temp
                //if (path.length > 10) return `Path too deep. @type(${data.constructor.name}) @keys(${Object.keys(data).join(",")})`;
                const clone = data instanceof Array ? [] : {};
                for (const prop in data) {
                    if (Object.prototype.hasOwnProperty.call(data, prop)) {
                        clone[prop] = serialize(data, path.concat(prop), seen, prop, true);
                    }
                }
                return clone;
            }
            return data;
        }
        if (data instanceof RegExp || data instanceof Date) {
            return data;
        }
        if (data instanceof Array) {
            return data.map((o, i) => serialize(o, path.concat(i), seen));
        }
        if (data instanceof Map || (prototype && prototype.isMobXObservableMap)) {
            const result = {
                [exports.symbols.type]: "map",
                [exports.symbols.name]: data.constructor && data.constructor.name,
                [exports.symbols.inspected]: inspecting,
                [exports.symbols.editable]: false,
                [exports.symbols.mobxObject]: "$mobx" in data,
            };
            if (inspecting) {
                result[exports.symbols.entries] = [...data.entries()];
            }
            return result;
        }
        if (data instanceof Set || (prototype && prototype.isMobXObservableSet)) {
            const result = {
                [exports.symbols.type]: "set",
                [exports.symbols.name]: data.constructor && data.constructor.name,
                [exports.symbols.inspected]: inspecting,
                [exports.symbols.editable]: false,
                [exports.symbols.mobxObject]: "$mobx" in data,
            };
            if (inspecting) {
                result[exports.symbols.entries] = [...data.entries()];
            }
            return result;
        }
        if (prototype && prototype !== Object.prototype) {
            // This is complex object (dom node or mobx.something)
            // only short signature will be sent to prevent performance loss
            const result = {
                [exports.symbols.type]: "object",
                [exports.symbols.name]: data.constructor && data.constructor.name,
                [exports.symbols.inspected]: inspecting,
                [exports.symbols.editable]: true,
                [exports.symbols.mobxObject]: "$mobx" in data,
                [exports.symbols.proto]: {
                    [exports.symbols.type]: "object",
                    [exports.symbols.name]: prototype.constructor && prototype.constructor.name,
                    [exports.symbols.inspected]: false,
                    [exports.symbols.editable]: false,
                },
            };
            if (inspecting) {
                for (const p in data) {
                    if (Object.prototype.hasOwnProperty.call(data, p)) {
                        result[p] = serialize(data, path.concat(p), seen, p);
                    }
                }
            }
            return result;
        }
        const clone = {};
        for (const prop in data) {
            if (Object.prototype.hasOwnProperty.call(data, prop)) {
                clone[prop] = serialize(data, path.concat(prop), seen, prop);
            }
        }
        return clone;
    }
    catch (error) {
        return {
            [exports.symbols.type]: "serializationError",
            message: error && error.message,
        };
    }
}
exports.serialize = serialize;
exports.deserialize = (data, root) => {
    if (!data || typeof data !== "object")
        return data;
    if (data instanceof Array) {
        return data.map(o => exports.deserialize(o, root || data));
    }
    if (data[exports.symbols.reference]) {
        return data[exports.symbols.reference].reduce((acc, next) => acc[next], root || data);
    }
    for (const prop in data) {
        if (Object.prototype.hasOwnProperty.call(data, prop)) {
            data[prop] = exports.deserialize(data[prop], root || data);
        }
    }
    return data;
};
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
        return setTimeout(() => {
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
class Bridge {
    constructor(wall) {
        this.$listeners = [];
        this.$buffer = [];
        this.$wall = wall;
        this.$serialize = serialize;
        this.$deserialize = exports.deserialize;
        wall.listen(this.$handleMessage.bind(this));
    }
    serializationOff() {
        // When there is no need in serialization, dont waste resources
        this.$serialize = a => a;
        this.$deserialize = a => a;
    }
    send(eventName, eventData = {}) {
        this.$buffer.push({ type: "event", eventName, eventData });
        this.scheduleFlush();
    }
    pause() {
        this.$wall.send({ type: "pause" });
    }
    resume() {
        this.$wall.send({ type: "resume" });
    }
    sub(eventName, fn) {
        if (this.$listeners[eventName] === undefined) {
            this.$listeners[eventName] = [];
        }
        this.$listeners[eventName].push(fn);
        return () => {
            const ix = this.$listeners[eventName].indexOf(fn);
            if (ix !== -1) {
                this.$listeners[eventName].splice(ix, 1);
            }
        };
    }
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
        }
        else {
            exports.allowedComplexObjects.clear();
        }
    }
    flushBufferSlice(bufferSlice) {
        const events = bufferSlice.map(({ eventName, eventData }) => ({
            eventName,
            eventData: this.$serialize(eventData),
        }));
        this.$wall.send({ type: "many-events", events });
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
                handlers.forEach(fn => fn());
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
            const eventData = this.$deserialize(payload.eventData);
            if (handlers) {
                handlers.forEach(fn => fn(eventData));
            }
        }
        if (payload.type === "many-events") {
            payload.events.forEach(event => {
                const handlers = this.$listeners[event.eventName];
                const eventData = this.$deserialize(event.eventData);
                if (handlers) {
                    handlers.forEach(fn => fn(eventData));
                }
            });
        }
    }
}
exports.default = Bridge;
