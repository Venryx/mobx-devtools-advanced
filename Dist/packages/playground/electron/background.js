"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const electron_1 = require("electron");
electron_1.app.on('ready', () => {
    electron_1.BrowserWindow.addDevToolsExtension(path_1.default.join(electron_1.app.getAppPath(), '../../lib/chrome'));
    new electron_1.BrowserWindow({ width: 800, height: 600, icon: path_1.default.join(__dirname, 'icons/icon128.png') })
        .loadURL(url_1.default.format({
        pathname: path_1.default.join(electron_1.app.getAppPath(), 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
    }));
});
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
