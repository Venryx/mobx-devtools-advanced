"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map = new WeakMap();
let i = 0;
exports.default = object => {
    const id = object && map.get(object);
    if (id)
        return id;
    i += 1;
    if (object)
        map.set(object, i);
    return i;
};
