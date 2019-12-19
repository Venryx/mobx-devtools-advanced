/* eslint-disable react/no-array-index-key */
import React from "react";
import * as Aphrodite from "aphrodite";
import {ChangeDataViewerPopover} from "./ChangeDataViewerPopover";
import {Change} from "../../utils/changesProcessor";

const {css, StyleSheet} = Aphrodite;

export class LObjDiff extends React.PureComponent<{
	change: Change, path: any[], getValueByPath: (path: string[])=>any, inspect: (path: string[])=>void, stopInspecting: (path: string[])=>void, showMenu: (event, changeID: number, path: string[])=>void
}> {
	getDiff() {
		const {change} = this.props;
		switch (change.type) {
			case "add":
				return {
					added: [{name: `${change.name  } [key: ${change["key"]}]`, value: change.newValue, path: ["newValue"]}],
				};
			case "delete":
				return {
					removed: [{name: `${change.name  } [key: ${change["key"]}]`, value: change.oldValue, path: ["oldValue"]}],
				};
			case "update":
				return {
					removed: [{name: `${change.name  } [key: ${change["key"]}]`, value: change.oldValue, path: ["oldValue"]}],
					added: [{name: `${change.name  } [key: ${change["key"]}]`, value: change.newValue, path: ["newValue"]}],
				};
			case "splice":
				return {
					added: (change.added || []).map((value, i)=>({
						name: `${change.index + i as any  } [key: ${change["key"]}]`,
						value,
						path: ["added", i] as string[],
					})),
					removed: (change.removed || []).map((value, i)=>({
						name: `${change.index + i as any  } [key: ${change["key"]}]`,
						value,
						path: ["removed", i] as string[],
					})),
				};
			default:
				return {added: [], removed: []};
		}
	}

	render() {
		const {added = [], removed = []} = this.getDiff();
		return (
			<div className={css(styles.container)}>
				<div className={css(styles.innerContainer)}>
					{removed.map((diff, i)=>(
						<div className={css(styles.diffRow, styles.removed)} key={i}>
							<div className={css(styles.propName, styles.propNameRemoved)}>{diff.name}</div>
							<div className={css(styles.propValue, styles.propValueRemoved)}>
								<ChangeDataViewerPopover
									path={this.props.path.concat(diff.path)}
									getValueByPath={this.props.getValueByPath}
									inspect={this.props.inspect}
									stopInspecting={this.props.stopInspecting}
									showMenu={this.props.showMenu}
								/>
							</div>
						</div>
					))}
					{added.map((diff, i)=>(
						<div className={css(styles.diffRow, styles.added)} key={i}>
							<div className={css(styles.propName, styles.propNameAdded)}>{diff.name}</div>
							<div className={css(styles.propValue, styles.propValueAdded)}>
								<ChangeDataViewerPopover
									path={this.props.path.concat(diff.path)}
									getValueByPath={this.props.getValueByPath}
									inspect={this.props.inspect}
									stopInspecting={this.props.stopInspecting}
									showMenu={this.props.showMenu}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
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
		display: "table-row",
	},
	propName: {
		display: "table-cell",
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
		display: "table-cell",
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