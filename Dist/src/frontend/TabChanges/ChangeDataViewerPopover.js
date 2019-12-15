"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Aphrodite = __importStar(require("aphrodite"));
const PreviewValue_1 = require("../PreviewValue");
const InjectStores_1 = require("../../utils/InjectStores");
const Popover_1 = __importDefault(require("../Popover"));
const index_1 = __importDefault(require("../DataViewer/index"));
const { css, StyleSheet } = Aphrodite;
function ChangeDataViewerPopover(props) {
    const { className, displayName, path, getValueByPath, inspect, stopInspecting, showMenu } = props;
    const value = getValueByPath(path);
    //console.log("Value:", value);
    const otype = typeof value;
    if (otype === "number"
        || otype === "string"
        || value === null
        || value === undefined
        || otype === "boolean") {
        return react_1.default.createElement(PreviewValue_1.PreviewValue, { data: value, className: className, path: path });
    }
    const dataViewer = (react_1.default.createElement(index_1.default, { path: path, getValueByPath: getValueByPath, inspect: inspect, stopInspecting: stopInspecting, showMenu: showMenu, decorator: InjectStores_1.InjectStores({
            subscribe: (stores, props) => ({
                actionsLoggerStore: [`inspected--${props.path.join("/")}`],
            }),
            shouldUpdate: () => true,
        }) }));
    return (react_1.default.createElement(Popover_1.default, { requireClick: true, content: dataViewer, onShown: () => inspect(path) },
        react_1.default.createElement("span", { className: `${css(styles.trigger)} ${className}`, onContextMenu: e => {
                if (typeof showMenu === "function") {
                    showMenu(e, undefined, path);
                }
            } },
            react_1.default.createElement(PreviewValue_1.PreviewValue, { data: value, displayName: displayName, path: path }))));
}
exports.ChangeDataViewerPopover = ChangeDataViewerPopover;
const styles = StyleSheet.create({
    trigger: {
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: 2,
        cursor: "pointer",
        ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
    },
});
