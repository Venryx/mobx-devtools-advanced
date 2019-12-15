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
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const InjectStores_1 = require("../../../utils/InjectStores");
function getBreadcrumbPath(store) {
    const path = [];
    let current = store.breadcrumbHead;
    while (current) {
        path.unshift({
            id: current,
            node: store.nodesById[current],
        });
        current = store.getParent(current);
    }
    return path;
}
let Breadcrumb = class Breadcrumb extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hovered: null };
    }
    handleCrumbMouseOver(id) {
        this.setState({ hovered: id });
        this.props.hover(id, true);
    }
    handleCrumbMouseOut(id) {
        this.setState({ hovered: null });
        this.props.hover(id, false);
    }
    render() {
        return (react_1.default.createElement("ul", { className: aphrodite_1.css(styles.container) }, this.props.path.map(({ id, node }) => {
            const isSelected = id === this.props.selectedId;
            const className = aphrodite_1.css(styles.item, isSelected && styles.itemSelected);
            return (react_1.default.createElement("li", { className: className, key: id, 
                // eslint-disable-next-line react/jsx-no-bind
                onMouseOver: () => this.handleCrumbMouseOver(id), 
                // eslint-disable-next-line react/jsx-no-bind
                onMouseOut: () => this.handleCrumbMouseOut(id), 
                // eslint-disable-next-line react/jsx-no-bind
                onClick: isSelected ? null : () => this.props.select(id) }, node.name || `"${node.text}"`));
        })));
    }
};
Breadcrumb.propTypes = {
    selectedId: prop_types_1.default.any,
    path: prop_types_1.default.array.isRequired,
    select: prop_types_1.default.func.isRequired,
    hover: prop_types_1.default.func.isRequired,
};
Breadcrumb = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            treeExplorerStore: ["breadcrumbHead", "selectedNodeId"],
        },
        injectProps: ({ treeExplorerStore }) => ({
            select: id => treeExplorerStore.selectBreadcrumb(id),
            hover: (id, isHovered) => treeExplorerStore.setHover(id, isHovered, false),
            selectedId: treeExplorerStore.selectedNodeId,
            path: getBreadcrumbPath(treeExplorerStore),
        }),
    })
], Breadcrumb);
exports.default = Breadcrumb;
const styles = aphrodite_1.StyleSheet.create({
    container: {
        fontSize: 12,
        listStyle: "none",
        padding: 0,
        margin: 0,
        maxHeight: 80,
        overflow: "auto",
        backgroundColor: "var(--bar-color)",
        borderTop: "1px solid var(--bar-border-color)",
    },
    item: {
        padding: "1px 4px",
        userSelect: "none",
        display: "inline-block",
        cursor: "pointer",
        opacity: 0.8,
        color: "var(--lighter-text-color)",
    },
    itemSelected: {
        color: "var(--default-text-color)",
        backgroundColor: "var(--bar-active-button-bg)",
        cursor: "default",
        opacity: 1,
    },
});
