import React from "react";
import * as Aphrodite from "aphrodite";
import PropTypes from "prop-types";
import {InjectStores} from "../../utils/InjectStores";
import {DataViewer} from "../DataViewer";
import Collapsible from "../Collapsible";
import {PreviewValue} from "../PreviewValue";
import {GetValueByPath} from "../../utils/General";
import {Change} from "../../utils/changesProcessor";
import {RawAccessorPack} from "../DataViewer/AccessorPack";

const {css, StyleSheet} = Aphrodite;

@InjectStores({
	subscribe: ({mstLoggerStore})=>{
		const itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
		return {
			mstLoggerStore: [
				"selectedLogItemId",
				itemData && itemData.selectedLogItemId,
			],
		};
	},
	injectProps: ({mstLoggerStore})=>{
		const itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
		const logItem = itemData && itemData.logItemsById[itemData.selectedLogItemId];
		const initial = itemData && itemData.logItemsIds[0] === itemData.selectedLogItemId;
		return {
			logItem,
			initial,
			getValueByPath(path) {
				return GetValueByPath(logItem, path);
			},
		};
	},
})
export class LogItemExplorer extends React.PureComponent<
	{} & Partial<{logItem: any, getValueByPath: (path: string[])=>any, initial: boolean}>
> {
	dataDecorator = InjectStores({
		subscribe: (stores, {path})=>({
			treeExplorerStore: [`inspected--${path.join("/")}`],
		}),
		shouldUpdate: ()=>true,
	});

	render() {
		const {logItem} = this.props;
		if (!logItem) return null;
		return (
			<div className={css(styles.logExplorer)}>
				{logItem.snapshot
					&& (
						<Collapsible head="State" startOpen>
							<DataViewer accessors={new RawAccessorPack(logItem)} path={["snapshot"]} decorator={this.dataDecorator}/>
						</Collapsible>
					)}
				{this.props.logItem.patches && !this.props.initial && (
					<div className={css(styles.patches)}>
						{this.props.logItem.patches.map(patch=>{
							const path = patch.path.replace(/^\//, "").replace(/\//g, ".");
							switch (patch.op) {
								case "remove":
									return (
										<div>
											{path}
											{" "}
											<span className={css(styles.removedLabel)}>Removed</span>
										</div>
									);
								default: return (
									<div>
										{path}
										{" "}
										=
										{" "}
										<PreviewValue accessors={new RawAccessorPack(patch.value)} path={[]}/>
									</div>
								);
							}
						})}
					</div>
				)}
			</div>
		);
	}
}

const styles = StyleSheet.create({
	logExplorer: {
		flex: "1 1 auto",
		padding: 5,
		overflow: "auto",
	},
	patches: {
		marginTop: 20,
		paddingLeft: 15,
	},
	removedLabel: {
		textTransform: "uppercase",
		fontSize: 10,
		color: "#c41a16",
	},
});