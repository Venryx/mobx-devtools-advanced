import React from "react";
import {DataView} from "./DataView";
import {DataItem} from "./DataItem";

//type CompConstructor = new(...args)=>React.Component;
type CompConstructor = new(...args)=>React.Component;
export function DataViewer({decorator, ...otherProps}: React.ComponentProps<typeof DataView> & {decorator: (compClass: CompConstructor)=>CompConstructor}) {
	const WrappedDataView = decorator(DataView) as new()=>DataView;
	const WrappedDataItem = decorator(DataItem) as new()=>DataItem;

	return (
    <WrappedDataView
      {...otherProps}
      ChildDataItem={WrappedDataItem}
      ChildDataView={WrappedDataView}
    />
	);
}