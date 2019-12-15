import React from "react";
import {InjectStores} from "../../../utils/InjectStores";

@InjectStores({
	subscribe: {
		treeExplorerStore: ["searchText"],
	},
	injectProps: ({treeExplorerStore})=>({
		searchText: treeExplorerStore.searchText,
		changeSearch: e=>treeExplorerStore.changeSearch(e.target.value),
	}),
})
export class SearchComponents extends React.PureComponent<{searchText: string, changeSearch: () => void}> {
	render() {
		return (
			<input
				type="search"
				value={this.props.searchText}
				onChange={this.props.changeSearch}
				placeholder="Search (string/regex)"
				style={{
					border: "1px solid rgba(0, 0, 0, 0.12)",
					padding: 3,
					borderRadius: 4,
					width: 133,
				}}
			/>
		);
	}
}