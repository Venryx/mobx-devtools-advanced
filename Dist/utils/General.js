"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ShallowEquals(objA, objB, options) {
    if (objA === objB)
        return true;
    const keysA = Object.keys(objA || {});
    const keysB = Object.keys(objB || {});
    if (keysA.length !== keysB.length)
        return false;
    // Test for A's keys different from B.
    const hasOwn = Object.prototype.hasOwnProperty;
    for (let i = 0; i < keysA.length; i++) {
        const key = keysA[i];
        if (options && options.propsToIgnore && options.propsToIgnore.indexOf(key) != -1)
            continue;
        if (!hasOwn.call(objB, key) || objA[key] !== objB[key])
            return false;
        const valA = objA[key];
        const valB = objB[key];
        if (valA !== valB)
            return false;
    }
    return true;
}
exports.ShallowEquals = ShallowEquals;
function ShallowChanged(objA, objB) {
    return !ShallowEquals(objA, objB);
}
exports.ShallowChanged = ShallowChanged;
function GetBySymbol(obj, symbolName) {
    const symbols = Object.getOwnPropertySymbols(obj);
    const symbol = symbols.find(a => a.toString() == `Symbol(${symbolName})`);
    return obj[symbol];
}
exports.GetBySymbol = GetBySymbol;
