import {reaction} from "mobx";
import React, {Component} from "react";
import {Button} from "react-vcomponents";
import {observer} from "../../../../node_modules/mobx-react";
import {InjectStores} from "../../../utils/InjectStores";
//import {DataViewer as DataViewer_Old} from "../../DataViewer";
import {DataViewer} from "../../DataViewer";
import {store} from "../../Store";
import {TreeExplorerStore} from "../../stores/TreeExplorerStore";
import {RawAccessorPack} from "../../DataViewer/AccessorPack";
import {Bridge} from "../../../Bridge";

type State = {data: any};

@InjectStores({
	subscribe: ({treeExplorerStore})=>({
		treeExplorerStore: [treeExplorerStore.selectedNodeId, "selectedNodeId"],
	}),
	injectProps: ({treeExplorerStore})=>{
		return {treeStore: treeExplorerStore};
	},
})
@observer
export class TreeComponentExplorer extends Component<{treeStore?: TreeExplorerStore}, State> {
	state = {} as State;

	reaction_dispose: ()=>void;
	componentDidMount() {
		// whenever user clicks a new component, have data-viewer refresh
		//this.autorun_dispose = autorun(()=>this.RefreshData());
		this.reaction_dispose = reaction(()=>store.selectedMobXObjectPath, ()=>{
			this.RefreshData();
		});
	}
	componentWillUnmount() {
		if (this.reaction_dispose) {
			this.reaction_dispose();
			this.reaction_dispose = null;
		}
	}

	RefreshData() {
		this.setState({data: null}); // clear data, till new data comes
		Bridge.main.send("backend:GetMobXObjectData", {path: store.selectedMobXObjectPath});
		Bridge.main.once("frontend:ReceiveMobXObjectData", ({data})=>{
			//this.setState({dataStr: JSON.stringify(data, null, 2)});
			this.setState({data});
		});
	}
	render() {
		//const {treeStore} = this.props;
		const {data} = this.state;

		return (
			<div>
				Path: {store.selectedMobXObjectPath}
				<Button text="Refresh" enabled={store.selectedMobXObjectPath != null} onClick={()=>{
					this.RefreshData();
				}}/>
				{data && <DataViewer accessors={new RawAccessorPack(data)} path={[]} hiddenKeysRegex={/^(__\$mobRenderEnd|__\$mobRenderStart|_reactInternalInstance|updater|_sendFull)$/}/>}
				{/*data && <DataViewer_New data={data} keyInTree="root"/>*/}
			</div>
		);
	}
}

/*export class DataViewer_New extends BaseComponentPlus({depth: 0} as {data: any, depth?: number, keyInTree?: string}, {expanded: false}) {
	render() {
		const {data, depth, keyInTree} = this.props;
		const {expanded} = this.state;
		const expandable = data != null && typeof data == "object";
		const childKeys = expandable ? Object.keys(data) : [];
		// eslint-disable-next-line
		const dataPreviewStr = expanded ? null : " " + CE(ToJSON_Advanced(data, {trimDuplicates: true})).KeepAtMost(100,
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
						return <DataViewer_New key={childKey} keyInTree={childKey} depth={depth + 1} data={data[childKey]}/>;
					})}
				</Column>}
			</Column>
		);
	}
}*/