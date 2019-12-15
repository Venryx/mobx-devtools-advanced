"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const DataView_1 = __importDefault(require("./DataView"));
const DataItem_1 = __importDefault(require("./DataItem"));
DataViewer.propTypes = {
    decorator: prop_types_1.default.func,
};
function DataViewer(_a) {
    var { decorator } = _a, otherProps = __rest(_a, ["decorator"]);
    const WrappedDataView = decorator(DataView_1.default);
    const WrappedDataItem = decorator(DataItem_1.default);
    return (react_1.default.createElement(WrappedDataView, Object.assign({}, otherProps, { ChildDataItem: WrappedDataItem, ChildDataView: WrappedDataView })));
}
exports.default = DataViewer;
