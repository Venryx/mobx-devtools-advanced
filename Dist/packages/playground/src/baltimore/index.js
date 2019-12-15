"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/jsx-no-bind */
const react_1 = __importDefault(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const prop_types_1 = __importDefault(require("prop-types"));
const react_dom_1 = require("react-dom");
const store = mobx_1.observable({ count: 0 });
let App = class App extends react_1.default.Component {
    render() {
        return (react_1.default.createElement("div", null, this.props.children));
    }
};
App.propTypes = {
    children: prop_types_1.default.node,
};
App = __decorate([
    mobx_react_1.observer
], App);
let Counter = class Counter extends react_1.default.Component {
    constructor(...args) {
        super(...args);
        this.map = new Map([['a', '1'], ['b', 2]]);
        this.omap = mobx_1.observable.map({ a: '1', b: 2 });
        this.set = new Set([['a', 2]]);
        this.oset = mobx_1.observable.set(['a', 2]);
        this.date = new Date();
        this.array = [1, 2, 3];
        this.oarray = mobx_1.observable([1, 2, 3]);
        this.obj = { a: 's' };
        this.number = 5;
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("button", { onClick: () => { store.count -= 1; } }, "\u2013"),
            store.count,
            react_1.default.createElement("button", { onClick: () => { store.count += 1; } }, "+")));
    }
};
Counter = __decorate([
    mobx_react_1.observer
], Counter);
react_dom_1.render(react_1.default.createElement(App, null,
    react_1.default.createElement(Counter, null)), document.querySelector('#root'));
