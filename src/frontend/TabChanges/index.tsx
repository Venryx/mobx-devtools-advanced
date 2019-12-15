import React from "react";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";
import SecondaryPanel from "../SecondaryPanel";
import ButtonRecord from "../SecondaryPanel/ButtonRecord";
import ButtonClear from "../SecondaryPanel/ButtonClear";
import {Log} from "./Log";
import {InjectStores} from "../../utils/InjectStores";
import InputSearch from "../SecondaryPanel/InputSearch";

const {css, StyleSheet} = Aphrodite;

@InjectStores({
	subscribe: {
		actionsLoggerStore: ["logEnabled", "log"],
	},
	injectProps: ({actionsLoggerStore})=>({
		searchText: actionsLoggerStore.searchText,
		logEnabled: actionsLoggerStore.logEnabled,
		logItemsIds: actionsLoggerStore.logItemsIds,
		clearLog() {
			actionsLoggerStore.clearLog();
		},
		toggleLogging() {
			actionsLoggerStore.toggleLogging();
		},
		setSearchText(e) {
			actionsLoggerStore.setSearchText(e.target.value);
		},
	}),
})
export class TabChanges extends React.PureComponent<{searchText, logEnabled, logItemsIds, clearLog, toggleLogging, setSearchText}> {
	static propTypes = {
		searchText: PropTypes.string.isRequired,
		logEnabled: PropTypes.bool.isRequired,
		logItemsIds: PropTypes.array.isRequired,
		clearLog: PropTypes.func.isRequired,
		toggleLogging: PropTypes.func.isRequired,
		setSearchText: PropTypes.func.isRequired,
	};

	render() {
		return (
			<div className={css(styles.panel)}>
				<SecondaryPanel>
					<ButtonRecord
						active={this.props.logEnabled}
						onClick={this.props.toggleLogging}
						showTipStartRecoding={!this.props.logEnabled && this.props.logItemsIds.length === 0}
					/>
					<ButtonClear onClick={this.props.clearLog} />
					<InputSearch
						searchText={this.props.searchText}
						changeSearch={this.props.setSearchText}
					/>
				</SecondaryPanel>
				<Log />
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
		width: "100%",
		flex: "1 1 auto",
	},
	rightPane: {
		width: "100%",
		flex: "1 1 auto",
		padding: 10,
	},
});