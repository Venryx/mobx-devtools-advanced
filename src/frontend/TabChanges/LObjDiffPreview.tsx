import React from "react";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";
import {DelIfFalsy} from "js-vextensions";
import {Change} from "../../utils/changesProcessor";
import {ChangeDataViewerPopover} from "./ChangeDataViewerPopover";
import {AccessorPack} from "../DataViewer/AccessorPack";

const {css, StyleSheet} = Aphrodite;

export class LObjDiffPreview2 extends React.PureComponent<{change: Change}> {
	getStats() {
		const {change} = this.props;
		switch (change.type) {
			case "add":
				return {addedCount: 1, removedCount: 0};
			case "delete":
				return {addedCount: 0, removedCount: 1};
			case "update":
				return {addedCount: 1, removedCount: 1};
			case "splice":
				return {addedCount: change.addedCount, removedCount: change.removedCount};
			default:
				return {addedCount: 0, removedCount: 0};
		}
	}

	render() {
		const {addedCount, removedCount, ...props} = this.getStats();
		return (
			<div className={css(styles.container)} {...props}>
				{addedCount > 0 && (
					<div className={css(styles.added)}>
						+
					{addedCount}
					</div>
				)}
				{removedCount > 0 && (
					<div className={css(styles.removed)}>
						−
					{removedCount}
					</div>
				)}
			</div>
		);
	}
}

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

export class LObjDiffPreview extends React.PureComponent<{change: Change, accessors: AccessorPack, path: any[]}> {
	getDiff() {
		const {change} = this.props;
		switch (change.type) {
			case "add":
				return {
					added: [{name: `${change.name}.${change["key"]}`, value: change.newValue, path: ["newValue"]}],
				};
			case "delete":
				return {
					removed: [{name: `${change.name}.${change["key"]}`, value: change.oldValue, path: ["oldValue"]}],
				};
			case "update":
				return {
					removed: [{name: `${change.name}.${change["key"]}`, value: change.oldValue, path: ["oldValue"]}],
					added: [{name: `${change.name}.${change["key"]}`, value: change.newValue, path: ["newValue"]}],
				};
			case "splice":
				return {
					added: (change.added || []).map((value, i)=>({
						name: `${change.index + i as any} [key: ${change["key"]}]`,
						value,
						path: ["added", i] as string[],
					})),
					removed: (change.removed || []).map((value, i)=>({
						name: `${change.index + i as any} [key: ${change["key"]}]`,
						value,
						path: ["removed", i] as string[],
					})),
				};
			default:
				return {added: [], removed: []};
		}
	}

	render() {
		const {accessors, path} = this.props;
		const {added = [], removed = []} = this.getDiff();
		if (added.length > 1 || removed.length > 1) return <LObjDiffPreview2 change={this.props.change} />;
		const remov = removed.length > 0 ? removed[0] : null;
		const add = added.length > 0 ? added[0] : null;
		if (remov && add && remov.name !== add.name) return <LObjDiffPreview2 change={this.props.change} />;
		return (
			<div className={css(styles2.container)}>
				<div className={css(styles2.innerContainer)}>
					{(remov || add)?.name}:{" "}
					{remov && <span className={css(styles2.propValueRemoved)}><ChangeDataViewerPopover accessors={accessors} path={path.concat(remov.path)}/></span>}
					{add && <span className={css(styles2.propValueAdded)}><ChangeDataViewerPopover accessors={accessors} path={path.concat(add.path)}/></span>}
					{/*{removed.map((diff, i)=>(
						<div className={css(styles2.diffRow, styles2.removed)} key={i}>
							<div className={css(styles2.propName, styles2.propNameRemoved)}>{diff.name}</div>
							<div className={css(styles2.propValue, styles2.propValueRemoved)}>
								<ChangeDataViewerPopover accessors={accessors} path={path.concat(diff.path)}/>
							</div>
						</div>
					))}
					{added.map((diff, i)=>(
						<div className={css(styles.diffRow, styles.added)} key={i}>
							{diff.name !== removed[0]?.name && <div className={css(styles2.propName, styles2.propNameAdded)}>{diff.name}</div>}
							<div className={css(styles2.propValue, styles2.propValueAdded)}>
								<ChangeDataViewerPopover accessors={accessors} path={path.concat(diff.path)}/>
							</div>
						</div>
					))*/}
				</div>
			</div>
		);
	}
}

const styles2 = StyleSheet.create({
	container: {
		fontFamily: "const(--font-family-monospace)",
		width: "100%",
		maxHeight: 270,
		overflow: "auto",
	},
	innerContainer: {
		display: "table",
	},
	title: {},
	diffRow: {
		display: "inline-block",
	},
	propName: {
		display: "inline-block",
		minWidth: 70,
		//maxWidth: 180,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		padding: 5,
	},
	propNameRemoved: {
		backgroundColor: "rgba(245, 0, 30, 0.13)",
	},
	propNameAdded: {
		backgroundColor: "rgba(0, 246, 54, 0.18)",
	},
	propValue: {
		padding: "5px 5px 5px 20px",
		flex: "1 1 auto",
		display: "inline-block",
		position: "relative",
		":before": {
			position: "absolute",
			left: 5,
			flex: "0 0 auto",
		},
	},
	propValueRemoved: {
		backgroundColor: "rgba(245, 0, 30, 0.07)",
		":before": {
			content: '"-"',
		},
	},
	propValueAdded: {
		backgroundColor: "rgba(0, 246, 54, 0.09)",
		":before": {
			content: '"+"',
		},
	},
});