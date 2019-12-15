"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const PreviewValue_1 = require("../PreviewValue");
const Bridge_1 = require("../../Bridge");
const truncate = str => (str.length > 40 ? `${str.slice(0, 40)}…` : str);
class DataItem extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.toggleOpen = () => {
            if (this.state.open) {
                this.setState({ open: false });
                if (this.value && this.value[Bridge_1.symbols.inspected] === true) {
                    this.props.stopInspecting(this.props.path);
                }
            }
            else {
                this.setState({ open: true });
                if (this.value && this.value[Bridge_1.symbols.inspected] === false) {
                    this.props.inspect(this.props.path);
                }
            }
        };
        this.toggleBooleanValue = e => {
            this.props.change(this.props.path, e.target.checked);
        };
        this.handleContextMenu = e => {
            if (typeof this.props.showMenu === "function") {
                this.props.showMenu(e, this.value, this.props.path);
            }
        };
        this.state = { open: Boolean(this.props.startOpen) };
    }
    componentWillMount() {
        this.value = this.props.getValueByPath(this.props.path);
        if (this.state.open && this.value && this.value[Bridge_1.symbols.inspected] === false) {
            this.setState({ open: false });
        }
        else if (!this.state.open && this.value && this.value[Bridge_1.symbols.inspected] === true) {
            this.setState({ open: true });
        }
    }
    componentWillReceiveProps(nextProps) {
        this.value = nextProps.getValueByPath(nextProps.path);
        if (this.state.open && this.value && this.value[Bridge_1.symbols.inspected] === false) {
            this.setState({ open: false });
        }
        else if (!this.state.open && this.value && this.value[Bridge_1.symbols.inspected] === true) {
            this.setState({ open: true });
        }
    }
    isSimple() {
        const { value } = this;
        const otype = typeof value;
        return (value instanceof Date
            || otype === "number"
            || otype === "string"
            || value === null
            || value === undefined
            || otype === "boolean");
    }
    isDeptreeNode() {
        const { value } = this;
        return value && value[Bridge_1.symbols.type] === "deptreeNode";
    }
    renderOpener() {
        if (this.isSimple()) {
            if (typeof this.value === "boolean" && this.props.editable) {
                return (react_1.default.createElement("input", { checked: this.value, onChange: this.toggleBooleanValue, className: aphrodite_1.css(styles.toggler), type: "checkbox" }));
            }
            return null;
        }
        if (this.isDeptreeNode() && this.value.dependencies.length === 0)
            return null;
        return (react_1.default.createElement("div", { onClick: this.toggleOpen, className: aphrodite_1.css(styles.opener) }, this.state.open ? (react_1.default.createElement("span", { className: aphrodite_1.css(styles.expandedArrow) })) : (react_1.default.createElement("span", { className: aphrodite_1.css(styles.collapsedArrow) }))));
    }
    render() {
        const { value } = this;
        const complex = !this.isSimple();
        return (react_1.default.createElement("li", null,
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.head) },
                this.renderOpener(),
                react_1.default.createElement("div", { className: aphrodite_1.css([styles.name, complex && styles.nameComplex]), onClick: this.toggleOpen },
                    truncate(this.props.name),
                    ":"),
                react_1.default.createElement("div", { onContextMenu: this.handleContextMenu, className: aphrodite_1.css(styles.preview) },
                    react_1.default.createElement(PreviewValue_1.PreviewValue, { editable: this.props.editable && this.isSimple(), path: this.props.path, data: value, change: this.props.change }))),
            complex
                && this.state.open && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.children) },
                react_1.default.createElement(this.props.ChildDataView, { value: value, path: this.props.path, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, change: this.props.change, showMenu: this.props.showMenu, ChildDataView: this.props.ChildDataView, ChildDataItem: this.props.ChildDataItem })))));
    }
}
DataItem.propTypes = {
    startOpen: prop_types_1.default.bool,
    name: prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.number]),
    path: prop_types_1.default.array.isRequired,
    editable: prop_types_1.default.bool,
    getValueByPath: prop_types_1.default.func.isRequired,
    change: prop_types_1.default.func,
    inspect: prop_types_1.default.func,
    stopInspecting: prop_types_1.default.func,
    showMenu: prop_types_1.default.func,
    ChildDataView: prop_types_1.default.func.isRequired,
    ChildDataItem: prop_types_1.default.func.isRequired,
};
exports.default = DataItem;
const styles = aphrodite_1.StyleSheet.create({
    children: {},
    opener: {
        cursor: "pointer",
        marginLeft: -10,
        paddingRight: 3,
        position: "absolute",
        top: 4,
    },
    toggler: {
        left: -15,
        position: "absolute",
        top: -1,
    },
    head: {
        display: "flex",
        position: "relative",
    },
    value: {},
    name: {
        color: "var(--dataview-preview-key)",
        margin: "2px 3px",
    },
    nameComplex: {
        cursor: "pointer",
    },
    preview: {
        display: "flex",
        margin: "2px 3px",
        whiteSpace: "pre",
        wordBreak: "break-word",
        flex: 1,
        color: "var(--dataview-preview-value)",
        cursor: "default",
    },
    collapsedArrow: {
        borderColor: "transparent transparent transparent var(--dataview-arrow)",
        borderStyle: "solid",
        borderWidth: "4px 0 4px 7px",
        display: "inline-block",
        marginLeft: 1,
        verticalAlign: "top",
    },
    expandedArrow: {
        borderColor: "var(--dataview-arrow) transparent transparent transparent",
        borderStyle: "solid",
        borderWidth: "7px 4px 0 4px",
        display: "inline-block",
        marginTop: 1,
        verticalAlign: "top",
    },
});
