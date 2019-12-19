import React from "react";
import * as Aphrodite from "aphrodite";
import {Assert} from "js-vextensions";
import {PreviewValue} from "../PreviewValue";
import {InjectStores} from "../../utils/InjectStores";
import {PopoverTrigger} from "../Popover";
import {DataViewer} from "../DataViewer";
import {FinalizeDataViewerDataProps} from "../DataViewer/DataView";

const {css, StyleSheet} = Aphrodite;

type ChangeDataViewerPopover = {
	className?: string, displayName?: string,
	// data, option 1
	path?: any[], getValueByPath?: (path)=>any,
	// data, option 2
	data?: any,
	inspect?: (path: string[])=>void, stopInspecting?: (path: string[])=>void, showMenu?: (event, value: any, path: string[])=>void,
	previewText?: string,
};
export function ChangeDataViewerPopover(props: ChangeDataViewerPopover) {
	let {className, displayName, path, getValueByPath, data, inspect, stopInspecting, showMenu, previewText} = props;

	({path, getValueByPath} = FinalizeDataViewerDataProps({path, getValueByPath, data}));

	const value = getValueByPath(path);
	//console.log("Value:", value);
	const otype = typeof value;
	if (
		otype === "number"
		|| otype === "string"
		|| value === null
		|| value === undefined
		|| otype === "boolean"
	) {
		return <PreviewValue data={value} className={className} path={path} />;
	}

	const dataViewer = (
		<DataViewer
			path={path}
			getValueByPath={getValueByPath}
			data={data}
			inspect={inspect}
			stopInspecting={stopInspecting}
			showMenu={showMenu}
			decorator={InjectStores({
				subscribe: (stores, props)=>({
					actionsLoggerStore: [`inspected--${props.path.join("/")}`],
				}),
				shouldUpdate: ()=>true,
			})}
		/>
	);

	return (
		<PopoverTrigger
			requireClick
			content={dataViewer}
			onShown={()=>inspect(path)} // eslint-disable-line react/jsx-no-bind
		>
			<span
				className={`${css(styles.trigger)} ${className}`}
				onContextMenu={e=>{ // eslint-disable-line react/jsx-no-bind
					if (typeof showMenu === "function") {
						showMenu(e, undefined, path);
					}
				}}
			>
				{previewText != null && previewText}
				{previewText == null && <PreviewValue data={value} displayName={displayName} path={path}/>}
			</span>
		</PopoverTrigger>
	);
}

const styles = StyleSheet.create({
	trigger: {
		paddingLeft: 3,
		paddingRight: 3,
		borderRadius: 2,
		cursor: "pointer",
		":hover": {
			backgroundColor: "rgba(0, 0, 0, 0.08)",
		},
	},
});