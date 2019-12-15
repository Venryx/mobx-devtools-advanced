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
class Checkbox extends react_1.default.PureComponent {
    componentDidMount() {
        if (this.props.indeterminate === true) {
            this.setIndeterminate(true);
        }
    }
    componentDidUpdate(previousProps) {
        if (previousProps.indeterminate !== this.props.indeterminate) {
            this.setIndeterminate(this.props.indeterminate);
        }
    }
    setIndeterminate(indeterminate) {
        this.el.indeterminate = indeterminate;
    }
    render() {
        const _a = this.props, { indeterminate } = _a, props = __rest(_a, ["indeterminate"]);
        return (react_1.default.createElement("input", Object.assign({}, props, { type: "checkbox", ref: el => {
                this.el = el;
            } })));
    }
}
Checkbox.propTypes = {
    indeterminate: prop_types_1.default.bool,
};
exports.Checkbox = Checkbox;
