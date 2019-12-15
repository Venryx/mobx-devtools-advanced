import React from "react";
import * as Aphrodite from "aphrodite";
import {PreviewValue} from "../PreviewValue";
import {InjectStores} from "../../utils/InjectStores";
import Popover from "../Popover";
import {DataViewer} from "../DataViewer";

const {css, StyleSheet} = Aphrodite;

export function ChangeDataViewerPopover(props: {className?: string, displayName?: string, path: any[], getValueByPath: (path)=>any, inspect: (path: string[])=>void, stopInspecting: (path: string[])=>void, showMenu: Function}) {
	const {className, displayName, path, getValueByPath, inspect, stopInspecting, showMenu} = props;
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
		<Popover
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
				<PreviewValue data={value} displayName={displayName} path={path} />
			</span>
		</Popover>
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