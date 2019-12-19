import React from "react";
import * as Aphrodite from "aphrodite";
import {Button, Button_styles} from "react-vcomponents";
import SecondaryPanel from "../SecondaryPanel";
import ButtonPickComponent from "../SecondaryPanel/ButtonPickComponent";
import {SearchComponents} from "./SearchComponents";
import {InjectStores} from "../../utils/InjectStores";
import TreeView from "./TreeView";
import SplitPane from "../SplitPane";
import Breadcrumb from "./TreeView/Breadcrumb";
import {TreeComponentExplorer} from "./TreeComponentExplorer";
import {CompTreeNode} from "../../backend/mobxReactNodesTree_new";

const {css, StyleSheet} = Aphrodite;

const compTreeProto = CompTreeNode.prototype;
export function RehydrateCompTree(compTree: CompTreeNode) {
	Object.setPrototypeOf(compTree, compTreeProto);
	for (const child of compTree.children) {
		RehydrateCompTree(child);
	}
}

type State = {compTree: CompTreeNode, collapseNonMobX: boolean};

// custom styling of components from react-vcomponents
Object.assign(Button_styles.root, {
	backgroundColor: "hsla(0,0%,85%,1)",
	color: "hsla(0,0%,0%,1)",
	border: "1px solid rgba(0,0,0,.3)",
});
Object.assign(Button_styles.root_override, {
	padding: "0px 7px",
});

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
	state = {collapseNonMobX: true} as State;
	leftRenderer = ()=>{
		const {compTree, collapseNonMobX} = this.state;
		return (
			<div className={css(styles.leftPane)}>
				<SecondaryPanel>
					{/*<ButtonPickComponent
						onClick={this.props.togglePickingTreeExplorerComponent}
						active={this.props.pickingComponent}
					/>
					<SearchComponents />*/}
					<Button ml={5} text="Refresh" onClick={()=>{
						bridge_.send("backend:getCompTree");
						bridge_.once("frontend:receiveCompTree", ({compTree: newCompTree})=>{
							RehydrateCompTree(newCompTree);
							console.log("Got comp tree:", newCompTree);
							this.setState({compTree: newCompTree});
						});
					}}/>
					<div style={{marginLeft: 5}}>Collapse non-MobX:</div>
					<input type="checkbox" checked={collapseNonMobX} style={{marginLeft: 5, display: "inline-block"}} onChange={e=>{
						this.setState({collapseNonMobX: !collapseNonMobX});
					}}/>
				</SecondaryPanel>
				<TreeView compTree={compTree} collapseNonMobX={collapseNonMobX}/>
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
		minHeight: 0, // prevents {flex: 1} from setting {[minWidth/minHeight]: "auto"}
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