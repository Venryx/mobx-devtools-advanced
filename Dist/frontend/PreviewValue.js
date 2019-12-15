"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const prop_types_1 = __importDefault(require("prop-types"));
const aphrodite_1 = require("aphrodite");
const Bridge_1 = require("../Bridge");
const flash_1 = __importDefault(require("./TabComponents/TreeView/flash"));
const BAD_INPUT = Symbol("bad input");
class PreviewValue extends react_1.default.PureComponent {
    render() {
        if (!this.props.data
            || this.props.data instanceof Date
            || typeof this.props.data !== "object") {
            return react_1.default.createElement(PreviewSimpleValue, Object.assign({}, this.props));
        }
        return react_1.default.createElement(PreviewComplexValue, Object.assign({}, this.props));
    }
}
PreviewValue.propTypes = {
    data: prop_types_1.default.any,
};
exports.PreviewValue = PreviewValue;
class PreviewSimpleValue extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = e => {
            this.setState({
                text: e.target.value,
            });
        };
        this.handleKeyDown = e => {
            if (e.key === "Enter") {
                this.submit(true);
                this.setState({
                    editing: false,
                });
            }
            if (e.key === "Escape") {
                this.setState({
                    editing: false,
                });
            }
        };
        this.handleSubmit = () => this.submit(false);
        this.handleStartEditing = () => {
            if (this.props.editable) {
                this.setState({
                    editing: true,
                    text: valueToText(this.props.data),
                });
            }
        };
        this.state = {
            text: "",
            editing: false,
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.editing && !prevState.editing) {
            this.selectAll();
        }
        if (!this.state.editing && this.props.data !== prevProps.data) {
            // eslint-disable-next-line react/no-find-dom-node
            flash_1.default(react_dom_1.default.findDOMNode(this), "#FFFF00", "transparent", 1);
        }
    }
    submit(editing) {
        if (this.state.text === valueToText(this.props.data)) {
            this.setState({
                editing,
            });
            return;
        }
        const value = textToValue(this.state.text);
        if (value === BAD_INPUT) {
            this.setState({
                text: valueToText(this.props.data),
                editing,
            });
            return;
        }
        this.props.change(this.props.path, value);
        this.setState({
            editing,
        });
    }
    selectAll() {
        const { input } = this;
        if (this.state.text.match(/^".*"$/)) {
            input.selectionStart = 1;
            input.selectionEnd = input.value.length - 1;
        }
        else {
            input.selectionStart = 0;
            input.selectionEnd = input.value.length;
        }
    }
    render() {
        const { editable } = this.props;
        const { editing, text } = this.state;
        if (editing) {
            return (react_1.default.createElement("input", { autoFocus: true, ref: i => { this.input = i; }, className: aphrodite_1.css(styles.input), onChange: this.handleChange, onBlur: this.handleSubmit, onKeyDown: this.handleKeyDown, value: text }));
        }
        let { data } = this.props;
        if (typeof data === "string" && data.length > 200) {
            data = `${data.slice(0, 200)}…`;
        }
        return (react_1.default.createElement("div", { onClick: this.handleStartEditing, className: aphrodite_1.css(styles.simple, editable && styles.simpleEditable, typeof data === "string" && styles.simpleString, typeof data === "undefined" && styles.simpleUndefined) }, valueToText(data)));
    }
}
PreviewSimpleValue.propTypes = {
    change: prop_types_1.default.func,
    data: prop_types_1.default.any,
    path: prop_types_1.default.array.isRequired,
    editable: prop_types_1.default.bool,
};
class PreviewComplexValue extends react_1.default.PureComponent {
    render() {
        const { data } = this.props;
        const mobxObject = data[Bridge_1.symbols.mobxObject];
        if (Array.isArray(data)) {
            return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex) },
                this.props.displayName || "Array",
                "[",
                data.length,
                "]"));
        }
        switch (data[Bridge_1.symbols.type]) {
            case "serializationError":
                return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewError) }, "SerializerError");
            case "deptreeNode":
                return react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewDeptreeNode) }, data[Bridge_1.symbols.name]);
            case "function":
                return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex, mobxObject && styles.mobxObject) },
                    this.props.displayName || data[Bridge_1.symbols.name] || "fn",
                    "()"));
            case "object":
            case "map":
            case "set":
                return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex, mobxObject && styles.mobxObject) }, `${this.props.displayName || data[Bridge_1.symbols.name]}{…}`));
            case "date":
                return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex) }, this.props.displayName || data[Bridge_1.symbols.name]));
            case "symbol":
                return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex) }, this.props.displayName || data[Bridge_1.symbols.name]));
            case "iterator":
                return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex) }, `${this.props.displayName || data[Bridge_1.symbols.name]}(…)`));
            case "array_buffer":
            case "data_view":
            case "array":
            case "typed_array":
                return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex, mobxObject && styles.mobxObject) }, `${this.props.displayName || data[Bridge_1.symbols.name]}[${ /*data[symbols.meta].length*/"TODO"}]`));
            case undefined:
            case null:
                return (react_1.default.createElement("span", { className: aphrodite_1.css(styles.previewComplex) }, this.props.displayName || "{…}"));
            default:
                return null;
        }
    }
}
PreviewComplexValue.propTypes = {
    data: prop_types_1.default.any,
    displayName: prop_types_1.default.string,
};
function textToValue(txt) {
    if (!txt.length) {
        return BAD_INPUT;
    }
    if (txt === "undefined") {
        return undefined;
    }
    try {
        return JSON.parse(txt);
    }
    catch (e) {
        return BAD_INPUT;
    }
}
function valueToText(value) {
    if (value === undefined) {
        return "undefined";
    }
    if (typeof value === "number") {
        return value.toString();
    }
    if (value instanceof Date) {
        return value.toString();
    }
    return JSON.stringify(value);
}
const styles = aphrodite_1.StyleSheet.create({
    input: {
        flex: 1,
        minWidth: 50,
        boxSizing: "border-box",
        border: "none",
        padding: 0,
        outline: "none",
        fontFamily: "var(--font-family-monospace)",
    },
    simple: {
        display: "inline-flex",
        flex: 1,
        whiteSpace: "nowrap",
        cursor: "default",
        color: "var(--dataview-preview-value-primitive)",
    },
    mobxObject: {
        color: "var(--primary-color)",
    },
    simpleString: {
        color: "var(--dataview-preview-value-primitive-string)",
    },
    simpleUndefined: {
        color: "var(--dataview-preview-value-primitive-undefined)",
    },
    simpleEditable: {
        cursor: "default",
    },
    previewComplex: {
        color: "var(--dataview-preview-value-complex)",
    },
    previewDeptreeNode: {
        color: "var(--primary-color)",
    },
    previewError: {
        backgroundColor: "#ef383b",
        color: "#fff",
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: 2,
    },
});
