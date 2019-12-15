"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const icons_1 = require("./icons");
class Tab extends react_1.default.PureComponent {
    getIcon() {
        switch (this.props.type) {
            case "changes":
                return react_1.default.createElement(icons_1.ChangesIcon, null);
            case "components":
                return react_1.default.createElement(icons_1.ComponentIcon, null);
            case "performance":
                return react_1.default.createElement(icons_1.TimerIcon, null);
            case "mst":
                return react_1.default.createElement(icons_1.MSTIcon, null);
            default:
                return null;
        }
    }
    render() {
        const { children, active, onClick, processing, } = this.props;
        return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.tab, active && styles.active, processing && styles.processing), onClick: onClick, "data-test": `MainMenu-Tab-${this.props.type}` },
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.icon) }, this.getIcon()),
            react_1.default.createElement("span", { className: aphrodite_1.css(styles.tabLabel) },
                " ",
                children)));
    }
}
Tab.propTypes = {
    type: prop_types_1.default.oneOf(["components", "changes", "performance", "mst"]),
    children: prop_types_1.default.node,
    active: prop_types_1.default.bool,
    processing: prop_types_1.default.bool,
    onClick: prop_types_1.default.func.isRequired,
};
exports.default = Tab;
const styles = aphrodite_1.StyleSheet.create({
    tab: {
        display: "flex",
        alignItems: "center",
        border: "0 none",
        backgroundColor: "transparent",
        color: "#616161",
        fontSize: 13,
        marginRight: 12,
        padding: "10px 3px",
        cursor: "default",
        overflow: "hidden",
    },
    active: {
        boxShadow: "inset 0 -3px 0 0 var(--primary-color)",
    },
    processing: {
        position: "relative",
        ":after": {
            content: '""',
            width: 6,
            height: 6,
            backgroundColor: "#ef3217",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: 2,
            marginTop: -9,
        },
    },
    icon: {
        flex: "0 0 auto",
        display: "inline-flex",
        marginRight: 3,
    },
    tabLabel: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        userSelect: "none",
    },
});
