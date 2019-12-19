import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";
import {ToJSON, ToJSON_Advanced, CE} from "js-vextensions";
import {symbols} from "../Bridge";
import flash from "./TabComponents/TreeView/flash";
import {AccessorPack} from "./DataViewer/AccessorPack";

const {css, StyleSheet} = Aphrodite;

const BAD_INPUT = Symbol("bad input");

export class PreviewValue extends React.PureComponent<
	{
		accessors: AccessorPack, path: string[], editable?: boolean, className?: string, displayName?: string,
	}
> {
	render() {
		const {accessors, path} = this.props;
		const data = accessors.getValueByPath(path);
		if (!data || data instanceof Date || typeof data !== "object") {
			return <PreviewSimpleValue {...this.props} />;
		}
		return <PreviewComplexValue {...this.props} />;
	}
}

class PreviewSimpleValue extends React.PureComponent<
	{
		path?: string[], accessors: AccessorPack, editable?: boolean, displayName?: string,
	},
	{editing: boolean, text: string}
> {
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			editing: false,
		};
	}

	get data() {
		const {accessors, path} = this.props;
		return accessors.getValueByPath(path);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.editing && !prevState.editing) {
			this.selectAll();
		}
		if (!this.state.editing && this.data !== prevProps.data) {
			// eslint-disable-next-line react/no-find-dom-node
			flash(ReactDOM.findDOMNode(this), "#FFFF00", "transparent", 1);
		}
	}

	handleChange = e=>{
		this.setState({
			text: e.target.value,
		});
	};

	handleKeyDown = e=>{
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

	handleSubmit = ()=>this.submit(false);

	submit(editing) {
		const {path, accessors} = this.props;
		if (this.state.text === valueToText(this.data)) {
			this.setState({
				editing,
			});
			return;
		}
		const value = textToValue(this.state.text);
		if (value === BAD_INPUT) {
			this.setState({
				text: valueToText(this.data),
				editing,
			});
			return;
		}
		accessors.change(path, value);
		this.setState({
			editing,
		});
	}

	handleStartEditing = ()=>{
		const {editable} = this.props;
		if (editable) {
			this.setState({
				editing: true,
				text: valueToText(this.data),
			});
		}
	};

	selectAll() {
		const {input} = this;
		if (this.state.text.match(/^".*"$/)) {
			input.selectionStart = 1;
			input.selectionEnd = input.value.length - 1;
		} else {
			input.selectionStart = 0;
			input.selectionEnd = input.value.length;
		}
	}

	input;
	render() {
		const {accessors, path, editable} = this.props;
		let {data} = this;
		const {editing, text} = this.state;

		if (editing) {
			return (
				<input
					autoFocus
					ref={i=>{ this.input = i; }}
					className={css(styles.input)}
					onChange={this.handleChange}
					onBlur={this.handleSubmit}
					onKeyDown={this.handleKeyDown}
					value={text}
				/>
			);
		}
		if (typeof data === "string" && data.length > 200) {
			data = `${data.slice(0, 200)}…`;
		}

		return (
			<div
				onClick={this.handleStartEditing}
				className={css(
					styles.simple,
					editable && styles.simpleEditable,
					typeof data === "string" && styles.simpleString,
					typeof data === "undefined" && styles.simpleUndefined,
				)}
			>
				{valueToText(data)}
			</div>
		);
	}
}

class PreviewComplexValue extends React.PureComponent<{accessors: AccessorPack, path: string[], displayName?: string}> {
	/*get data() {
		const {accessors, path} = this.props;
		return accessors.getValueByPath(path);
	}*/
	render() {
		const {accessors, path} = this.props;
		const data = accessors.getValueByPath(path);
		const mobxObject = data[symbols.mobxObject];

		const ToJSON_Trimmed = function(obj) {
			const json = ToJSON_Advanced(obj, {
				trimDuplicates: true,
				keysToIgnore: CE(symbols).VValues(),
			});
			return CE(json).KeepAtMost(100, "...}");
		};

		if (Array.isArray(data)) {
			return (
				<span className={css(styles.previewComplex)}>
					{this.props.displayName || "Array"}
					[{data.length}]
				</span>
			);
		}
		const type = data[symbols.type];
		if (type == "serializationError") {
			return <span className={css(styles.previewError)}>SerializerError</span>;
		}
		if (type == "deptreeNode") {
			return <span className={css(styles.previewDeptreeNode)}>{data[symbols.name]}</span>;
		}
		if (type == "function") {
			return (
				<span className={css(styles.previewComplex, mobxObject && styles.mobxObject)}>
					{this.props.displayName || data[symbols.name] || "fn"}
					()
				</span>
			);
		}
		if (type == "object" || type == "map" || type == "set") {
			//const dataPreviewStr = ` ${CE(ToJSON_Advanced(data, {trimDuplicates: true})).KeepAtMost(100, "…}")}`;
			const dataPreviewStr = ` ${ToJSON_Trimmed(data)}`;
			return (
				<span className={css(styles.previewComplex, mobxObject && styles.mobxObject)}>
					{`${this.props.displayName || data[symbols.name] || ""}${dataPreviewStr}`}
				</span>
			);
		}
		if (type == "date") {
			return (
				<span className={css(styles.previewComplex)}>
					{this.props.displayName || data[symbols.name]}
				</span>
			);
		}
		if (type == "symbol") {
			return (
				<span className={css(styles.previewComplex)}>
					{this.props.displayName || data[symbols.name]}
				</span>
			);
		}
		if (type == "iterator") {
			return (
				<span className={css(styles.previewComplex)}>
					{`${this.props.displayName || data[symbols.name]}(…)`}
				</span>
			);
		}
		if (type == "array_buffer" || type == "data_view" || type == "array" || type == "typed_array") {
			return (
				<span className={css(styles.previewComplex, mobxObject && styles.mobxObject)}>
					{`${this.props.displayName || data[symbols.name]}[${/*data[symbols.meta].length*/"TODO"}]`}
				</span>
			);
		}
		if (type == null) {
			const dataPreviewStr = ` ${ToJSON_Trimmed(data)}`;
			return (
				//<span className={css(styles.previewComplex)}>{this.props.displayName || "{…}"}</span>
				<span className={css(styles.previewComplex, mobxObject && styles.mobxObject)}>
					{`${this.props.displayName || data[symbols.name] || ""}${dataPreviewStr}`}
				</span>
			);
		}
		return null;
	}
}

function textToValue(txt) {
	if (!txt.length) {
		return BAD_INPUT;
	}
	if (txt === "undefined") {
		return undefined;
	}
	try {
		return JSON.parse(txt);
	} catch (e) {
		return BAD_INPUT;
	}
}

function valueToText(value) {
	if (value === undefined) {
		return "undefined";
	} if (typeof value === "number") {
		return value.toString();
	} if (value instanceof Date) {
		return value.toString();
	}
	return ToJSON_Advanced(value, {trimDuplicates: true});
}

const styles = StyleSheet.create({
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