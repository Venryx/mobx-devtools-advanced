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
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const Aphrodite = __importStar(require("aphrodite"));
const mobx_react_1 = require("mobx-react");
const react_vcomponents_1 = require("react-vcomponents");
const SearchUtils = __importStar(require("../../../utils/SearchUtils"));
const InjectStores_1 = require("../../../utils/InjectStores");
const General_1 = require("../../../utils/General");
const Store_1 = require("../../Store");
const { css, StyleSheet } = Aphrodite;
const MAX_SEARCH_ROOTS = 200;
let TreeView = class TreeView extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.node = undefined;
        this.handleKeyDown = e => {
            switch (e.keyCode) {
                case 38: {
                    // up arrow
                    e.preventDefault();
                    this.props.selectInDirection("up");
                    break;
                }
                case 40: {
                    // down arrow
                    e.preventDefault();
                    this.props.selectInDirection("down");
                    break;
                }
                case 37: {
                    // left arrow
                    e.preventDefault();
                    this.props.selectInDirection("left");
                    break;
                }
                case 39: {
                    // right arrow
                    e.preventDefault();
                    this.props.selectInDirection("right");
                    break;
                }
                default:
                    break;
            }
        };
    }
    componentDidMount() {
        this.props.getComponents();
        window.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        this.props.reset();
        window.removeEventListener("keydown", this.handleKeyDown);
    }
    scrollTo(toNode) {
        if (!this.node) {
            return;
        }
        let val = 0;
        const height = toNode.offsetHeight;
        let offsetParentNode = toNode;
        while (offsetParentNode && this.node.contains(offsetParentNode)) {
            val += offsetParentNode.offsetTop;
            offsetParentNode = offsetParentNode.offsetParent;
        }
        const top = this.node.scrollTop;
        const rel = val - this.node.offsetTop;
        const margin = 40;
        if (top > rel - margin) {
            this.node.scrollTop = rel - margin;
        }
        else if (top + this.node.offsetHeight < rel + height + margin) {
            this.node.scrollTop = (rel - this.node.offsetHeight) + height + margin;
        }
    }
    render() {
        const { roots, searching, searchText, loaded, compTree, collapseNonMobX } = this.props;
        console.log("TreeView.CompTree:", compTree);
        // Convert search text into a case-insensitive regex for match-highlighting.
        const searchRegExp = SearchUtils.isValidRegex(searchText)
            ? SearchUtils.searchTextToRegExp(searchText)
            : null;
        return (react_1.default.createElement("div", { className: css(styles.container), style: { overflowY: "auto" } }, compTree && react_1.default.createElement(CompTreeNodeUI, { node: compTree, collapseNonMobX: collapseNonMobX })));
    }
};
TreeView.propTypes = {
    loaded: prop_types_1.default.bool.isRequired,
};
TreeView = __decorate([
    InjectStores_1.InjectStores({
        shouldUpdate: General_1.ShallowChanged,
        subscribe: {
            treeExplorerStore: ["roots", "searchRoots", "loaded"],
        },
        injectProps: ({ treeExplorerStore }) => ({
            roots: treeExplorerStore.searchRoots || treeExplorerStore.roots,
            searchText: treeExplorerStore.searchText,
            searching: treeExplorerStore.searchText !== "",
            loaded: treeExplorerStore.loaded,
            getComponents: () => treeExplorerStore.getComponents(),
            reset: () => treeExplorerStore.reset(),
            selectInDirection(direction) {
                const roots = treeExplorerStore.searchRoots || treeExplorerStore.roots;
                const parentId = treeExplorerStore.nodeParentsById[treeExplorerStore.selectedNodeId];
                const siblingsIds = parentId ? treeExplorerStore.nodesById[parentId].children : roots;
                const childrenIds = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId].children;
                const isBottomTag = treeExplorerStore.isBottomTagSelected;
                const { collapsed } = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId];
                switch (direction) {
                    case "up": {
                        const sidx = siblingsIds.indexOf(treeExplorerStore.selectedNodeId);
                        if (isBottomTag && childrenIds.length > 0) {
                            const lastChildId = childrenIds[childrenIds.length - 1];
                            if (treeExplorerStore.nodesById[lastChildId].collapsed) {
                                treeExplorerStore.selectBottom(lastChildId);
                            }
                            else {
                                treeExplorerStore.selectTop(lastChildId);
                            }
                        }
                        else if (sidx !== -1 && sidx !== 0) {
                            treeExplorerStore.selectBottom(siblingsIds[sidx - 1]);
                        }
                        else if (parentId) {
                            treeExplorerStore.selectTop(parentId);
                        }
                        break;
                    }
                    case "down": {
                        const sidx = siblingsIds.indexOf(treeExplorerStore.selectedNodeId);
                        if (!isBottomTag && !collapsed && childrenIds.length > 0) {
                            treeExplorerStore.selectTop(childrenIds[0]);
                        }
                        else if (sidx !== -1 && sidx !== siblingsIds.length - 1) {
                            treeExplorerStore.selectTop(siblingsIds[sidx + 1]);
                        }
                        else if (parentId) {
                            treeExplorerStore.selectBottom(parentId);
                        }
                        break;
                    }
                    case "left": {
                        if (!collapsed) {
                            treeExplorerStore.collapse(treeExplorerStore.selectedNodeId);
                            treeExplorerStore.selectTop(treeExplorerStore.selectedNodeId);
                        }
                        else if (parentId) {
                            treeExplorerStore.selectTop(parentId);
                        }
                        break;
                    }
                    case "right": {
                        if (collapsed) {
                            treeExplorerStore.uncollapse(treeExplorerStore.selectedNodeId);
                        }
                        else if (childrenIds.length > 0) {
                            treeExplorerStore.selectTop(childrenIds[0]);
                        }
                        break;
                    }
                    default:
                        break;
                }
            },
        }),
    })
], TreeView);
exports.default = TreeView;
const styles = StyleSheet.create({
    container: {
        position: "relative",
        fontFamily: "var(--font-family-monospace)",
        fontSize: 12,
        lineHeight: 1.3,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        userSelect: "none",
        ":after": {
            opacity: 0.5,
            content: '""',
            width: 7,
            height: "100%",
            backgroundImage: "linear-gradient(to right, transparent, #fff) !important",
            position: "absolute",
            top: 0,
            right: 0,
            pointerEvents: "none",
        },
    },
    scroll: {
        overflow: "auto",
        minHeight: 0,
        flex: 1,
        display: "flex",
        alignItems: "flex-start",
    },
    scrollContents: {
        flexDirection: "column",
        flex: 1,
        display: "flex",
        alignItems: "stretch",
        padding: 5,
    },
    noSearchResults: {
        color: "#777",
        // fontFamily: sansSerif.family,
        // fontSize: sansSerif.sizes.normal,
        padding: "10px",
        fontWeight: "bold",
    },
});
let CompTreeNodeUI = CompTreeNodeUI_1 = class CompTreeNodeUI extends react_1.Component {
    render() {
        const { node, collapseNonMobX } = this.props;
        const nodeIsMobX = node.compIsObservable || node.compRenderIsObserver;
        return (react_1.default.createElement("div", null,
            (nodeIsMobX || !collapseNonMobX) &&
                react_1.default.createElement("div", null,
                    node.typeName || "n/a",
                    node.compIsObservable &&
                        react_1.default.createElement(react_vcomponents_1.Button, { text: "[mobx data]", style: { marginLeft: 5 }, onClick: () => {
                                Store_1.store.selectedMobXObjectPath = node.path;
                            } }),
                    node.compRenderIsObserver &&
                        react_1.default.createElement(react_vcomponents_1.Button, { text: "[mobx observer]", style: { marginLeft: 5 }, onClick: () => {
                                Store_1.store.selectedMobXObjectPath = node.RenderFuncPath;
                            } })),
            react_1.default.createElement("div", { style: { marginLeft: 10 } }, node.children.map((child, index) => {
                return (react_1.default.createElement(CompTreeNodeUI_1, { key: index, node: child, collapseNonMobX: collapseNonMobX }));
            }))));
    }
};
CompTreeNodeUI = CompTreeNodeUI_1 = __decorate([
    mobx_react_1.observer
], CompTreeNodeUI);
var CompTreeNodeUI_1;
