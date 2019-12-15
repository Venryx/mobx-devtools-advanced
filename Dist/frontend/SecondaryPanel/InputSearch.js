"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
class InputSearch extends react_1.default.PureComponent {
    render() {
        return (react_1.default.createElement("input", { type: "search", value: this.props.searchText, onChange: this.props.changeSearch, placeholder: "Search (string/regex)", style: {
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: 3,
                borderRadius: 4,
                width: 133,
                marginLeft: 10,
            } }));
    }
}
InputSearch.propTypes = {
    searchText: prop_types_1.default.string.isRequired,
    changeSearch: prop_types_1.default.func.isRequired,
};
exports.default = InputSearch;
