"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const icons_1 = require("./icons");
ButtonRecord.propTypes = {
    active: prop_types_1.default.bool,
    showTipStartRecoding: prop_types_1.default.bool,
    onClick: prop_types_1.default.func,
};
function ButtonRecord({ active, onClick, showTipStartRecoding }) {
    return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.button), onClick: onClick },
        react_1.default.createElement("span", { className: aphrodite_1.css(styles.record, active && styles.recordActive) }),
        showTipStartRecoding && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.tipStartRecoding) },
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.tipStartRecodingIcon) },
                react_1.default.createElement(icons_1.StartRecordingArrow, null)),
            "Click to start recording"))));
}
exports.default = ButtonRecord;
const styles = aphrodite_1.StyleSheet.create({
    button: {
        display: "inline-block",
        width: 33,
        height: 33,
        position: "relative",
    },
    record: {
        display: "block",
        margin: "10px 10px",
        width: 13,
        height: 13,
        borderRadius: "50%",
        backgroundColor: "#6E6E6E",
    },
    recordActive: {
        backgroundColor: "#ef3217",
        boxShadow: "0 0 0 2px rgba(239, 50, 23, 0.35)",
    },
    tipStartRecoding: {
        width: 160,
        boxSizing: "border-box",
        paddingTop: 9,
        lineHeight: "16px",
        color: "#6e6e6e",
        height: 0,
        position: "absolute",
        bottom: -5,
        left: 13,
        paddingLeft: 25,
    },
    tipStartRecodingIcon: {
        position: "absolute",
        left: 0,
        top: 0,
        opacity: 0.5,
    },
});
