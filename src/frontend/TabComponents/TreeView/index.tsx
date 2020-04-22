import PropTypes, {node} from "prop-types";
import React, {Component} from "react";
import * as Aphrodite from "aphrodite";
import {observer} from "mobx-react";
import {Button} from "react-vcomponents";
import Node from "./Node";
import * as SearchUtils from "../../../utils/SearchUtils";
import Spinner from "../../Spinner";
import {InjectStores} from "../../../utils/InjectStores";
import {CompTreeNode} from "../../../backend/mobxReactNodesTree_new";
import {ShallowChanged} from "../../../utils/General";
import {store} from "../../Store";

const {css, StyleSheet} = Aphrodite;

const MAX_SEARCH_ROOTS = 200;

type State = {};

@InjectStores({
	shouldUpdate: ShallowChanged, // custom
	subscribe: {
		treeExplorerStore: ["roots", "searchRoots", "loaded"],
	},
	injectProps: ({treeExplorerStore})=>({
		roots: treeExplorerStore.searchRoots || treeExplorerStore.roots,
		searchText: treeExplorerStore.searchText,
		searching: treeExplorerStore.searchText !== "",
		loaded: treeExplorerStore.loaded,
		getComponents: ()=>treeExplorerStore.getComponents(),
		reset: ()=>treeExplorerStore.reset(),
		selectInDirection(direction) {
			const roots = treeExplorerStore.searchRoots || treeExplorerStore.roots;
			const parentId = treeExplorerStore.nodeParentsById[treeExplorerStore.selectedNodeId];
			const siblingsIds = parentId ? treeExplorerStore.nodesById[parentId].children : roots;
			const childrenIds = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId].children;
			const isBottomTag = treeExplorerStore.isBottomTagSelected;
			const {collapsed} = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId];
			switch (direction) {
				case "up": {
					const sidx = siblingsIds.indexOf(treeExplorerStore.selectedNodeId);
					if (isBottomTag && childrenIds.length > 0) {
						const lastChildId = childrenIds[childrenIds.length - 1];
						if (treeExplorerStore.nodesById[lastChildId].collapsed) {
							treeExplorerStore.selectBottom(lastChildId);
						} else {
							treeExplorerStore.selectTop(lastChildId);
						}
					} else if (sidx !== -1 && sidx !== 0) {
						treeExplorerStore.selectBottom(siblingsIds[sidx - 1]);
					} else if (parentId) {
						treeExplorerStore.selectTop(parentId);
					}
					break;
				}
				case "down": {
					const sidx = siblingsIds.indexOf(treeExplorerStore.selectedNodeId);
					if (!isBottomTag && !collapsed && childrenIds.length > 0) {
						treeExplorerStore.selectTop(childrenIds[0]);
					} else if (sidx !== -1 && sidx !== siblingsIds.length - 1) {
						treeExplorerStore.selectTop(siblingsIds[sidx + 1]);
					} else if (parentId) {
						treeExplorerStore.selectBottom(parentId);
					}
					break;
				}
				case "left": {
					if (!collapsed) {
						treeExplorerStore.collapse(treeExplorerStore.selectedNodeId);
						treeExplorerStore.selectTop(treeExplorerStore.selectedNodeId);
					} else if (parentId) {
						treeExplorerStore.selectTop(parentId);
					}
					break;
				}
				case "right": {
					if (collapsed) {
						treeExplorerStore.uncollapse(treeExplorerStore.selectedNodeId);
					} else if (childrenIds.length > 0) {
						treeExplorerStore.selectTop(childrenIds[0]);
					}
					break;
				}
				default:
					break;
			}
		},
	}),
})
export default class TreeView extends React.Component<
	{
		roots?: any[], searchText?: string, searching?: boolean,
		getComponents?: ()=>any[], reset?: ()=>any, selectInDirection?: (direction: "up" | "down" | "left" | "right")=>any,
		loaded?: boolean,
		compTree: CompTreeNode, collapseNonMobX: boolean,
	},
	State
> {
	static propTypes = {
		loaded: PropTypes.bool.isRequired,
	};
	state = {} as State;

	componentDidMount() {
		this.props.getComponents();
		window.addEventListener("keydown", this.handleKeyDown);
	}

	componentWillUnmount() {
		this.props.reset();
		window.removeEventListener("keydown", this.handleKeyDown);
	}

	node = undefined;

	handleKeyDown = e=>{
		switch (e.keyCode) {
			case 38: {
				// up arrow
				e.preventDefault();
				this.props.selectInDirection("up");
				break;
			}
			case 40: {
				// down arrow
				e.preventDefault();
				this.props.selectInDirection("down");
				break;
			}
			case 37: {
				// left arrow
				e.preventDefault();
				this.props.selectInDirection("left");
				break;
			}
			case 39: {
				// right arrow
				e.preventDefault();
				this.props.selectInDirection("right");
				break;
			}
			default:
				break;
		}
	};

	scrollTo(toNode) {
		if (!this.node) {
			return;
		}
		let val = 0;
		const height = toNode.offsetHeight;

		let offsetParentNode = toNode;
		while (offsetParentNode && this.node.contains(offsetParentNode)) {
			val += offsetParentNode.offsetTop;
			offsetParentNode = offsetParentNode.offsetParent;
		}

		const top = this.node.scrollTop;
		const rel = val - this.node.offsetTop;
		const margin = 40;
		if (top > rel - margin) {
			this.node.scrollTop = rel - margin;
		} else if (top + this.node.offsetHeight < rel + height + margin) {
			this.node.scrollTop = (rel - this.node.offsetHeight) + height + margin;
		}
	}

	render() {
		const {roots, searching, searchText, loaded, compTree, collapseNonMobX} = this.props;
		console.log("TreeView.CompTree:", compTree);

		// Convert search text into a case-insensitive regex for match-highlighting.
		const searchRegExp = SearchUtils.isValidRegex(searchText)
			? SearchUtils.searchTextToRegExp(searchText)
			: null;

		return (
			<div className={css(styles.container)} style={{overflowY: "auto"}}>
				{compTree && <CompTreeNodeUI node={compTree} collapseNonMobX={collapseNonMobX}/>}
				{compTree && compTree.fiber == null && <div>Could not find any React Fiber roots. (React must be v16 or higher)</div>}
			</div>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		fontFamily: "var(--font-family-monospace)",
		fontSize: 12,
		lineHeight: 1.3,
		flex: 1,
		minHeight: 0, // prevents {flex: 1} from setting {[minWidth/minHeight]: "auto"}
		display: "flex",
		flexDirection: "column",
		userSelect: "none",

		":after": {
			opacity: 0.5,
			content: '""',
			width: 7,
			height: "100%",
			backgroundImage: "linear-gradient(to right, transparent, #fff) !important",
			position: "absolute",
			top: 0,
			right: 0,
			pointerEvents: "none",
		},
	},

	scroll: {
		overflow: "auto",
		flex: 1,
		minHeight: 0, // prevents {flex: 1} from setting {[minWidth/minHeight]: "auto"}
		display: "flex",
		alignItems: "flex-start",
	},

	scrollContents: {
		flexDirection: "column",
		flex: 1,
		display: "flex",
		alignItems: "stretch",
		padding: 5,
	},

	noSearchResults: {
		color: "#777",
		// fontFamily: sansSerif.family,
		// fontSize: sansSerif.sizes.normal,
		padding: "10px",
		fontWeight: "bold",
	},
});

@observer
class CompTreeNodeUI extends Component<{node: CompTreeNode, collapseNonMobX: boolean}, {}> {
	render() {
		const {node, collapseNonMobX} = this.props;
		const nodeIsMobX = node.compIsObservable || node.compRenderIsObserver;
		return (
			<div>
				{(nodeIsMobX || !collapseNonMobX) &&
				<div>
					{node.typeName || "n/a"}
					{node.compIsObservable &&
						<Button text={"[mobx data]"} style={{marginLeft: 5}} onClick={()=>{
							store.selectedMobXObjectPath = node.path;
						}}/>}
					{node.compRenderIsObserver &&
						<Button text={"[mobx observer]"} style={{marginLeft: 5}} onClick={()=>{
							store.selectedMobXObjectPath = node.RenderFuncPath;
						}}/>}
				</div>}
				<div style={{marginLeft: 10}}>
					{node.children.map((child, index)=>{
						return (
							<CompTreeNodeUI key={index} node={child} collapseNonMobX={collapseNonMobX}/>
						);
					})}
				</div>
			</div>
		);
	}
}