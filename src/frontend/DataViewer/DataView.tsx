import React from "react";
import * as Aphrodite from "aphrodite";
import {Assert} from "js-vextensions";
import {symbols} from "../../Bridge";
import Spinner from "../Spinner";
import {GetValueByPath} from "../../utils/General";
import {ActionsStore} from "../stores/ActionsStore";
import {DataItem} from "./DataItem";
import {TreeExplorerStore} from "../stores/TreeExplorerStore";
import {AccessorPack} from "./AccessorPack";

const {css, StyleSheet} = Aphrodite;

const renderSparseArrayHole = (count, key)=>(
	<li key={key}>
		<div className={css(styles.head)}>
			<div className={css(styles.sparseArrayHole)}>
				undefined ×
				{count}
			</div>
		</div>
	</li>
);

export class DataView extends React.Component<
	{
		startOpen?: boolean,
		accessors: AccessorPack, path: string[],
		className?: string, showMenu?: (event, value: any, path: string[])=>void,
		noSort?: boolean, hiddenKeysRegex?: RegExp, ChildDataView: typeof DataView, ChildDataItem: typeof DataItem
	}
> {
	/*_helpers: ReturnType<typeof CreateHelpers>;
	get helpers() {
		const {changeID, path} = this.props;
		if (this._helpers == null) {
			this._helpers = CreateHelpers(changeID, path);
		}
		return this._helpers;
	}*/

	renderItem(name, key, editable, itemPath?) {
		const {startOpen, path, accessors, ChildDataView, ChildDataItem} = this.props;
		return (
			<ChildDataItem
				key={key}
				name={name}
				path={itemPath || path.concat([name])}
				accessors={accessors}
				startOpen={startOpen}
				editable={editable}
				ChildDataView={ChildDataView}
				ChildDataItem={ChildDataItem}
			/>
		);
	}

	render() {
		const {startOpen, showMenu, path, accessors, ChildDataView, ChildDataItem, noSort, hiddenKeysRegex, className} = this.props;

		const value = accessors.getValueByPath(path);
		if (value == null) {
			return <div className={css(styles.missing)}>null</div>;
		}
		const editable = accessors.change && value[symbols.editable] === true;

		const isArray = Array.isArray(value);
		const isDeptreeNode = value[symbols.type] === "deptreeNode";
		const isMap = value[symbols.type] === "map";
		const isSet = value[symbols.type] === "set";
		const elements = [];
		if (isArray) {
			// Iterate over array, filling holes with special items
			let lastIndex = -1;
			value.forEach((item, i)=>{
				if (lastIndex < i - 1) {
					// Have we skipped over a hole?
					const holeCount = i - 1 - lastIndex;
					elements.push(renderSparseArrayHole(holeCount, `${i}-hole`));
				}
				elements.push(this.renderItem(i, i, editable));
				lastIndex = i;
			});
			if (lastIndex < value.length - 1) {
				// Is there a hole at the end?
				const holeCount = value.length - 1 - lastIndex;
				elements.push(renderSparseArrayHole(holeCount, `${lastIndex}-hole`));
			}
		} else if (isDeptreeNode) {
			value.dependencies.forEach((node, i)=>{
				elements.push(
					<ChildDataItem
						key={i}
						name={i}
						path={path.concat(["dependencies", i])}
						accessors={accessors}
						startOpen={startOpen}
						editable={editable}
						ChildDataView={ChildDataView}
						ChildDataItem={ChildDataItem}
					/>,
				);
			});
		} else if (isMap) {
			if (value[symbols.entries]) {
				value[symbols.entries].forEach(([key], i)=>elements.push(
					this.renderItem(key, key, editable, path.concat([symbols.entries, i, 1])),
				));
			}
		} else if (isSet) {
			if (value[symbols.entries]) {
				value[symbols.entries].forEach(([key], i)=>elements.push(
					this.renderItem(key, key, editable, path.concat([symbols.entries, i, 1])),
				));
			}
		} else {
			// Iterate over a regular object
			let names = Object.keys(value).filter(n=>n[0] !== "@" || n[1] !== "@");
			if (hiddenKeysRegex) {
				names = names.filter(n=>!hiddenKeysRegex.test(n));
			}
			if (!noSort) {
				names.sort(alphanumericSort);
			}
			names.forEach(name=>elements.push(this.renderItem(name, name, editable)));
		}

		if (!elements.length) {
			if (value[symbols.inspected] === false) return <Spinner />;
			return (
				<div className={css(styles.empty)}>
					{(()=>{
						switch (true) {
							case isArray:
								return "Empty array";
							case isDeptreeNode:
								return "No dependencies";
							case isMap:
								return "Empty map";
							default:
								return "Empty object";
						}
					})()}
				</div>
			);
		}

		/*const ancestors = path.map((segment, index)=>{
			const pathToAncestor = path.slice(0, index + 1);
			return accessors.getValueByPath(pathToAncestor);
		});
		const inspecting = value[symbols.inspected] == true || ancestors.find(a=>a[symbols.inspected]);*/

		return (
			<ul className={`${css(styles.container)} ${className}`}>
				{/* {value[symbols.proto] && ( */}
				{/* <ChildDataItem */}
				{/* key={symbols.proto} */}
				{/* name={symbols.proto} */}
				{/* path={path.concat([symbols.proto])} */}
				{/* startOpen={startOpen} */}
				{/* getValueByPath={getValueByPath} */}
				{/* inspect={inspect} */}
				{/* stopInspecting={stopInspecting} */}
				{/* change={change} */}
				{/* showMenu={showMenu} */}
				{/* editable={editable} */}
				{/* ChildDataView={ChildDataView} */}
				{/* ChildDataItem={ChildDataItem} */}
				{/* /> */}
				{/* )} */}
				{/*inspecting && "(Note: Displaying current data, not the data when the Change occurred.)"*/}
				{elements}
			</ul>
		);
	}
}

function alphanumericSort(a, b) {
	if (`${+a}` === a) {
		if (`${+b}` !== b) {
			return -1;
		}
		return +a < +b ? -1 : 1;
	}
	return a < b ? -1 : 1;
}

const styles = StyleSheet.create({
	container: {
		listStyle: "none",
		margin: 0,
		padding: 0,
		marginLeft: "0.75rem",
		fontFamily: "const(--font-family-monospace)",
		fontSize: 12,
	},

	head: {
		display: "flex",
		position: "relative",
	},

	empty: {
		marginLeft: "0.75rem",
		padding: "0 5px",
		color: "const(--dataview-preview-value-empty)",
		fontStyle: "italic",
	},

	missing: {
		fontWeight: "bold",
		marginLeft: "0.75rem",
		padding: "2px 5px",
		color: "const(--dataview-preview-value-missing)",
	},
});