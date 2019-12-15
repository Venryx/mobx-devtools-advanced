"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SearchUtils = __importStar(require("./SearchUtils"));
function nodeMatchesText(node, needle) {
    const { name } = node;
    const useRegex = SearchUtils.shouldSearchUseRegex(needle);
    if (name) {
        return validString(name, needle, useRegex);
    }
    const { text } = node;
    if (text) {
        return validString(text, needle, useRegex);
    }
    const { children } = node;
    if (typeof children === "string") {
        return validString(children, needle, useRegex);
    }
    return false;
}
exports.default = nodeMatchesText;
function validString(str, needle, regex) {
    if (regex) {
        try {
            const regExp = SearchUtils.searchTextToRegExp(needle);
            return regExp.test(str.toLowerCase());
        }
        catch (error) {
            return false;
        }
    }
    return str.toLowerCase().indexOf(needle) !== -1;
}
