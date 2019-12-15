"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const aphrodite_1 = require("aphrodite");
const prop_types_1 = __importDefault(require("prop-types"));
const InjectStores_1 = require("../../utils/InjectStores");
const DataViewer_1 = __importDefault(require("../DataViewer"));
const Collapsible_1 = __importDefault(require("../Collapsible"));
const PreviewValue_1 = require("../PreviewValue");
let LogItemExplorer = class LogItemExplorer extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.dataDecorator = InjectStores_1.InjectStores({
            subscribe: (stores, { path }) => ({
                treeExplorerStore: [`inspected--${path.join("/")}`],
            }),
            shouldUpdate: () => true,
        });
    }
    render() {
        if (!this.props.logItem)
            return null;
        return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.logExplorer) },
            this.props.logItem.snapshot
                && (react_1.default.createElement(Collapsible_1.default, { head: "State", startOpen: true },
                    react_1.default.createElement(DataViewer_1.default, { path: ["snapshot"], getValueByPath: this.props.getValueByPath, decorator: this.dataDecorator }))),
            this.props.logItem.patches && !this.props.initial && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.patches) }, this.props.logItem.patches.map(patch => {
                const path = patch.path.replace(/^\//, "").replace(/\//g, ".");
                switch (patch.op) {
                    case "remove":
                        return (react_1.default.createElement("div", null,
                            path,
                            " ",
                            react_1.default.createElement("span", { className: aphrodite_1.css(styles.removedLabel) }, "Removed")));
                    default: return (react_1.default.createElement("div", null,
                        path,
                        " ",
                        "=",
                        " ",
                        react_1.default.createElement(PreviewValue_1.PreviewValue, { data: patch.value })));
                }
            })))));
    }
};
LogItemExplorer.propTypes = {
    logItem: prop_types_1.default.object,
    initial: prop_types_1.default.bool.isRequired,
    getValueByPath: prop_types_1.default.func.isRequired,
};
LogItemExplorer = __decorate([
    InjectStores_1.InjectStores({
        subscribe: ({ mstLoggerStore }) => {
            const itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
            return {
                mstLoggerStore: [
                    "selectedLogItemId",
                    itemData && itemData.selectedLogItemId,
                ],
            };
        },
        injectProps: ({ mstLoggerStore }) => {
            const itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
            const logItem = itemData && itemData.logItemsById[itemData.selectedLogItemId];
            const initial = itemData && itemData.logItemsIds[0] === itemData.selectedLogItemId;
            return {
                logItem,
                initial,
                getValueByPath(path) {
                    return path.reduce((acc, next) => acc && acc[next], logItem);
                },
            };
        },
    })
], LogItemExplorer);
exports.default = LogItemExplorer;
const styles = aphrodite_1.StyleSheet.create({
    logExplorer: {
        flex: "1 1 auto",
        padding: 5,
        overflow: "auto",
    },
    patches: {
        marginTop: 20,
        paddingLeft: 15,
    },
    removedLabel: {
        textTransform: "uppercase",
        fontSize: 10,
        color: "#c41a16",
    },
});
