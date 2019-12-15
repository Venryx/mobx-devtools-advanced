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
/* eslint-disable react/no-array-index-key */
const react_1 = __importDefault(require("react"));
const Aphrodite = __importStar(require("aphrodite"));
const ChangeDataViewerPopover_1 = require("./ChangeDataViewerPopover");
const { css, StyleSheet } = Aphrodite;
class LObjDiff extends react_1.default.PureComponent {
    getDiff() {
        const { change } = this.props;
        switch (change.type) {
            case "add":
                return {
                    added: [{ name: change.name, value: change.newValue, path: ["newValue"] }],
                };
            case "delete":
                return {
                    removed: [{ name: change.name, value: change.oldValue, path: ["oldValue"] }],
                };
            case "update":
                return {
                    added: [{ name: change.name, value: change.newValue, path: ["newValue"] }],
                    removed: [{ name: change.name, value: change.oldValue, path: ["oldValue"] }],
                };
            case "splice":
                return {
                    added: (change.added || []).map((value, i) => ({
                        name: change.index + i,
                        value,
                        path: ["added", i],
                    })),
                    removed: (change.removed || []).map((value, i) => ({
                        name: change.index + i,
                        value,
                        path: ["removed", i],
                    })),
                };
            default:
                return { added: [], removed: [] };
        }
    }
    render() {
        const { added = [], removed = [] } = this.getDiff();
        return (react_1.default.createElement("div", { className: css(styles.container) },
            react_1.default.createElement("div", { className: css(styles.innerContainer) },
                removed.map(({ name, path }, i) => (react_1.default.createElement("div", { className: css(styles.diffRow, styles.removed), key: i },
                    react_1.default.createElement("div", { className: css(styles.propName, styles.propNameRemoved) }, name),
                    react_1.default.createElement("div", { className: css(styles.propValue, styles.propValueRemoved) },
                        react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(path), getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu }))))),
                added.map(({ name, path }, i) => (react_1.default.createElement("div", { className: css(styles.diffRow, styles.added), key: i },
                    react_1.default.createElement("div", { className: css(styles.propName, styles.propNameAdded) }, name),
                    react_1.default.createElement("div", { className: css(styles.propValue, styles.propValueAdded) },
                        react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(path), getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu }))))))));
    }
}
exports.LObjDiff = LObjDiff;
const styles = StyleSheet.create({
    container: {
        fontFamily: "const(--font-family-monospace)",
        width: "100%",
        maxHeight: 270,
        overflow: "auto",
    },
    innerContainer: {
        display: "table",
    },
    title: {},
    diffRow: {
        display: "table-row",
    },
    propName: {
        display: "table-cell",
        minWidth: 70,
        maxWidth: 180,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        padding: 5,
    },
    propNameRemoved: {
        backgroundColor: "rgba(245, 0, 30, 0.13)",
    },
    propNameAdded: {
        backgroundColor: "rgba(0, 246, 54, 0.18)",
    },
    propValue: {
        padding: "5px 5px 5px 20px",
        flex: "1 1 auto",
        display: "table-cell",
        position: "relative",
        ":before": {
            position: "absolute",
            left: 5,
            flex: "0 0 auto",
        },
    },
    propValueRemoved: {
        backgroundColor: "rgba(245, 0, 30, 0.07)",
        ":before": {
            content: '"-"',
        },
    },
    propValueAdded: {
        backgroundColor: "rgba(0, 246, 54, 0.09)",
        ":before": {
            content: '"+"',
        },
    },
});
