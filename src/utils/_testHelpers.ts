const {jsdom} = require("jsdom/lib/old-api.js");

declare const global: any;

export const jsdomHelper = html=>{
	if (typeof document !== "undefined") {
		return;
	}
	global.document = jsdom(html || "");
	global.window = global.document.defaultView;
	global.navigator = {userAgent: "JSDOM"};
};