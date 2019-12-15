"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const icons_1 = require("./icons");
ButtonPickComponent.propTypes = {
    active: prop_types_1.default.bool.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
function ButtonPickComponent({ active, onClick }) {
    return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.button, active && styles.active), onClick: onClick },
        react_1.default.createElement(icons_1.PickComponentIcon, null)));
}
exports.default = ButtonPickComponent;
const styles = aphrodite_1.StyleSheet.create({
    button: {
        flex: "0 0 auto",
        display: "inline-flex",
        width: 33,
        height: 33,
        alignItems: "center",
        justifyContent: "center",
    },
    active: {
        "--light-text-color": "var(--primary-color)",
    },
});
