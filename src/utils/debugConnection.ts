import {ToJSON, ToJSON_Advanced} from "js-vextensions";

const clean = data=>{
	if (!data) return [];
	if (!data.eventName) {
		if (data.data) return clean(data.data);
		if (data.payload) return clean(data.payload);
		if (data.events) return clean(data.events);
	}
	if (data instanceof Array) return data.map(clean);
	return [data.eventName || data];
};

const stringify = data=>{
	try {
		return ToJSON_Advanced(data, {trimDuplicates: true});
	} catch (e) {
		return data;
	}
};

declare const __DEBUG_CONNECTION__;
export default (title, data?)=>{
	if (__DEBUG_CONNECTION__) {
		const filename = (new Error().stack || "").match(/[^/]*\.js[:\d]*/)[0] || "";
		// eslint-disable-next-line no-console
		console.log(title, ...clean(data).map(stringify), filename);
	}
};