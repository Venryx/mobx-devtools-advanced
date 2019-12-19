import React from "react";
import * as Aphrodite from "aphrodite";
import {Assert} from "js-vextensions";
import {PreviewValue} from "../PreviewValue";
import {InjectStores} from "../../utils/InjectStores";
import {PopoverTrigger} from "../Popover";
import {DataViewer} from "../DataViewer";
import {AccessorPack} from "../DataViewer/AccessorPack";

const {css, StyleSheet} = Aphrodite;

type ChangeDataViewerPopover = {
	className?: string, displayName?: string,
	accessors: AccessorPack, path?: any[],
	previewText?: string,
};
export function ChangeDataViewerPopover(props: ChangeDataViewerPopover) {
	const {className, displayName, accessors, path, previewText} = props;

	const value = accessors.getValueByPath(path);
	const otype = typeof value;
	if (
		otype === "number"
		|| otype === "string"
		|| value === null
		|| value === undefined
		|| otype === "boolean"
	) {
		return <PreviewValue accessors={accessors} path={path} className={className}/>;
	}

	const dataViewer = (
		<DataViewer
			accessors={accessors}
			path={path}
			decorator={InjectStores({
				subscribe: (stores, props2)=>({
					actionsLoggerStore: [`inspected--${props2.path.join("/")}`],
				}),
				shouldUpdate: ()=>true,
			})}
		/>
	);

	return (
		<PopoverTrigger
			requireClick
			content={dataViewer}
			onShown={()=>accessors.inspect(path)} // eslint-disable-line react/jsx-no-bind
		>
			<span
				className={`${css(styles.trigger)} ${className}`}
				onContextMenu={e=>{ // eslint-disable-line react/jsx-no-bind
					if (typeof accessors.showMenu === "function") {
						accessors.showMenu(e, undefined, path);
					}
				}}
			>
				{previewText != null && previewText}
				{previewText == null && <PreviewValue accessors={accessors} path={path} displayName={displayName}/>}
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