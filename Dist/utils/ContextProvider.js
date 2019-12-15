"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = __importDefault(require("prop-types"));
class ContextProvider extends react_1.PureComponent {
    getChildContext() {
        return { stores: this.props.stores };
    }
    render() {
        return this.props.children;
    }
}
ContextProvider.propTypes = {
    stores: prop_types_1.default.object.isRequired,
    children: prop_types_1.default.node.isRequired,
};
ContextProvider.childContextTypes = {
    stores: prop_types_1.default.object.isRequired,
};
exports.default = ContextProvider;
