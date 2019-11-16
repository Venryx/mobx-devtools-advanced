import React from "react";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";
import SecondaryPanel from "../SecondaryPanel";
import ButtonPickComponent from "../SecondaryPanel/ButtonPickComponent";
import SearchComponents from "./SearchComponents";
import {InjectStores} from "../../utils/InjectStores";
import TreeView from "./TreeView";
import SplitPane from "../SplitPane";
import Breadcrumb from "./TreeView/Breadcrumb";
import TreeComponentExplorer from "./TreeComponentExplorer";
import {CompTreeNode} from "../../backend/mobxReactNodesTree_new";

const {css, StyleSheet} = Aphrodite;

type State = {compTree: CompTreeNode};

@InjectStores({
	subscribe: {
		treeExplorerStore: ["pickingComponent"],
	},
	injectProps: ({treeExplorerStore})=>({
		pickingComponent: treeExplorerStore.pickingComponent,
		togglePickingTreeExplorerComponent() {
			if (treeExplorerStore.pickingComponent) {
				treeExplorerStore.stopPickingComponent();
			} else {
				treeExplorerStore.pickComponent();
			}
		},
	}),
})
export default class TabComponents extends React.PureComponent<{pickingComponent?: boolean, togglePickingTreeExplorerComponent?: ()=>any}, State> {
	state = {} as State;
	leftRenderer = ()=>{
		const {compTree} = this.state;
		console.log("LeftRenderer...", compTree);
		return (
			<div className={css(styles.leftPane)}>
				<SecondaryPanel>
					<ButtonPickComponent
						onClick={this.props.togglePickingTreeExplorerComponent}
						active={this.props.pickingComponent}
					/>
					<SearchComponents />
					<button style={{marginLeft: 5, display: "inline-block"}} onClick={()=>{
						bridge_.send("backend:getCompTree");
						bridge_.once("frontend:receiveCompTree", ({compTree: newCompTree})=>{
							console.log("Got comp tree:", newCompTree);
							this.setState({compTree: newCompTree});
						});
					}}>Refresh</button>
				</SecondaryPanel>
				<TreeView compTree={compTree}/>
				<div className={css(styles.footer)}>
					<Breadcrumb />
				</div>
			</div>
		);
	};

	rightRenderer = ()=>(
		<div className={css(styles.rightPane)}>
			<TreeComponentExplorer />
		</div>
	);

	render() {
		return (
			<div className={css(styles.panel)} style={{height: "100%"}}>
				<div className={css(styles.panelBody)} style={{height: "100%"}}>
					<SplitPane
						initialWidth={10}
						initialHeight={10}
						left={this.leftRenderer}
						right={this.rightRenderer}
						isVertical={false}
					/>
				</div>
			</div>
		);
	}
}

const styles = StyleSheet.create({
	panel: {
		flex: "1 1 auto",
		display: "flex",
		flexDirection: "column",
	},
	panelBody: {
		display: "flex",
		flex: "1 1 auto",
	},
	leftPane: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	rightPane: {
		flex: "1 1 auto",
		overflow: "auto",
		padding: 10,
	},
});