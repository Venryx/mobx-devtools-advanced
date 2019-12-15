import React from "react";
import * as Aphrodite from "aphrodite";
import {Text, CheckBox} from "react-vcomponents";
import {ModifyString, CE} from "js-vextensions";
import SecondaryPanel from "../SecondaryPanel";
import ButtonRecord from "../SecondaryPanel/ButtonRecord";
import ButtonClear from "../SecondaryPanel/ButtonClear";
import {Log} from "./Log";
import {InjectStores} from "../../utils/InjectStores";
import {InputSearch} from "../SecondaryPanel/InputSearch";
import {Change_types, Change, ChangeType} from "../../utils/changesProcessor";
import {ActionsStore} from "../stores/ActionsStore";

const {css, StyleSheet} = Aphrodite;

@InjectStores({
	subscribe: {
		actionsLoggerStore: ["logEnabled", "log"],
	},
	injectProps: ({actionsLoggerStore}: {actionsLoggerStore: ActionsStore})=>({
		store: actionsLoggerStore,
		searchText: actionsLoggerStore.searchText,
		changeTypesToShow: actionsLoggerStore.changeTypesToShow,
		logEnabled: actionsLoggerStore.logEnabled,
		logItemsIds: actionsLoggerStore.logItemsIds,
		logItemsById: actionsLoggerStore.logItemsById,
		clearLog() {
			actionsLoggerStore.clearLog();
		},
		toggleLogging() {
			actionsLoggerStore.toggleLogging();
		},
		setSearchText(e) {
			actionsLoggerStore.setSearchText(e.target.value);
		},
		setChangeTypesToShow(types: ChangeType[]) {
			actionsLoggerStore.setChangeTypesToShow(types);
		},
	}),
})
export class TabChanges extends React.PureComponent<
	{} & Partial<{
		store: ActionsStore,
		searchText: string, changeTypesToShow: ChangeType[], logEnabled: boolean, clearLog: ()=>void, toggleLogging: ()=>void, setSearchText: (event)=>void, setChangeTypesToShow: (types: ChangeType[])=>void,
		logItemsIds: number[], logItemsById: {[key: number]: Change},
	}>
> {
	GetItemsOfType(type: ChangeType) {
		const {logItemsIds, logItemsById} = this.props.store;
		const logItems = logItemsIds.map(changeID=>logItemsById[changeID]);
		return logItems.filter(change=>change.type == type);
	}
	render() {
		const {logEnabled, toggleLogging, clearLog, searchText, changeTypesToShow, setSearchText, setChangeTypesToShow, logItemsIds} = this.props;
		return (
			<div className={css(styles.panel)}>
				<SecondaryPanel>
					<ButtonRecord active={logEnabled} onClick={toggleLogging} showTipStartRecoding={!logEnabled && logItemsIds.length === 0}/>
					<ButtonClear onClick={clearLog} />
					<InputSearch searchText={searchText} changeSearch={setSearchText}/>
					<Text ml={5}>Types:</Text>
					{Change_types.map(type=>{
						const typeStr = ModifyString(type, {firstLower_to_upper: true, hyphenLower_to_hyphenUpper: true});
						const text = `${typeStr} (${this.GetItemsOfType(type).length})`;
						return (
							<CheckBox key={type} ml={3} text={text} checked={changeTypesToShow.includes(type)} onChange={checked=>{
								const newTypes = changeTypesToShow.slice();
								if (!checked) CE(newTypes).Remove(type);
								else newTypes.push(type);
								setChangeTypesToShow(newTypes);
							}}/>
						);
					})}
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