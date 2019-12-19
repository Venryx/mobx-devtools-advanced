import React from "react";
import * as Aphrodite from "aphrodite";
import {symbol} from "prop-types";
import {PreviewValue} from "../PreviewValue";
import {symbols} from "../../Bridge";
import {GetValueByPath} from "../../utils/General";
import {ActionsStore} from "../stores/ActionsStore";
import {AccessorPack} from "./AccessorPack";
import {DataView} from "./DataView";

const {css, StyleSheet} = Aphrodite;

const truncate = str=>(str.length > 40 ? `${str.slice(0, 40)}…` : str);

export type DataItemProps = {
	startOpen: boolean, name: string | number, editable: boolean,
	path: string[], accessors: AccessorPack,
	ChildDataView: new(..._)=>DataView, ChildDataItem: new(..._)=>DataItem,
};
export class DataItem extends React.Component<DataItemProps, {open: boolean}> {
	constructor(props) {
		super(props);
		this.state = {open: Boolean(this.props.startOpen)};
	}

	value;
	UNSAFE_componentWillMount() {
		const {path, accessors} = this.props;
		this.value = accessors.getValueByPath(path);
		if (this.state.open && this.value && this.value[symbols.inspected] === false) {
			this.setState({open: false});
		} else if (!this.state.open && this.value && this.value[symbols.inspected] === true) {
			this.setState({open: true});
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps: DataItemProps) {
		this.value = nextProps.accessors.getValueByPath(nextProps.path);
		if (this.state.open && this.value && this.value[symbols.inspected] === false) {
			this.setState({open: false});
		} else if (!this.state.open && this.value && this.value[symbols.inspected] === true) {
			this.setState({open: true});
		}
	}

	toggleOpen = ()=>{
		const {path, accessors} = this.props;
		if (this.state.open) {
			this.setState({open: false});
			if (this.value && this.value[symbols.inspected] === true) {
				accessors.stopInspecting(path);
			}
		} else {
			this.setState({open: true});
			if (this.value && this.value[symbols.inspected] === false) {
				accessors.inspect(path);
			}
		}
	};

	toggleBooleanValue = e=>{
		const {path, accessors} = this.props;
		accessors.change(path, e.target.checked);
	};

	isSimple() {
		const {value} = this;
		const otype = typeof value;
		return (
			value instanceof Date
			|| otype === "number"
			|| otype === "string"
			|| value === null
			|| value === undefined
			|| otype === "boolean"
		);
	}

	isDeptreeNode() {
		const {value} = this;
		return value && value[symbols.type] === "deptreeNode";
	}

	handleContextMenu = e=>{
		const {accessors} = this.props;
		if (typeof accessors.showMenu === "function") {
			accessors.showMenu(e, this.value, this.props.path);
		}
	};

	renderOpener() {
		if (this.isSimple()) {
			if (typeof this.value === "boolean" && this.props.editable) {
				return (
					<input
						checked={this.value}
						onChange={this.toggleBooleanValue}
						className={css(styles.toggler)}
						type="checkbox"
					/>
				);
			}
			return null;
		}
		if (this.isDeptreeNode() && this.value.dependencies.length === 0) return null;
		return (
			<div onClick={this.toggleOpen} className={css(styles.opener)}>
				{this.state.open ? (
					<span className={css(styles.expandedArrow)} />
				) : (
						<span className={css(styles.collapsedArrow)} />
				)}
			</div>
		);
	}

	render() {
		const {accessors, path, ChildDataView} = this.props;
		const {value} = this;
		const complex = !this.isSimple();

		const ancestors = path.slice(0, path.length - 1).map((segment, index)=>{
			const pathToAncestor = path.slice(0, index + 1);
			return accessors.getValueByPath(pathToAncestor);
		});
		const inspecting = (value != null && value[symbols.inspected] == true) || ancestors.find(a=>a[symbols.inspected] == true);

		return (
			<li>
				<div className={css(styles.head, complex && styles.headComplex)}>
					{this.renderOpener()}
					<div className={css([styles.name, complex && styles.nameComplex])} onClick={this.toggleOpen}>
						{truncate(this.props.name)}:
					</div>
					<div onContextMenu={this.handleContextMenu} className={css(styles.preview)} onClick={this.toggleOpen}>
						{inspecting && <span title="Displaying current data, *not* the data when the change occurred. (based on auto-serialize depth)">⚠️</span>}
						<PreviewValue accessors={accessors} path={this.props.path} editable={this.props.editable && this.isSimple()}/>
					</div>
				</div>
				{/*inspecting && <div style={{marginLeft: "0.75rem"}}>(Note: Displaying current data, not the data when the Change occurred.)</div>*/}
				{complex && this.state.open && (
					<div className={css(styles.children)}>
						<ChildDataView
							accessors={accessors}
							path={this.props.path}
							ChildDataView={this.props.ChildDataView}
							ChildDataItem={this.props.ChildDataItem}
						/>
					</div>
				)}
			</li>
		);
	}
}

const styles = StyleSheet.create({
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
	headComplex: {
		cursor: "pointer", // whole header is clickable, so mark it as such
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
		//cursor: "default",
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