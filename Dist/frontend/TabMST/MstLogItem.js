"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const pluralize_1 = __importDefault(require("../../utils/pluralize"));
const getTitle = (logItem, initial) => {
    if (initial) {
        return "Initial";
    }
    if (logItem.patches) {
        return `${logItem.patches.length} ${pluralize_1.default(logItem.patches.length, "patch", "patches")}`;
    }
    return "Change";
};
// const tsToDate = (timestamp) => {
//   const d = new Date(timestamp);
//   const hh = `0${d.getHours()}`.slice(0, 2);
//   const mm = `0${d.getMinutes()}`.slice(0, 2);
//   const ss = `0${d.getSeconds()}`.slice(0, 2);
//   return `${hh}:${mm}:${ss}`;
// };
class MstLogItem extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.handleSelect = () => this.props.onSelect(this.props.logItem.id);
        this.handleActivate = () => this.props.onActivate(this.props.logItem.id);
        this.handleCancel = () => this.props.onCancel(this.props.logItem.id);
        this.handleCommit = () => this.props.onCommit(this.props.logItem.id);
    }
    render() {
        const { active, initial, selected, logItem, style, } = this.props;
        return (react_1.default.createElement("div", { onClick: this.handleSelect, className: aphrodite_1.css(styles.logItem, selected && styles.logItemSelected), style: style },
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.title, selected && styles.titleSelected) }, getTitle(logItem, initial)),
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.rightButtons, selected && styles.rightButtonsSelected) },
                !initial
                    && (react_1.default.createElement("div", { onClick: this.handleCommit, className: aphrodite_1.css(styles.button), title: "Commit" },
                        react_1.default.createElement(CommitIcon, null))),
                !initial
                    && (react_1.default.createElement("div", { onClick: this.handleCancel, className: aphrodite_1.css(styles.button), title: "Cancel" },
                        react_1.default.createElement(CancelIcon, null))),
                !active && (react_1.default.createElement("div", { onClick: this.handleActivate, className: aphrodite_1.css(styles.button), title: "Time-travel here" },
                    react_1.default.createElement(TravelIcon, null))),
                active && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.activeIndicator) }))),
            active && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.activeIndicator) }))));
    }
}
MstLogItem.propTypes = {
    logItem: prop_types_1.default.object.isRequired,
    active: prop_types_1.default.bool,
    initial: prop_types_1.default.bool,
    selected: prop_types_1.default.bool,
    onSelect: prop_types_1.default.func.isRequired,
    onActivate: prop_types_1.default.func.isRequired,
    onCancel: prop_types_1.default.func.isRequired,
    onCommit: prop_types_1.default.func.isRequired,
    style: prop_types_1.default.object,
};
exports.default = MstLogItem;
const TravelIcon = () => (react_1.default.createElement("svg", { baseProfile: "basic", xmlns: "http://www.w3.org/2000/svg", width: "15", height: "15", viewBox: "0 0 15 15" },
    react_1.default.createElement("path", { fill: "none", stroke: "var(--log-item-buttons-color)", strokeWidth: "1.2", d: "M2.188 4.708a6 6 0 1 1 .115 5.792M7.5 7.5V3m0 4.5L10 10" }),
    react_1.default.createElement("g", { fill: "var(--log-item-buttons-color)" },
        react_1.default.createElement("path", { d: "M.553 3.626L1.5 7.5l2.882-2.757L.553 3.626z" }),
        react_1.default.createElement("circle", { cx: "7.5", cy: "7.5", r: ".75" }))));
const CancelIcon = () => (react_1.default.createElement("svg", { baseProfile: "basic", xmlns: "http://www.w3.org/2000/svg", width: "15", height: "15", viewBox: "0 0 15 15" },
    react_1.default.createElement("path", { fill: "none", stroke: "var(--log-item-buttons-color)", strokeWidth: "1.4", strokeMiterlimit: "10", d: "M2 13L13 2M13 13L2 2" })));
const CommitIcon = () => (react_1.default.createElement("svg", { baseProfile: "basic", xmlns: "http://www.w3.org/2000/svg", width: "15", height: "15", viewBox: "0 0 15 15" },
    react_1.default.createElement("path", { fill: "none", stroke: "var(--log-item-buttons-color)", strokeMiterlimit: "10", d: "M7.5 3.143v7.838" }),
    react_1.default.createElement("g", { fill: "var(--log-item-buttons-color)" },
        react_1.default.createElement("circle", { cx: "7.5", cy: "3.256", r: "2.256" }),
        react_1.default.createElement("path", { d: "M4.708 10.164L7.5 15l2.792-4.836z" }))));
const styles = aphrodite_1.StyleSheet.create({
    logItem: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        fontSize: 12,
        userSelect: "none",
        cursor: "default",
        "--log-item-buttons-pane-opacity": "0",
        "--log-item-buttons-color": "#000",
        "--log-item-primary-color": "var(--primary-color)",
        "--log-item-date-color": "inherit",
        ":hover": {
            "--log-item-date-color": "transparent",
            "--log-item-buttons-pane-opacity": "0.95",
        },
        ":not(:last-child)": {
            borderBottom: "1px solid #eee",
        },
    },
    logItemSelected: {
        backgroundColor: "var(--primary-color)",
        "--log-item-primary-color": "#fff",
        color: "#fff",
        ":hover": {
            "--log-item-buttons-color": "#fff",
        },
    },
    title: {
        padding: 5,
        flex: "1 1 auto",
        overflow: "hidden",
        whiteSpace: "nowrap",
        direction: "rtl",
        unicodeBidi: "plaintext",
        textOverflow: "ellipsis",
    },
    titleSelected: {
        filter: "contrast(0.1) brightness(2)",
    },
    rightButtons: {
        opacity: "var(--log-item-buttons-pane-opacity)",
        display: "flex",
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        backgroundImage: "linear-gradient(to right, transparent, #fff 10px)",
    },
    rightButtonsSelected: {
        backgroundImage: "linear-gradient(to right, transparent, var(--primary-color) 10px)",
    },
    button: {
        flex: "0 0 auto",
        width: 35,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
        position: "relative",
        zIndex: 1,
        ":hover": {
            opacity: 1,
        },
    },
    activeIndicator: {
        flex: "0 0 auto",
        width: 35,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ":after": {
            content: '""',
            width: 8,
            height: 8,
            backgroundColor: "var(--log-item-primary-color)",
            borderRadius: "50%",
        },
    },
});
