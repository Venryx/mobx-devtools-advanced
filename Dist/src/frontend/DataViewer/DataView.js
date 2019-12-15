"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/no-array-index-key */
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const Bridge_1 = require("../../Bridge");
const Spinner_1 = __importDefault(require("../Spinner"));
const renderSparseArrayHole = (count, key) => (react_1.default.createElement("li", { key: key },
    react_1.default.createElement("div", { className: aphrodite_1.css(styles.head) },
        react_1.default.createElement("div", { className: aphrodite_1.css(styles.sparseArrayHole) },
            "undefined \u00D7",
            count))));
class DataView extends react_1.default.Component {
    renderItem(name, key, editable, path) {
        return (react_1.default.createElement(this.props.ChildDataItem, { key: key, name: name, path: path || this.props.path.concat([name]), startOpen: this.props.startOpen, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, change: this.props.change, showMenu: this.props.showMenu, editable: editable, ChildDataView: this.props.ChildDataView, ChildDataItem: this.props.ChildDataItem }));
    }
    render() {
        const value = this.props.getValueByPath(this.props.path);
        if (!value) {
            return react_1.default.createElement("div", { className: aphrodite_1.css(styles.missing) }, "null");
        }
        const editable = this.props.change && value[Bridge_1.symbols.editable] === true;
        const isArray = Array.isArray(value);
        const isDeptreeNode = value[Bridge_1.symbols.type] === "deptreeNode";
        const isMap = value[Bridge_1.symbols.type] === "map";
        const isSet = value[Bridge_1.symbols.type] === "set";
        const elements = [];
        if (isArray) {
            // Iterate over array, filling holes with special items
            let lastIndex = -1;
            value.forEach((item, i) => {
                if (lastIndex < i - 1) {
                    // Have we skipped over a hole?
                    const holeCount = i - 1 - lastIndex;
                    elements.push(renderSparseArrayHole(holeCount, `${i}-hole`));
                }
                elements.push(this.renderItem(i, i, editable));
                lastIndex = i;
            });
            if (lastIndex < value.length - 1) {
                // Is there a hole at the end?
                const holeCount = value.length - 1 - lastIndex;
                elements.push(renderSparseArrayHole(holeCount, `${lastIndex}-hole`));
            }
        }
        else if (isDeptreeNode) {
            value.dependencies.forEach((node, i) => {
                elements.push(react_1.default.createElement(this.props.ChildDataItem, { key: i, name: i, path: this.props.path.concat(["dependencies", i]), startOpen: this.props.startOpen, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, change: this.props.change, showMenu: this.props.showMenu, editable: editable, ChildDataView: this.props.ChildDataView, ChildDataItem: this.props.ChildDataItem }));
            });
        }
        else if (isMap) {
            if (value[Bridge_1.symbols.entries]) {
                value[Bridge_1.symbols.entries].forEach(([key], i) => elements.push(this.renderItem(key, key, editable, this.props.path.concat([Bridge_1.symbols.entries, i, 1]))));
            }
        }
        else if (isSet) {
            if (value[Bridge_1.symbols.entries]) {
                value[Bridge_1.symbols.entries].forEach(([key], i) => elements.push(this.renderItem(key, key, editable, this.props.path.concat([Bridge_1.symbols.entries, i, 1]))));
            }
        }
        else {
            // Iterate over a regular object
            let names = Object.keys(value).filter(n => n[0] !== "@" || n[1] !== "@");
            if (this.props.hidenKeysRegex) {
                names = names.filter(n => !this.props.hidenKeysRegex.test(n));
            }
            if (!this.props.noSort) {
                names.sort(alphanumericSort);
            }
            names.forEach(name => elements.push(this.renderItem(name, name, editable)));
        }
        if (!elements.length) {
            if (value[Bridge_1.symbols.inspected] === false)
                return react_1.default.createElement(Spinner_1.default, null);
            return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.empty) }, (() => {
                switch (true) {
                    case isArray:
                        return "Empty array";
                    case isDeptreeNode:
                        return "No dependencies";
                    case isMap:
                        return "Empty map";
                    default:
                        return "Empty object";
                }
            })()));
        }
        return (react_1.default.createElement("ul", { className: `${aphrodite_1.css(styles.container)} ${this.props.className}` }, elements));
    }
}
DataView.propTypes = {
    startOpen: prop_types_1.default.bool,
    change: prop_types_1.default.func,
    className: prop_types_1.default.string,
    path: prop_types_1.default.array.isRequired,
    getValueByPath: prop_types_1.default.func,
    inspect: prop_types_1.default.func,
    stopInspecting: prop_types_1.default.func,
    showMenu: prop_types_1.default.func,
    noSort: prop_types_1.default.func,
    hidenKeysRegex: prop_types_1.default.instanceOf(RegExp),
    ChildDataView: prop_types_1.default.func.isRequired,
    ChildDataItem: prop_types_1.default.func.isRequired,
};
exports.default = DataView;
function alphanumericSort(a, b) {
    if (`${+a}` === a) {
        if (`${+b}` !== b) {
            return -1;
        }
        return +a < +b ? -1 : 1;
    }
    return a < b ? -1 : 1;
}
const styles = aphrodite_1.StyleSheet.create({
    container: {
        listStyle: "none",
        margin: 0,
        padding: 0,
        marginLeft: "0.75rem",
        fontFamily: "const(--font-family-monospace)",
        fontSize: 12,
    },
    head: {
        display: "flex",
        position: "relative",
    },
    empty: {
        marginLeft: "0.75rem",
        padding: "0 5px",
        color: "const(--dataview-preview-value-empty)",
        fontStyle: "italic",
    },
    missing: {
        fontWeight: "bold",
        marginLeft: "0.75rem",
        padding: "2px 5px",
        color: "const(--dataview-preview-value-missing)",
    },
});
