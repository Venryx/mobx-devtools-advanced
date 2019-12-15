"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Props_1 = __importDefault(require("./Props"));
const InjectStores_1 = require("../../../utils/InjectStores");
//import {css, StyleSheet} from "aphrodite";
const { css, StyleSheet } = require("aphrodite");
let Node = Node_1 = 
// eslint-disable-next-line indent
class Node extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.$head = undefined;
        this.$tail = undefined;
    }
    componentDidMount() {
        if (this.props.selected) {
            this.ensureInView();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.selected && !prevProps.selected) {
            // Gaining selection.
            this.ensureInView();
        }
    }
    findOwnerWindow() {
        if (!this.$head) {
            return null;
        }
        const doc = this.$head.ownerDocument;
        if (!doc) {
            return null;
        }
        const win = doc.defaultView;
        if (!win) {
            return null;
        }
        return win;
    }
    ensureInView() {
        const node = this.props.isBottomTagSelected ? this.$tail : this.$head;
        if (!node) {
            return;
        }
        this.props.scrollTo(node);
    }
    render() {
        const { depth, hovered, isBottomTagHovered, isBottomTagSelected, node, onContextMenu, onHover, onHoverBottom, onSelect, onSelectBottom, onToggleCollapse, searchRegExp, selected, } = this.props;
        if (!node) {
            return (react_1.default.createElement("span", null,
                "Node was deleted",
                __DEV__ && this.props.id));
        }
        const { children } = node;
        const { collapsed } = node;
        const inverted = selected;
        const headEvents = {
            onContextMenu,
            onDoubleClick: onToggleCollapse,
            onMouseOver: () => onHover(true),
            onMouseOut: () => onHover(false),
            onMouseDown: onSelect,
        };
        const tailEvents = {
            onContextMenu,
            onDoubleClick: onToggleCollapse,
            onMouseOver: () => onHoverBottom(true),
            onMouseOut: () => onHoverBottom(false),
            onMouseDown: onSelectBottom,
        };
        let name = `${node.name}`;
        // If the user's filtering then highlight search terms in the tag name.
        // This will serve as a visual reminder that the visible tree is filtered.
        if (searchRegExp) {
            const unmatched = name.split(searchRegExp);
            const matched = name.match(searchRegExp);
            const pieces = [react_1.default.createElement("span", { key: 0 }, unmatched.shift())];
            while (unmatched.length > 0) {
                pieces.push(react_1.default.createElement("span", { key: pieces.length, className: css(styles.highlight) }, matched.shift()));
                pieces.push(react_1.default.createElement("span", { key: pieces.length }, unmatched.shift()));
            }
            name = react_1.default.createElement("span", null, pieces);
        }
        // Single-line tag (collapsed / simple content / no content)
        if (!children || typeof children === "string" || !children.length) {
            const content = children;
            const isCollapsed = content === null || content === undefined;
            return (react_1.default.createElement("div", { className: css(styles.container) },
                react_1.default.createElement(Head, Object.assign({ getRef: h => { this.$head = h; }, depth: depth, hovered: hovered && !isBottomTagHovered, selected: selected && !isBottomTagSelected }, headEvents),
                    react_1.default.createElement("span", null,
                        react_1.default.createElement("span", { className: css(styles.bracket) }, "<"),
                        react_1.default.createElement("span", { className: css(styles.jsxTag) }, name),
                        node.key && react_1.default.createElement(Props_1.default, { key: "key", props: { key: node.key } }),
                        node.ref && react_1.default.createElement(Props_1.default, { key: "ref", props: { ref: node.ref } }),
                        node.props && react_1.default.createElement(Props_1.default, { key: "props", props: node.props }),
                        react_1.default.createElement("span", { className: css(styles.bracket) }, isCollapsed ? " />" : ">")),
                    !isCollapsed && [
                        react_1.default.createElement("span", { key: "content" }, content),
                        react_1.default.createElement("span", { key: "close" },
                            react_1.default.createElement("span", { className: css(styles.bracket) }, "</"),
                            react_1.default.createElement("span", { className: css(styles.jsxTag) }, name),
                            react_1.default.createElement("span", { className: css(styles.bracket) }, ">")),
                    ],
                    selected && react_1.default.createElement("span", { className: css(styles.tmpValueName) }, " == $m"))));
        }
        const closeTag = (react_1.default.createElement("span", null,
            react_1.default.createElement("span", { className: css(styles.bracket) }, "</"),
            react_1.default.createElement("span", { className: css(styles.jsxTag) }, name),
            react_1.default.createElement("span", { className: css(styles.bracket) }, ">"),
            selected
                && ((collapsed && !this.props.isBottomTagSelected) || this.props.isBottomTagSelected) && (react_1.default.createElement("span", { className: css(styles.tmpValueName) }, " == $m"))));
        const hasState = !!node.state || !!node.context;
        const headInverted = inverted && !isBottomTagSelected;
        const collapserStyle = { left: calcPaddingLeft(depth) - 12 };
        const collapserClassName = css(styles.collapser);
        const collapser = (react_1.default.createElement("span", { title: hasState ? "This component is stateful." : null, onClick: onToggleCollapse, style: collapserStyle, className: collapserClassName },
            react_1.default.createElement("span", { className: css(collapsed ? styles.arrowCollapsed : styles.arrowOpen) })));
        const head = (react_1.default.createElement(Head, Object.assign({ getRef: h => { this.$head = h; }, depth: depth, hovered: hovered && !isBottomTagHovered, selected: selected && !isBottomTagSelected }, headEvents),
            collapser,
            react_1.default.createElement("span", null,
                react_1.default.createElement("span", { className: css(styles.bracket) }, "<"),
                react_1.default.createElement("span", { className: css(styles.jsxTag) }, name),
                node.key && react_1.default.createElement(Props_1.default, { key: "key", props: { key: node.key }, inverted: headInverted }),
                node.ref && react_1.default.createElement(Props_1.default, { key: "ref", props: { ref: node.ref }, inverted: headInverted }),
                node.props && react_1.default.createElement(Props_1.default, { key: "props", props: node.props, inverted: headInverted }),
                react_1.default.createElement("span", { className: css(styles.bracket) }, ">"),
                selected
                    && !collapsed
                    && !this.props.isBottomTagSelected && (react_1.default.createElement("span", { className: css(styles.tmpValueName) }, " == $m"))),
            collapsed && react_1.default.createElement("span", null, "\u2026"),
            collapsed && closeTag));
        if (collapsed) {
            return react_1.default.createElement("div", { className: css(styles.container) }, head);
        }
        return (react_1.default.createElement("div", { className: css(styles.container) },
            head,
            react_1.default.createElement(Guideline, { depth: depth, hovered: hovered && !isBottomTagHovered, selected: selected && !isBottomTagSelected }),
            react_1.default.createElement("div", null, children.map(id => react_1.default.createElement(Node_1, { key: id, depth: depth + 1, id: id }))),
            react_1.default.createElement(Tail, Object.assign({ getRef: t => { this.$tail = t; } }, tailEvents, { depth: depth, hovered: hovered && isBottomTagHovered, selected: selected && isBottomTagSelected }), closeTag)));
    }
};
Node.propTypes = {};
Node.defaultProps = {
    depth: 0,
};
Node = Node_1 = __decorate([
    InjectStores_1.InjectStores({
        subscribe: (stores, props) => ({
            treeExplorerStore: [props.id, "searchRoots"],
        }),
        injectProps: ({ treeExplorerStore }, props) => {
            const node = treeExplorerStore.nodesById[props.id];
            return {
                node,
                selected: treeExplorerStore.selectedNodeId === props.id,
                isBottomTagSelected: treeExplorerStore.isBottomTagSelected,
                isBottomTagHovered: treeExplorerStore.isBottomTagHovered,
                hovered: treeExplorerStore.hoveredNodeId === props.id,
                searchRegExp: props.searchRegExp,
                scrollTo: () => { },
                onToggleCollapse: e => {
                    e.preventDefault();
                    treeExplorerStore.updateNode(Object.assign({}, node, { collapsed: !node.collapsed }));
                },
                onHover: isHovered => {
                    treeExplorerStore.setHover(props.id, isHovered, false);
                },
                onHoverBottom: isHovered => {
                    treeExplorerStore.setHover(props.id, isHovered, true);
                },
                onSelect: () => {
                    treeExplorerStore.selectTop(props.id);
                },
                onSelectBottom: () => {
                    treeExplorerStore.selectBottom(props.id);
                },
                onContextMenu: e => {
                    e.preventDefault();
                    treeExplorerStore.showContextMenu("tree", e, props.id, node);
                },
            };
        },
    })
    // eslint-disable-next-line indent
], Node);
exports.Node = Node;
exports.default = Node;
class Head extends react_1.default.Component {
    render() {
        const _a = this.props, { depth, hovered, selected, children, getRef } = _a, otherProps = __rest(_a, ["depth", "hovered", "selected", "children", "getRef"]);
        return (react_1.default.createElement("div", Object.assign({ ref: getRef, className: css(styles.head, hovered && styles.headHovered, selected && styles.headSelected), "data-test": "components-Node-Head" }, otherProps),
            react_1.default.createElement("span", { style: { paddingLeft: calcPaddingLeft(depth) }, className: css(styles.content, selected && styles.selectedContent) }, children)));
    }
}
class Tail extends react_1.default.Component {
    render() {
        const _a = this.props, { depth, hovered, selected, children, getRef } = _a, otherProps = __rest(_a, ["depth", "hovered", "selected", "children", "getRef"]);
        return (react_1.default.createElement("div", Object.assign({ ref: getRef }, otherProps, { className: css(styles.tail, hovered && styles.tailHovered, selected && styles.tailSelected) }),
            react_1.default.createElement("span", { style: { paddingLeft: calcPaddingLeft(depth) }, className: css(styles.content, selected && styles.selectedContent) }, children)));
    }
}
class Guideline extends react_1.default.Component {
    render() {
        const { depth, hovered, selected } = this.props;
        return (react_1.default.createElement("div", { style: { marginLeft: calcPaddingLeft(depth) - 7 }, className: css(styles.guideline, hovered && styles.guidlineHovered, selected && styles.guidlineSelected) }));
    }
}
const calcPaddingLeft = depth => 5 + ((depth + 1) * 10);
const styles = StyleSheet.create({
    container: {
        flexShrink: 0,
        position: "relative",
        whiteSpace: "nowrap",
    },
    falseyLiteral: {
        fontStyle: "italic",
    },
    highlight: {
        backgroundColor: "var(--treenode-search-highlight)",
    },
    collapser: {
        position: "absolute",
        padding: 2,
    },
    head: {
        cursor: "default",
        borderTop: "1px solid transparent",
        borderRadius: 4,
    },
    headHovered: {
        backgroundColor: "var(--treenode-hovered-bg)",
    },
    headSelected: {
        backgroundColor: "var(--treenode-selected-bg)",
    },
    guideline: {
        position: "absolute",
        width: "1px",
        top: 16,
        bottom: 0,
    },
    guidlineSelected: {
        opacity: 0.3,
        backgroundColor: "var(--primary-color)",
        zIndex: 1,
    },
    guidlineHovered: {
        backgroundColor: "var(--treenode-hover-guide)",
    },
    tail: {
        borderTop: "1px solid transparent",
        cursor: "default",
    },
    tailHovered: {
        backgroundColor: "var(--treenode-hovered-bg)",
    },
    tailSelected: {
        backgroundColor: "var(--treenode-selected-bg)",
    },
    content: {
        display: "block",
        position: "relative",
        paddingRight: 5,
        paddingBottom: 4,
        paddingTop: 4,
    },
    selectedContent: {
        filter: "contrast(0.1) brightness(2)",
    },
    arrowCollapsed: {
        borderStyle: "solid",
        borderWidth: "4px 0 4px 6px",
        borderColor: "transparent transparent transparent var(--treenode-arrow)",
        display: "inline-block",
        marginLeft: 2,
        verticalAlign: "top",
    },
    arrowOpen: {
        borderStyle: "solid",
        borderWidth: "6px 4px 0 4px",
        borderColor: "var(--treenode-arrow) transparent transparent transparent",
        display: "inline-block",
        marginTop: 2,
        verticalAlign: "top",
    },
    bracket: {
        color: "var(--treenode-bracket)",
    },
    jsxTag: {
        color: "var(--treenode-tag-name)",
    },
    tmpValueName: {
        color: "var(--treenode-tag-name)",
        opacity: 0.5,
    },
});
var Node_1;
