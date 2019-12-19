import React, {Component} from "react";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";
import {BaseComponentPlus} from "react-vextensions";
import {Column, Row, Button, Text} from "react-vcomponents";
import {ToJSON, ToJSON_Advanced, CE} from "js-vextensions";
import {observer} from "../../../../node_modules/mobx-react";
import {InjectStores} from "../../../utils/InjectStores";
import {DataViewer as DataViewer_Old} from "../../DataViewer";
import Collapsible from "../../Collapsible";
import {store} from "../../Store";

const {css, StyleSheet} = Aphrodite;

@InjectStores({
	subscribe: ({treeExplorerStore})=>({
		treeExplorerStore: [treeExplorerStore.selectedNodeId, "selectedNodeId"],
	}),
	injectProps: ({treeExplorerStore})=>{
		const node = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId];
		return {
			node,
			selectedNodeId: treeExplorerStore.selectedNodeId,
			showMenu(e, val, path) {
				e.preventDefault();
				treeExplorerStore.showContextMenu(
					"attr",
					e,
					treeExplorerStore.selectedNodeId,
					node,
					val,
					path,
				);
			},
			inspect(path) {
				treeExplorerStore.inspect(path);
			},
			stopInspecting(path) {
				treeExplorerStore.stopInspecting(path);
			},
			change(path, value) {
				treeExplorerStore.changeValue({path, value});
			},
			getValueByPath(path) {
				return path.reduce(
					(acc, next)=>acc && acc[next],
					treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId],
				);
			},
		};
	},
})
export class TreeComponentExplorer_Old extends React.Component<any, any> {
	static propTypes = {
		node: PropTypes.object,
		change: PropTypes.func.isRequired,
		getValueByPath: PropTypes.func,
		inspect: PropTypes.func,
		stopInspecting: PropTypes.func,
		showMenu: PropTypes.func,
	};

	componentDidMount() {
		window["e"] = this;
	}

	reload() {
		this.props.inspect([], ()=>this.setState({}));
	}

	dataDecorator = InjectStores({
		subscribe: (stores, {path})=>({
			treeExplorerStore: [`inspected--${path.join("/")}`],
		}),
		shouldUpdate: ()=>true,
	});

	render() {
		const {node} = this.props;
		if (!node) return null;
		return (
			<div>
				<div className={css(styles.heading)}>
					<span className={css(styles.headingBracket)}>{"<"}</span>
					{node.name}
					<span className={css(styles.headingBracket)}>{"/>"}</span>
					{__DEV__ && ` ${node.id}`}
				</div>
				{node.dependencyTree && (
					<Collapsible
						startOpen={false}
						head={(
							<div className={css(styles.subheading)}>
								Dependencies (
									{node.dependencyTree.dependencies.length}
								)
							</div>
						)}
					>
						<div className={css(styles.block)}>
							<DataViewer_Old
								path={["dependencyTree"]}
								getValueByPath={this.props.getValueByPath}
								inspect={this.props.inspect}
								stopInspecting={this.props.stopInspecting}
								change={this.props.change}
								showMenu={this.props.showMenu}
								decorator={this.dataDecorator}
							/>
						</div>
					</Collapsible>
				)}

				<DataViewer_Old
					path={["component"]}
					getValueByPath={this.props.getValueByPath}
					inspect={this.props.inspect}
					stopInspecting={this.props.stopInspecting}
					change={this.props.change}
					showMenu={this.props.showMenu}
					decorator={this.dataDecorator}
					hidenKeysRegex={/^(__\$mobRenderEnd|__\$mobRenderStart|_reactInternalInstance|updater)$/}
				/>
			</div>
		);
	}
}

const styles = StyleSheet.create({
	heading: {
		fontSize: 17,
		color: "var(--treenode-tag-name)",
		fontFamily: "var(--font-family-monospace)",
		fontWeight: 500,
		marginBottom: 15,
	},
	headingBracket: {
		color: "var(--treenode-bracket)",
	},
	block: {
		marginBottom: 15,
	},
	subheading: {
		color: "var(--lighter-text-color)",
		textTransform: "uppercase",
		fontSize: 13,
		marginBottom: 5,
		fontWeight: 500,
	},
});

type State = {data: any};

@observer
export class TreeComponentExplorer extends Component<{}, State> {
	state = {} as State;
	render() {
		const {data} = this.state;
		return (
			<div>
				Path: {store.selectedMobXObjectPath}
				<Button text="Refresh" enabled={data} onClick={()=>{
					bridge_.send("backend:GetMobXObjectData", {path: store.selectedMobXObjectPath});
					bridge_.once("frontend:ReceiveMobXObjectData", ({data})=>{
						//this.setState({dataStr: JSON.stringify(data, null, 2)});
						this.setState({data});
					});
				}}/>
				{data && <DataViewer data={data} keyInTree="root"/>}
			</div>
		);
	}
}

export class DataViewer extends BaseComponentPlus({depth: 0} as {data: any, depth?: number, keyInTree?: string}, {expanded: false}) {
	render() {
		const {data, depth, keyInTree} = this.props;
		const {expanded} = this.state;
		const expandable = data != null && typeof data == "object";
		const childKeys = expandable ? Object.keys(data) : [];
		// eslint-disable-next-line
		const dataPreviewStr = expanded ? null : " " + CE(ToJSON_Advanced(data, {trimCircular: true})).KeepAtMost(100, 
			!expandable ? "..." :
			data instanceof Array ? "...]" :
			"...}");
		return (
			<Column>
				<Row style={{cursor: "pointer"}} onClick={()=>{
					this.SetState({expanded: !expanded});
				}}>
					<div style={{width: 10}}>{expandable ? (!expanded ? ">" : "...") : ""}</div>
					<div>{keyInTree}:</div>
					{expandable && data && data.constructor && data.constructor.name != "Object" &&
						<Text> ({data.constructor.name})</Text>}
					{!expanded &&
						<Text>{dataPreviewStr}</Text>}
				</Row>
				{expandable && expanded &&
				<Column style={{marginLeft: 10}}>
					{childKeys.map(childKey=>{
						//if (depth >= 50) return <div key={childKey}>Too deep.</div>;
						return <DataViewer key={childKey} keyInTree={childKey} depth={depth + 1} data={data[childKey]}/>;
					})}
				</Column>}
			</Column>
		);
	}
}