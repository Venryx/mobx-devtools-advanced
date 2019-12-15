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
const prop_types_1 = __importDefault(require("prop-types"));
const Aphrodite = __importStar(require("aphrodite"));
const react_vextensions_1 = require("react-vextensions");
const react_vcomponents_1 = require("react-vcomponents");
const mobx_react_1 = require("../../../../node_modules/mobx-react");
const InjectStores_1 = require("../../../utils/InjectStores");
const DataViewer_1 = __importDefault(require("../../DataViewer"));
const Collapsible_1 = __importDefault(require("../../Collapsible"));
const Store_1 = require("../../Store");
const { css, StyleSheet } = Aphrodite;
let TreeComponentExplorer_Old = class TreeComponentExplorer_Old extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.dataDecorator = InjectStores_1.InjectStores({
            subscribe: (stores, { path }) => ({
                treeExplorerStore: [`inspected--${path.join("/")}`],
            }),
            shouldUpdate: () => true,
        });
    }
    componentDidMount() {
        window["e"] = this;
    }
    reload() {
        this.props.inspect([], () => this.setState({}));
    }
    render() {
        const { node } = this.props;
        if (!node)
            return null;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: css(styles.heading) },
                react_1.default.createElement("span", { className: css(styles.headingBracket) }, "<"),
                node.name,
                react_1.default.createElement("span", { className: css(styles.headingBracket) }, "/>"),
                __DEV__ && ` ${node.id}`),
            node.dependencyTree && (react_1.default.createElement(Collapsible_1.default, { startOpen: false, head: (react_1.default.createElement("div", { className: css(styles.subheading) },
                    "Dependencies (",
                    node.dependencyTree.dependencies.length,
                    ")")) },
                react_1.default.createElement("div", { className: css(styles.block) },
                    react_1.default.createElement(DataViewer_1.default, { path: ["dependencyTree"], getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, change: this.props.change, showMenu: this.props.showMenu, decorator: this.dataDecorator })))),
            react_1.default.createElement(DataViewer_1.default, { path: ["component"], getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, change: this.props.change, showMenu: this.props.showMenu, decorator: this.dataDecorator, hidenKeysRegex: /^(__\$mobRenderEnd|__\$mobRenderStart|_reactInternalInstance|updater)$/ })));
    }
};
TreeComponentExplorer_Old.propTypes = {
    node: prop_types_1.default.object,
    change: prop_types_1.default.func.isRequired,
    getValueByPath: prop_types_1.default.func,
    inspect: prop_types_1.default.func,
    stopInspecting: prop_types_1.default.func,
    showMenu: prop_types_1.default.func,
};
TreeComponentExplorer_Old = __decorate([
    InjectStores_1.InjectStores({
        subscribe: ({ treeExplorerStore }) => ({
            treeExplorerStore: [treeExplorerStore.selectedNodeId, "selectedNodeId"],
        }),
        injectProps: ({ treeExplorerStore }) => {
            const node = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId];
            return {
                node,
                selectedNodeId: treeExplorerStore.selectedNodeId,
                showMenu(e, val, path) {
                    e.preventDefault();
                    treeExplorerStore.showContextMenu("attr", e, treeExplorerStore.selectedNodeId, node, val, path);
                },
                inspect(path) {
                    treeExplorerStore.inspect(path);
                },
                stopInspecting(path) {
                    treeExplorerStore.stopInspecting(path);
                },
                change(path, value) {
                    treeExplorerStore.changeValue({ path, value });
                },
                getValueByPath(path) {
                    return path.reduce((acc, next) => acc && acc[next], treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId]);
                },
            };
        },
    })
], TreeComponentExplorer_Old);
exports.TreeComponentExplorer_Old = TreeComponentExplorer_Old;
const styles = StyleSheet.create({
    heading: {
        fontSize: 17,
        color: "var(--treenode-tag-name)",
        fontFamily: "var(--font-family-monospace)",
        fontWeight: 500,
        marginBottom: 15,
    },
    headingBracket: {
        color: "var(--treenode-bracket)",
    },
    block: {
        marginBottom: 15,
    },
    subheading: {
        color: "var(--lighter-text-color)",
        textTransform: "uppercase",
        fontSize: 13,
        marginBottom: 5,
        fontWeight: 500,
    },
});
let TreeComponentExplorer = class TreeComponentExplorer extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        const { data } = this.state;
        return (react_1.default.createElement("div", null,
            "Path: ",
            Store_1.store.selectedMobXObjectPath,
            react_1.default.createElement(react_vcomponents_1.Button, { text: "Refresh", enabled: data, onClick: () => {
                    bridge_.send("backend:GetMobXObjectData", { path: Store_1.store.selectedMobXObjectPath });
                    bridge_.once("frontend:ReceiveMobXObjectData", ({ data }) => {
                        //this.setState({dataStr: JSON.stringify(data, null, 2)});
                        this.setState({ data });
                    });
                } }),
            data && react_1.default.createElement(DataViewer, { data: data, keyInTree: "root" })));
    }
};
TreeComponentExplorer = __decorate([
    mobx_react_1.observer
], TreeComponentExplorer);
exports.TreeComponentExplorer = TreeComponentExplorer;
class DataViewer extends react_vextensions_1.BaseComponentPlus({ depth: 0 }, { expanded: false }) {
    render() {
        const { data, depth, keyInTree } = this.props;
        const { expanded } = this.state;
        const expandable = data != null && typeof data == "object";
        const childKeys = expandable ? Object.keys(data) : [];
        return (react_1.default.createElement(react_vcomponents_1.Column, null,
            react_1.default.createElement(react_vcomponents_1.Row, { style: { cursor: "pointer" }, onClick: () => {
                    this.SetState({ expanded: !expanded });
                } },
                react_1.default.createElement("div", { style: { width: 10 } }, expandable ? (!expanded ? ">" : "...") : ""),
                react_1.default.createElement("div", null,
                    keyInTree,
                    ":"),
                !expandable &&
                    react_1.default.createElement(react_vcomponents_1.Text, null,
                        " ",
                        JSON.stringify(data)),
                expandable && data && data.constructor &&
                    react_1.default.createElement(react_vcomponents_1.Text, null,
                        " (",
                        data.constructor.name,
                        ")")),
            expandable && expanded &&
                react_1.default.createElement(react_vcomponents_1.Column, { style: { marginLeft: 10 } }, childKeys.map(childKey => {
                    //if (depth >= 50) return <div key={childKey}>Too deep.</div>;
                    return react_1.default.createElement(DataViewer, { key: childKey, keyInTree: childKey, depth: depth + 1, data: data[childKey] });
                }))));
    }
}
exports.DataViewer = DataViewer;
