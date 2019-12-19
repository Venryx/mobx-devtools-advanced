import React from "react";
import {DataView} from "./DataView";
import {DataItem} from "./DataItem";

//type CompConstructor = new(...args)=>React.Component;
type CompConstructor = new(...args)=>React.Component;
export function DataViewer({decorator, ...otherProps}: Omit<React.ComponentProps<typeof DataView>, "ChildDataItem" | "ChildDataView"> & {decorator?: (compClass: CompConstructor)=>CompConstructor}) {
	const WrappedDataView = decorator ? decorator(DataView) as new()=>DataView : DataView;
	const WrappedDataItem = decorator ? decorator(DataItem) as new()=>DataItem : DataView;

	return (
    <WrappedDataView
      {...otherProps}
      ChildDataItem={WrappedDataItem}
      ChildDataView={WrappedDataView}
    />
	);
}

/*type DataViewerProps = Omit<React.ComponentProps<typeof DataView>, "ChildDataItem" | "ChildDataView">;
export function DataViewer(props: DataViewerProps) {
	const {...rest} = props;
	return (
    <DataView {...rest} ChildDataItem={DataItem} ChildDataView={DataView}/>
	);
}*/