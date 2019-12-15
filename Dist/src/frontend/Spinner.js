"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const aphrodite_1 = require("aphrodite");
exports.default = () => react_1.default.createElement("div", { className: aphrodite_1.css(styles.spinner) });
const styles = aphrodite_1.StyleSheet.create({
    spinner: {
        borderRadius: "50%",
        width: 22,
        height: 22,
        margin: "10px auto",
        position: "relative",
        borderTop: "2px solid var(--primary-color)",
        borderRight: "2px solid var(--primary-color)",
        borderBottom: "2px solid transparent",
        borderLeft: "2px solid transparent",
        transform: "translateZ(0)",
        animationName: [
            {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
            },
        ],
        animationDuration: "500ms",
        overflow: "hidden",
        animationIterationCount: "infinite",
        animationTimingFunction: "linear",
    },
});
