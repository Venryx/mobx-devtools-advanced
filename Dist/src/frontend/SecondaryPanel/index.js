"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
SecondaryPanel.propTypes = {
    children: prop_types_1.default.node,
};
function SecondaryPanel({ children }) {
    return react_1.default.createElement("div", { className: aphrodite_1.css(styles.panel) }, children);
}
exports.default = SecondaryPanel;
const styles = aphrodite_1.StyleSheet.create({
    panel: {
        display: "flex",
        flex: "0 0 auto",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        alignItems: "center",
    },
});
