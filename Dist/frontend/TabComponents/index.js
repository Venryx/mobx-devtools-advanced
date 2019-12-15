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
const react_vcomponents_1 = require("react-vcomponents");
const SecondaryPanel_1 = __importDefault(require("../SecondaryPanel"));
const InjectStores_1 = require("../../utils/InjectStores");
const TreeView_1 = __importDefault(require("./TreeView"));
const SplitPane_1 = __importDefault(require("../SplitPane"));
const Breadcrumb_1 = __importDefault(require("./TreeView/Breadcrumb"));
const TreeComponentExplorer_1 = require("./TreeComponentExplorer");
const mobxReactNodesTree_new_1 = require("../../backend/mobxReactNodesTree_new");
const { css, StyleSheet } = Aphrodite;
const compTreeProto = mobxReactNodesTree_new_1.CompTreeNode.prototype;
function RehydrateCompTree(compTree) {
    Object.setPrototypeOf(compTree, compTreeProto);
    for (const child of compTree.children) {
        RehydrateCompTree(child);
    }
}
exports.RehydrateCompTree = RehydrateCompTree;
// custom styling of components from react-vcomponents
Object.assign(react_vcomponents_1.Button_styles.root, {
    backgroundColor: "hsla(0,0%,85%,1)",
    color: "hsla(0,0%,0%,1)",
    border: "1px solid rgba(0,0,0,.3)",
});
Object.assign(react_vcomponents_1.Button_styles.root_override, {
    padding: "0px 7px",
});
let TabComponents = class TabComponents extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { collapseNonMobX: true };
        this.leftRenderer = () => {
            const { compTree, collapseNonMobX } = this.state;
            console.log("LeftRenderer...", compTree);
            return (react_1.default.createElement("div", { className: css(styles.leftPane) },
                react_1.default.createElement(SecondaryPanel_1.default, null,
                    react_1.default.createElement(react_vcomponents_1.Button, { ml: 5, text: "Refresh", onClick: () => {
                            bridge_.send("backend:getCompTree");
                            bridge_.once("frontend:receiveCompTree", ({ compTree: newCompTree }) => {
                                RehydrateCompTree(newCompTree);
                                console.log("Got comp tree:", newCompTree);
                                this.setState({ compTree: newCompTree });
                            });
                        } }),
                    react_1.default.createElement("div", { style: { marginLeft: 5 } }, "Collapse non-MobX:"),
                    react_1.default.createElement("input", { type: "checkbox", checked: collapseNonMobX, style: { marginLeft: 5, display: "inline-block" }, onChange: e => {
                            this.setState({ collapseNonMobX: !collapseNonMobX });
                        } })),
                react_1.default.createElement(TreeView_1.default, { compTree: compTree, collapseNonMobX: collapseNonMobX }),
                react_1.default.createElement("div", { className: css(styles.footer) },
                    react_1.default.createElement(Breadcrumb_1.default, null))));
        };
        this.rightRenderer = () => (react_1.default.createElement("div", { className: css(styles.rightPane) },
            react_1.default.createElement(TreeComponentExplorer_1.TreeComponentExplorer, null)));
    }
    render() {
        return (react_1.default.createElement("div", { className: css(styles.panel), style: { height: "100%" } },
            react_1.default.createElement("div", { className: css(styles.panelBody), style: { height: "100%" } },
                react_1.default.createElement(SplitPane_1.default, { initialWidth: 10, initialHeight: 10, left: this.leftRenderer, right: this.rightRenderer, isVertical: false }))));
    }
};
TabComponents = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            treeExplorerStore: ["pickingComponent"],
        },
        injectProps: ({ treeExplorerStore }) => ({
            pickingComponent: treeExplorerStore.pickingComponent,
            togglePickingTreeExplorerComponent() {
                if (treeExplorerStore.pickingComponent) {
                    treeExplorerStore.stopPickingComponent();
                }
                else {
                    treeExplorerStore.pickComponent();
                }
            },
        }),
    })
], TabComponents);
exports.default = TabComponents;
const styles = StyleSheet.create({
    panel: {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
    },
    panelBody: {
        display: "flex",
        flex: "1 1 auto",
    },
    leftPane: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },
    rightPane: {
        flex: "1 1 auto",
        overflow: "auto",
        padding: 10,
    },
});
