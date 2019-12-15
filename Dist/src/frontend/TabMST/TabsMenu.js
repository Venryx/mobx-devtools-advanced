"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
class TabsMenu extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.tabRenderer = ({ id, title }) => (react_1.default.createElement("div", { key: id, 
            // eslint-disable-next-line react/jsx-no-bind
            onClick: () => this.props.onChange(id), className: aphrodite_1.css(styles.tab, this.props.currentTabId === id && styles.tabActive), title: title }, title));
    }
    render() {
        return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.tabs) }, this.props.tabs.map(this.tabRenderer)));
    }
}
TabsMenu.propTypes = {
    tabs: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        id: prop_types_1.default.any,
        title: prop_types_1.default.string,
    })).isRequired,
    currentTabId: prop_types_1.default.any,
    onChange: prop_types_1.default.func.isRequired,
};
exports.default = TabsMenu;
const styles = aphrodite_1.StyleSheet.create({
    tabs: {
        flex: "0 0 auto",
        display: "flex",
        padding: "5px 5px 0",
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        borderBottom: "1px solid #ddd",
        cursor: "default",
        userSelect: "none",
    },
    tab: {
        padding: "3px 5px",
        borderColor: "transparent",
        borderStyle: "solid",
        borderWidth: "1px 1px 0",
        fontSize: 13,
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    tabActive: {
        borderColor: "#ddd",
        cursor: "default",
        backgroundColor: "#fff",
    },
});
