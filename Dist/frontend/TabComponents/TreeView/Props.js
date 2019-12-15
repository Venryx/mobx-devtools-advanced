"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const PropVal_1 = __importDefault(require("./PropVal"));
class Props extends react_1.default.PureComponent {
    render() {
        const { props } = this.props;
        if (!props || typeof props !== "object") {
            return react_1.default.createElement("span", null);
        }
        const names = Object.keys(props).filter(name => name !== "children");
        const items = [];
        names.slice(0, 3).forEach(name => {
            items.push(react_1.default.createElement("span", { key: `prop-${name}`, className: aphrodite_1.css(styles.prop) },
                react_1.default.createElement("span", { className: aphrodite_1.css(styles.attributeName) }, name),
                "=",
                react_1.default.createElement(PropVal_1.default, { val: props[name] })));
        });
        if (names.length > 3) {
            items.push(react_1.default.createElement("span", { key: "ellipsis", className: aphrodite_1.css(styles.ellipsis) }, "\u2026"));
        }
        return react_1.default.createElement("span", null, items);
    }
}
Props.propTypes = {
    props: prop_types_1.default.object,
};
exports.default = Props;
const styles = aphrodite_1.StyleSheet.create({
    attributeName: {
        color: "var(--treenode-props-key)",
    },
    ellipsis: {
        color: "var(--treenode-props-ellipsis)",
    },
    prop: {
        paddingLeft: 5,
        color: "var(--treenode-props)",
    },
});
