"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
class Blocker extends react_1.default.PureComponent {
    renderIcon() {
        switch (this.props.icon) {
            case "mobx":
                return (react_1.default.createElement("svg", { baseProfile: "basic", xmlns: "http://www.w3.org/2000/svg", width: "128", height: "128", viewBox: "0 0 128 128" },
                    react_1.default.createElement("path", { fill: "none", stroke: "#333232", strokeWidth: "14", strokeMiterlimit: "10", d: "M8 15h14v98H8M120 15h-14v98h14" }),
                    react_1.default.createElement("path", { fill: "none", stroke: "var(--primary-color)", strokeWidth: "18", strokeLinecap: "square", strokeMiterlimit: "10", d: "M50 57l14 14 14-14" })));
            case "pick":
                return (react_1.default.createElement("svg", { baseProfile: "basic", xmlns: "http://www.w3.org/2000/svg", width: "128", height: "128", viewBox: "-58.5 0 128 128" },
                    react_1.default.createElement("path", { d: "M-21.165 10.665L42.84 70.397l-30.943 2.67L29.5 112l-11.728 5.34L.7 77.864-21.165 98.66V10.664" })));
            default:
                return undefined;
        }
    }
    render() {
        return (react_1.default.createElement("div", { onClick: this.props.onClick, style: {
                position: "fixed",
                zIndex: 1,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                fontSize: "18px",
                background: "rgba(255, 255, 255, 0.8)",
            } },
            this.renderIcon(),
            react_1.default.createElement("div", { style: { margin: "10px" } }, this.props.children)));
    }
}
Blocker.propTypes = {
    children: prop_types_1.default.node,
    icon: prop_types_1.default.string,
    onClick: prop_types_1.default.func,
};
Blocker.defaultProps = {
    icon: "mobx",
    children: undefined,
    onClick: undefined,
};
exports.default = Blocker;
