"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
TreeItem.propTypes = {
    dependencies: prop_types_1.default.array,
    isLast: prop_types_1.default.bool,
    isRoot: prop_types_1.default.bool,
    name: prop_types_1.default.string,
};
function TreeItem({ dependencies, isLast, isRoot, name }) {
    return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.item) },
        react_1.default.createElement("span", { className: aphrodite_1.css(styles.box, isRoot && styles.box.root) }, name),
        dependencies && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.tree) }, dependencies.map((d, i) => (react_1.default.createElement(TreeItem, { key: d.name, dependencies: d.dependencies, isLast: i === dependencies.length - 1 }))))),
        !isRoot && react_1.default.createElement("span", { className: aphrodite_1.css(styles.itemHorisontalDash) }),
        !isRoot && (react_1.default.createElement("span", { className: aphrodite_1.css(styles.itemVericalStick, isLast && styles.itemVericalStick.short) }))));
}
Graph.propTypes = {
    dependencyTree: prop_types_1.default.shape({
        dependencies: prop_types_1.default.array,
        name: prop_types_1.default.string,
    }),
};
function Graph({ dependencyTree }) {
    if (!dependencyTree)
        return null;
    return (react_1.default.createElement("div", { style: styles.root },
        react_1.default.createElement(TreeItem, { key: dependencyTree.name, dependencies: dependencyTree.dependencies, isLast: true, isRoot: true })));
}
exports.default = Graph;
const styles = aphrodite_1.StyleSheet.create({
    tree: {
        position: "relative",
        paddingLeft: "20px",
    },
    root: { paddingLeft: 0 },
    item: {
        position: "relative",
    },
    box: {
        padding: "4px 10px",
        background: "rgba(0, 0, 0, 0.05)",
        display: "inline-block",
        marginBottom: "8px",
        color: "#000",
        root: {
            fontSize: "15px",
            fontWeight: "bold",
            padding: "6px 13px",
        },
    },
    itemHorisontalDash: {
        position: "absolute",
        left: "-12px",
        borderTop: "1px solid rgba(0, 0, 0, 0.2)",
        top: "14px",
        width: "12px",
        height: "0",
    },
    itemVericalStick: {
        position: "absolute",
        left: "-12px",
        borderLeft: "1px solid rgba(0, 0, 0, 0.2)",
        height: "100%",
        width: 0,
        top: "-8px",
        short: {
            height: "23px",
        },
    },
});
