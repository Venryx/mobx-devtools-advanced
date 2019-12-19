/* eslint-disable react/jsx-no-bind */
import React from "react";
import PropTypes from "prop-types";
import List from "react-virtualized/dist/commonjs/List";
import * as Aphrodite from "aphrodite";
import {CE} from "js-vextensions";
import {LogItem} from "./LogItem";
import {InjectStores} from "../../utils/InjectStores";
import {Change} from "../../utils/changesProcessor";
import {GetValueByPath} from "../../utils/General";

const {css, StyleSheet} = Aphrodite;
const ITEM_HEIGHT = 24;

@InjectStores({
	subscribe: {
		actionsLoggerStore: ["log"],
	},
	injectProps: ({actionsLoggerStore})=>({
		changeTypesToShow: actionsLoggerStore.changeTypesToShow,
		logItemsIds: actionsLoggerStore.getFilteredLogItemsIds(),
		logItemsById: actionsLoggerStore.logItemsById,
		inspect(changeId, path) {
			actionsLoggerStore.inspect(changeId, path);
		},
		stopInspecting(changeId, path) {
			actionsLoggerStore.stopInspecting(changeId, path);
		},
		getValueByPath(changeId, path) {
			/*return path.reduce(
				(acc, next)=>acc && acc[next],
				actionsLoggerStore.logItemsById[changeId],
			);*/
			return GetValueByPath(actionsLoggerStore.logItemsById[changeId], path);
		},
		showMenu(e, changeId, path) {
			e.preventDefault();
			actionsLoggerStore.showContextMenu("attr", e, changeId, path);
		},
	}),
})
export class Log extends React.Component<
	Partial<{
		changeTypesToShow: string[],
		logItemsById: {[key: number]: Change}, logItemsIds: number[], inspect?: (changeID: number, path: string[])=>void, stopInspecting?: (changeID: number, path: string[])=>void,
		getValueByPath: (changeID: number, path: string[])=>any, showMenu(event, changeID: number, path: string[]),
	}>
> {
	state = {
		listHeight: 400,
		listWidth: 400,
		autoScroll: true,
	};

	resizeTimeout;
	componentDidMount() {
		this.resizeTimeout = setTimeout(()=>this.updateSize(), 0); // timeout for css applying
		window.addEventListener("resize", this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize);
	}

	handleResize = ()=>{
		if (this.resizeTimeout) return;
		this.resizeTimeout = setTimeout(()=>{
			this.resizeTimeout = undefined;
			this.updateSize();
		}, 200);
	};

	containerEl;
	updateSize() {
		if (!this.containerEl) return;
		this.setState({
			listWidth: this.containerEl.offsetWidth,
			listHeight: this.containerEl.offsetHeight,
		});
	}

	handleScroll = ({clientHeight, scrollHeight, scrollTop})=>{
		const autoScroll = scrollTop >= scrollHeight - clientHeight;
		if (autoScroll !== this.state.autoScroll) {
			this.setState({autoScroll});
		}
	};

	list;
	renderItem = ({index, style})=>{
		const id = this.props.logItemsIds[index];
		const change = this.props.logItemsById[id];
		/*const change = this.filteredItems[index];
		const id = CE(this.props.logItemsById).Pairs().find(a=>a.value == change).key;*/

		if (!change.height) change.height = ITEM_HEIGHT;
		return (
			<div style={style} key={id}>
				<LogItem
					getValueByPath={path=>this.props.getValueByPath(change.id, path)}
					inspect={path=>this.props.inspect(change.id, path)}
					stopInspecting={path=>this.props.stopInspecting(change.id, path)}
					showMenu={(e, _val, path)=>this.props.showMenu(e, change.id, path)}
					rootChange={change}
					change={change}
					onHeightUpdate={()=>this.list && this.list.recomputeRowHeights(index)}
					preferredHeight={ITEM_HEIGHT}
				/>
			</div>
		);
	};

	render() {
		const rowCount = this.props.logItemsIds.length;
		//const rowCount = this.filteredItems.length;
		const padding = 5;
		return (
			<div ref={el=>this.containerEl = el} className={css(styles.container)}>
				<List ref={c=>this.list = c}
					onScroll={this.handleScroll}
					style={{width: "auto", padding, boxSizing: "content-box"}}
					containerStyle={{width: "auto", maxWidth: "none"}}
					width={this.state.listWidth - (padding * 2)}
					height={this.state.listHeight - (padding * 2)}
					rowCount={rowCount}
					scrollToIndex={this.state.autoScroll && rowCount > 0 ? rowCount - 1 : undefined}
					rowHeight={({index})=>this.props.logItemsById[this.props.logItemsIds[index]].height || ITEM_HEIGHT}
					overscanCount={1}
					rowRenderer={this.renderItem}
				/>
			</div>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: "1 1 auto",
		overflow: "hidden",
		height: "100%",
	},
});