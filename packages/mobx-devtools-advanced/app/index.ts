import path from "path";
// @ts-ignore
import {app, BrowserWindow} from "electron";

app.on("window-all-closed", ()=>{
	app.quit();
});

app.on("ready", ()=>{
	new BrowserWindow({width: 800, height: 600, icon: path.join(__dirname, "icons/icon128.png")})
		.loadURL(`file://${__dirname}/index.html`); // eslint-disable-line no-path-concat
});