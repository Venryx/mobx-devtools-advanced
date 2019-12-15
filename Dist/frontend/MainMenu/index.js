"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const MainMenuTab_1 = __importDefault(require("./MainMenuTab"));
const getTitle = type => {
    switch (type) {
        case "components":
            return "Components";
        case "changes":
            return "Changes";
        case "performance":
            return "Performance";
        case "mst":
            return "MST";
        default:
            return type;
    }
};
MainMenu.propTypes = {
    availableTabs: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
    activeTab: prop_types_1.default.string.isRequired,
    onTabChange: prop_types_1.default.func.isRequired,
    processingTabs: prop_types_1.default.array.isRequired,
};
function MainMenu({ availableTabs, activeTab, onTabChange, processingTabs, }) {
    return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.container), "data-test": "MainMenu" }, availableTabs.map(type => (react_1.default.createElement(MainMenuTab_1.default, { key: type, type: type, active: activeTab === type, onClick: () => onTabChange(type), processing: processingTabs.includes(type) }, getTitle(type))))));
}
exports.default = MainMenu;
const styles = aphrodite_1.StyleSheet.create({
    container: {
        display: "flex",
        flex: "0 0 auto",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "0 10px",
    },
});
