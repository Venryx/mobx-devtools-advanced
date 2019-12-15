"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const aphrodite_1 = require("aphrodite");
const prop_types_1 = __importDefault(require("prop-types"));
const Draggable_1 = __importDefault(require("./Draggable"));
function shouldUseVerticalLayout(el) {
    return el.offsetWidth < IS_VERTICAL_BREAKPOINT;
}
const IS_VERTICAL_BREAKPOINT = 400;
const IGONORE_EVENT = Symbol("IGONORE_EVENT");
const dispatchResizeEvent = () => {
    const event = document.createEvent("HTMLEvents");
    event[IGONORE_EVENT] = true;
    event.initEvent("resize", true, false);
    window.dispatchEvent(event);
};
class SplitPane extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleResize = e => {
            if (e[IGONORE_EVENT])
                return;
            if (!this.resizeTimeout) {
                this.resizeTimeout = setTimeout(this.handleResizeTimeout, 50);
            }
        };
        this.handleResizeTimeout = () => {
            this.resizeTimeout = null;
            this.setState({
                isVertical: shouldUseVerticalLayout(this.el),
            }, dispatchResizeEvent);
        };
        this.handleDraggableStart = () => this.setState({ moving: true });
        this.handleDraggableMove = (x, y) => {
            const rect = this.el.getBoundingClientRect();
            this.setState(prevState => ({
                width: this.state.isVertical ? prevState.width : Math.floor(rect.left + (rect.width - x)),
                height: !this.state.isVertical ? prevState.height : Math.floor(rect.top + (rect.height - y)),
            }));
        };
        this.handleDraggableStop = () => this.setState({ moving: false }, dispatchResizeEvent);
        this.state = {
            moving: false,
            width: props.initialWidth,
            height: props.initialHeight,
        };
    }
    componentDidMount() {
        setTimeout(() => {
            // for css to be injected
            if (this.el) {
                const isVertical = shouldUseVerticalLayout(this.el);
                const width = Math.floor(this.el.offsetWidth * (isVertical ? 0.6 : 0.5));
                window.addEventListener("resize", this.handleResize, false);
                this.setState({
                    width: Math.max(250, width),
                    height: Math.floor(this.el.offsetHeight * 0.3),
                    isVertical,
                }, dispatchResizeEvent);
            }
        }, 0);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        clearTimeout(this.resizeTimeout);
    }
    render() {
        const { isVertical } = this.state;
        const { height, width } = this.state;
        return (react_1.default.createElement("div", { ref: el => {
                this.el = el;
            }, className: aphrodite_1.css(styles.container, isVertical ? styles.containerVertical : styles.containerHorizontal) },
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.leftPaneContent) }, this.props.left()),
            react_1.default.createElement("div", { style: isVertical ? { height } : { width }, className: aphrodite_1.css(styles.container, isVertical ? styles.containerVertical : styles.containerHorizontal, styles.rightPane) },
                react_1.default.createElement(Draggable_1.default, { className: aphrodite_1.css(styles.dragger, isVertical ? styles.draggerVertical : styles.draggerHorizontal), onStart: this.handleDraggableStart, onMove: this.handleDraggableMove, onStop: this.handleDraggableStop },
                    react_1.default.createElement("div", { className: aphrodite_1.css(styles.draggerInner, isVertical ? styles.draggerInnerVert : styles.draggerInnerHor) })),
                react_1.default.createElement("div", { className: aphrodite_1.css(styles.rightPaneContent) }, this.props.right()))));
    }
}
SplitPane.propTypes = {
    initialWidth: prop_types_1.default.number.isRequired,
    initialHeight: prop_types_1.default.number.isRequired,
    left: prop_types_1.default.func.isRequired,
    right: prop_types_1.default.func.isRequired,
};
exports.default = SplitPane;
const styles = aphrodite_1.StyleSheet.create({
    container: {
        display: "flex",
        minWidth: 0,
        flex: 1,
    },
    containerVertical: {
        flexDirection: "column",
    },
    containerHorizontal: {
        flexDirection: "row",
    },
    rightPane: {
        flex: "initial",
        minHeight: 120,
        minWidth: 150,
    },
    rightPaneContent: {
        display: "flex",
        width: "100%",
    },
    leftPaneContent: {
        display: "flex",
        minWidth: "30%",
        minHeight: "30%",
        flex: 1,
        overflow: "hidden",
    },
    dragger: {
        position: "relative",
        zIndex: 1,
    },
    draggerVertical: {
        padding: "0.25rem 0",
        margin: "-0.25rem 0",
        cursor: "ns-resize",
    },
    draggerHorizontal: {
        padding: "0 0.25rem",
        margin: "0 -0.25rem",
        cursor: "ew-resize",
    },
    draggerInner: {
        backgroundColor: "var(--split-dragger-color)",
        opacity: 0.4,
    },
    draggerInnerVert: {
        height: "1px",
        width: "100%",
    },
    draggerInnerHor: {
        height: "100%",
        width: "1px",
    },
});
