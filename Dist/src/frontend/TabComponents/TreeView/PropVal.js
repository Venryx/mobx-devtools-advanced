"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_dom_1 = __importDefault(require("react-dom"));
const aphrodite_1 = require("aphrodite");
const react_addons_create_fragment_1 = __importDefault(require("react-addons-create-fragment"));
const flash_1 = __importDefault(require("./flash"));
const Bridge_1 = require("../../../Bridge");
class PropVal extends react_1.default.PureComponent {
    componentDidUpdate(prevProps) {
        if (this.props.val === prevProps.val) {
            return;
        }
        if (this.props.val
            && prevProps.val
            && typeof this.props.val === "object"
            && typeof prevProps.val === "object") {
            return;
        }
        const node = react_dom_1.default.findDOMNode(this); // eslint-disable-line
        flash_1.default(node, "#FFFF00", "transparent", 1);
    }
    render() {
        return previewProp(this.props.val, !!this.props.nested);
    }
}
PropVal.propTypes = {
    val: prop_types_1.default.any,
    nested: prop_types_1.default.bool,
};
exports.default = PropVal;
function previewProp(val, nested) {
    if (typeof val === "number") {
        return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropNumber) }, val);
    }
    if (typeof val === "string") {
        const finalVal = val.length > 50 ? `${val.slice(0, 50)}…` : val;
        return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropString) }, `"${finalVal}"`);
    }
    if (typeof val === "boolean") {
        return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewProp) }, String(val));
    }
    if (Array.isArray(val)) {
        if (nested) {
            return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropArray) },
                "[(",
                val.length,
                ")]"));
        }
        return previewArray(val);
    }
    if (!val) {
        return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewProp) }, `${val}`);
    }
    if (typeof val !== "object") {
        return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewProp) }, "\u2026");
    }
    switch (val[Bridge_1.symbols.type]) {
        case "date": {
            return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewProp) }, val[Bridge_1.symbols.name]);
        }
        case "function": {
            return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropFn) },
                val[Bridge_1.symbols.name] || "fn",
                "()"));
        }
        case "object": {
            return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropFn) }, `${val[Bridge_1.symbols.name]}{…}`);
        }
        case "array": {
            return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropArray) },
                "Array[",
                val[Bridge_1.symbols.meta].length,
                "]"));
        }
        case "typed_array":
        case "array_buffer":
        case "data_view": {
            return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropArray) }, `${val[Bridge_1.symbols.name]}[${val[Bridge_1.symbols.meta]
                .length}]`));
        }
        case "iterator": {
            return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropIterator) }, `${val[Bridge_1.symbols.name]}(…)`);
        }
        case "symbol": {
            // the name is "Symbol(something)"
            return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropSymbol) }, val[Bridge_1.symbols.name]);
        }
        default:
            break;
    }
    if (nested) {
        return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewPropNested) }, "{…}");
    }
    return previewObject(val);
}
function previewArray(val) {
    const items = {};
    val.slice(0, 3).forEach((item, i) => {
        items[`n${i}`] = react_1.default.createElement(PropVal, { val: item, nested: true });
        items[`c${i}`] = ", ";
    });
    if (val.length > 3) {
        items.last = "…";
    }
    else {
        delete items[`c${val.length - 1}`];
    }
    return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewArray) },
        "[",
        react_addons_create_fragment_1.default(items),
        "]"));
}
function previewObject(val) {
    const names = Object.keys(val);
    const items = {};
    names.slice(0, 3).forEach((name, i) => {
        items[`k${i}`] = react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewObjectAttr) }, name);
        items[`c${i}`] = ": ";
        items[`v${i}`] = react_1.default.createElement(PropVal, { val: val[name], nested: true });
        items[`m${i}`] = ", ";
    });
    if (names.length > 3) {
        items.rest = "…";
    }
    else {
        delete items[`m${names.length - 1}`];
    }
    return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewObject) },
        "{",
        react_addons_create_fragment_1.default(items),
        "}"));
}
const styles = aphrodite_1.StyleSheet.create({
    previewProp: {
        color: "var(--treenode-props-value)",
    },
    previewPropNumber: {
        color: "var(--treenode-props-value-prop-number)",
    },
    previewPropString: {
        color: "var(--treenode-props-value-prop-string)",
    },
    previewPropArray: {
        color: "var(--treenode-props-value-prop-array)",
    },
    previewPropNonObject: {
        color: "var(--treenode-props-value-prop-nonobject)",
    },
    previewPropFn: {
        color: "var(--treenode-props-value-prop-fn)",
    },
    previewPropIterator: {
        color: "var(--treenode-props-value-prop-iterator)",
    },
    previewPropSymbol: {
        color: "var(--treenode-props-value-prop-symbol)",
    },
    previewPropNested: {
        color: "var(--treenode-props-value-prop-nested)",
    },
    previewArray: {
        color: "var(--treenode-props-value-array)",
    },
    previewObject: {
        color: "var(--treenode-props-value-object)",
    },
    previewObjectAttr: {
        color: "var(--treenode-props-value-object-attr)",
    },
});
