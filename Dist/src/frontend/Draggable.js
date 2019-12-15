"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
class Draggable extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.onMove = evt => {
            evt.preventDefault();
            this.props.onMove(evt.pageX, evt.pageY);
        };
        this.onUp = evt => {
            evt.preventDefault();
            const doc = this.el.ownerDocument;
            doc.removeEventListener("mousemove", this.onMove);
            doc.removeEventListener("mouseup", this.onUp);
            this.props.onStop();
        };
        this.startDragging = evt => {
            evt.preventDefault();
            const doc = this.el.ownerDocument;
            doc.addEventListener("mousemove", this.onMove);
            doc.addEventListener("mouseup", this.onUp);
            this.props.onStart();
        };
    }
    render() {
        return (react_1.default.createElement("div", { ref: el => { this.el = el; }, style: this.props.style, className: this.props.className, onMouseDown: this.startDragging }, this.props.children));
    }
}
Draggable.propTypes = {
    onStart: prop_types_1.default.func.isRequired,
    onStop: prop_types_1.default.func.isRequired,
    onMove: prop_types_1.default.func.isRequired,
    className: prop_types_1.default.string,
    style: prop_types_1.default.object,
    children: prop_types_1.default.node,
};
exports.default = Draggable;
