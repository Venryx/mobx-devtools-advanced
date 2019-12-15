"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const aphrodite_1 = require("aphrodite");
class ModalContainer extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.stopPropagation = e => e.stopPropagation();
    }
    componentDidUpdate(prevProps) {
        const html = document.body.parentNode;
        if (prevProps.children && !this.props.children) {
            // Disappeared
            html.style.borderRight = null;
            html.style.overflow = null;
        }
        else if (!prevProps.children && this.props.children) {
            // Appeared
            const prevTotalWidth = html.offsetWidth;
            html.style.overflow = "hidden";
            const nextTotalWidth = html.offsetWidth;
            const rightOffset = Math.max(0, nextTotalWidth - prevTotalWidth);
            html.style.borderRight = `${rightOffset}px solid transparent`;
        }
    }
    render() {
        const { children, onOverlayClick } = this.props;
        if (!children)
            return null;
        return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.overlay), onClick: onOverlayClick },
            react_1.default.createElement("div", { key: "content", className: aphrodite_1.css(styles.modal), onClick: this.stopPropagation }, children)));
    }
}
ModalContainer.propTypes = {
    children: prop_types_1.default.node,
    onOverlayClick: prop_types_1.default.func.isRequired,
};
ModalContainer.defaultProps = {
    children: undefined,
};
exports.ModalContainer = ModalContainer;
const styles = aphrodite_1.StyleSheet.create({
    overlay: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 66000,
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        outline: 0,
        backgroundColor: "rgba(40, 40, 50, 0.5)",
        transformOrigin: "50% 25%",
    },
    modal: {
        position: "relative",
        width: "auto",
        margin: "5% 10%",
        zIndex: 1060,
    },
});
