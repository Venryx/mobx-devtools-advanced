"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidRegex(needle) {
    let isValid = true;
    if (needle) {
        try {
            searchTextToRegExp(needle);
        }
        catch (error) {
            isValid = false;
        }
    }
    return isValid;
}
exports.isValidRegex = isValidRegex;
/**
 * Convert the specified search text to a RegExp.
 */
function searchTextToRegExp(needle) {
    return new RegExp(trimSearchText(needle), "gi");
}
exports.searchTextToRegExp = searchTextToRegExp;
/**
 * Should the current search text be converted to a RegExp?
 */
function shouldSearchUseRegex(needle) {
    return !!needle && needle.charAt(0) === "/" && trimSearchText(needle).length > 0;
}
exports.shouldSearchUseRegex = shouldSearchUseRegex;
/**
 * '/foo/' => 'foo'
 * '/bar' => 'bar'
 * 'baz' => 'baz'
 */
function trimSearchText(needle) {
    if (needle.charAt(0) === "/") {
        return needle.substr(1);
    }
    if (needle.charAt(needle.length - 1) === "/") {
        return needle.substr(0, needle.length - 1);
    }
    return needle;
}
exports.trimSearchText = trimSearchText;
