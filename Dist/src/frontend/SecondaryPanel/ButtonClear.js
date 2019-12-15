"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const aphrodite_1 = require("aphrodite");
const icons_1 = require("./icons");
class ButtonClear extends react_1.default.PureComponent {
    render() {
        return (react_1.default.createElement("div", Object.assign({ className: aphrodite_1.css(styles.button) }, this.props),
            react_1.default.createElement(icons_1.ClearIcon, null)));
    }
}
exports.default = ButtonClear;
const styles = aphrodite_1.StyleSheet.create({
    button: {
        flex: "0 0 auto",
        display: "inline-flex",
        width: 33,
        height: 33,
        alignItems: "center",
        justifyContent: "center",
    },
});
