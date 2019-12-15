import React from "react";
import preferences from "../preferences";
import {InjectStores} from "../utils/InjectStores";
import ContextMenu from "./ContextMenu";
import MainMenu from "./MainMenu";
import {TabChanges} from "./TabChanges";
import TabComponents from "./TabComponents";
import TabMST from "./TabMST";
import TabPerformance from "./TabPerformance";

@InjectStores({
	subscribe: {
		updatesHighlighterStore: ["updatesEnabled"],
		actionsLoggerStore: ["logEnabled"],
		capabilitiesStore: ["mstFound", "mobxReactFound"],
		mstLoggerStore: ["mstLogEnabled"],
	},
	injectProps: ({
		actionsLoggerStore,
		updatesHighlighterStore,
		capabilitiesStore,
		mstLoggerStore,
	})=>({
		mobxReactFound: capabilitiesStore.mobxReactFound,
		mstFound: capabilitiesStore.mstFound,
		recordingActions: actionsLoggerStore.logEnabled,
		showingUpdates: updatesHighlighterStore.updatesEnabled,
		mstLogEnabled: mstLoggerStore.mstLogEnabled,
	}),
})
export class RichPanel extends React.Component<
	Partial<{mobxReactFound: boolean, mstFound: boolean, recordingActions: boolean, showingUpdates: boolean, mstLogEnabled: boolean}>,
	{preferredTab: string, activeTab: string}
> {
	UNSAFE_componentWillMount() {
		this.setState({activeTab: this.getAvailableTabs()[0]});
		preferences.get("lastTab").then(({lastTab = "components"})=>{
			if (lastTab) {
				if (this.getAvailableTabs().includes(lastTab)) {
					this.setState({activeTab: lastTab});
				} else {
					this.setState({preferredTab: lastTab});
				}
			}
		});
	}

	UNSAFE_componentWillUpdate(nextProps) {
		if (
			this.state.preferredTab
			&& this.state.activeTab !== this.state.preferredTab
			&& this.getAvailableTabs(nextProps).includes(this.state.preferredTab)
		) {
			// eslint-disable-next-line react/no-will-update-set-state
			this.setState({activeTab: this.state.preferredTab});
		}
	}

	getAvailableTabs(props = this.props) {
		return [
			"components",
			"mst",
			"changes",
			"performance",
		].filter(t=>t);
	}

	handleTabChage = tab=>{
		this.setState({activeTab: tab, preferredTab: tab});
		preferences.set({lastTab: tab});
	};

	renderContent() {
		switch (this.state.activeTab) {
			case "components":
				return <TabComponents />;
			case "changes":
				return <TabChanges />;
			case "mst":
				return <TabMST />;
			case "performance":
				return <TabPerformance />;
			default:
				return null;
		}
	}

	render() {
		const availableTabs = this.getAvailableTabs();

		return (
			<div style={{
				width: "100%", height: "100%", display: "flex", flexDirection: "column",
			}}
			>
				<MainMenu
					availableTabs={availableTabs}
					activeTab={this.state.activeTab}
					onTabChange={this.handleTabChage}
					processingTabs={[
						this.props.recordingActions && "changes",
						this.props.showingUpdates && "performance",
						this.props.mstLogEnabled && "mst",
					]}
				/>

				{this.renderContent()}

				<ContextMenu />
			</div>
		);
	}
}