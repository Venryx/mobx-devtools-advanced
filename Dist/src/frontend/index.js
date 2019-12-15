"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const App_1 = __importDefault(require("./App"));
const RichPanel_1 = require("./RichPanel");
exports.default = config => {
    const reload = () => {
        react_dom_1.default.unmountComponentAtNode(config.node);
        setTimeout(() => {
            // for some reason React 16 does unmountComponentAtNode asynchronously (?)
            config.node.innerHTML = "";
            render();
        }, 0);
    };
    const render = () => {
        react_dom_1.default.render(react_1.default.createElement(App_1.default, Object.assign({}, config, { reload: reload }),
            react_1.default.createElement(RichPanel_1.RichPanel, null)), config.node);
    };
    render();
    return () => react_dom_1.default.unmountComponentAtNode(config.node);
};
