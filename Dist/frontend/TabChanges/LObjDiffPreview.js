"use strict";
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
const { css, StyleSheet } = Aphrodite;
class LObjDiffPreview extends react_1.default.PureComponent {
    getStats() {
        const { change } = this.props;
        switch (change.type) {
            case "add":
                return { addedCount: 1, removedCount: 0 };
            case "delete":
                return { addedCount: 0, removedCount: 1 };
            case "update":
                return { addedCount: 1, removedCount: 1 };
            case "splice":
                return { addedCount: change.addedCount, removedCount: change.removedCount };
            default:
                return { addedCount: 0, removedCount: 0 };
        }
    }
    render() {
        const _a = this.getStats(), { addedCount, removedCount } = _a, props = __rest(_a, ["addedCount", "removedCount"]);
        return (react_1.default.createElement("div", Object.assign({ className: css(styles.container) }, props),
            addedCount > 0 && (react_1.default.createElement("div", { className: css(styles.added) },
                "+",
                addedCount)),
            removedCount > 0 && (react_1.default.createElement("div", { className: css(styles.removed) },
                "\u2212",
                removedCount))));
    }
}
exports.LObjDiffPreview = LObjDiffPreview;
const styles = StyleSheet.create({
    container: {
        display: "inline-flex",
        padding: "1px 1px 1px 6px",
        cursor: "pointer",
        opacity: 0.9,
        userSelect: "none",
        fontSize: 11,
        borderRadius: 3,
        ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
    },
    added: {
        marginRight: 5,
        color: "#28a745",
        fontWeight: 500,
    },
    removed: {
        marginRight: 5,
        color: "#cb2431",
        fontWeight: 500,
    },
});
