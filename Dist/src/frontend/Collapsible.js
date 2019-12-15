"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
class Collapsible extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.toggleOpen = () => {
            this.setState({ open: !this.state.open });
        };
        this.state = { open: Boolean(this.props.startOpen) };
    }
    render() {
        return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.collapsible), style: this.props.style },
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.head), onClick: this.toggleOpen },
                Boolean(this.props.children) && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.opener), style: { top: this.props.verticalAlign } }, this.state.open ? (react_1.default.createElement("span", { className: aphrodite_1.css(styles.expandedArrow) })) : (react_1.default.createElement("span", { className: aphrodite_1.css(styles.collapsedArrow) })))),
                this.props.head),
            this.state.open && this.props.children));
    }
}
Collapsible.propTypes = {
    head: prop_types_1.default.node,
    children: prop_types_1.default.node,
    startOpen: prop_types_1.default.bool,
    verticalAlign: prop_types_1.default.number,
    style: prop_types_1.default.object,
};
Collapsible.defaultProps = {
    startOpen: true,
    verticalAlign: 4,
};
exports.default = Collapsible;
const styles = aphrodite_1.StyleSheet.create({
    collapsible: {
        paddingLeft: 10,
    },
    head: {
        display: "flex",
        position: "relative",
        cursor: "pointer",
    },
    opener: {
        cursor: "pointer",
        marginLeft: -10,
        paddingRight: 3,
        position: "absolute",
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
