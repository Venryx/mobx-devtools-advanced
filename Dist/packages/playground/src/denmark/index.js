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
const tick = mobx_1.observable({ data: 0 });
class AutoCounter {
    constructor() {
        this.data = 0;
    }
    get computedData() {
        return -this.data;
    }
    increase() {
        this.data += 1;
    }
}
__decorate([
    mobx_1.observable
], AutoCounter.prototype, "data", void 0);
__decorate([
    mobx_1.computed
], AutoCounter.prototype, "computedData", null);
__decorate([
    mobx_1.action
], AutoCounter.prototype, "increase", null);
const autoCounter = new AutoCounter();
setInterval(() => {
    autoCounter.increase();
}, 2000);
let App = class App extends react_1.default.Component {
    componentDidMount() {
        this.startTime = new Date();
        this.intervel = setInterval(() => {
            tick.data = Math.floor((+new Date() - +this.startTime) / 1000);
        }, 33);
    }
    componentWillUnmount() {
        clearInterval(this.intervel);
    }
    render() {
        return (react_1.default.createElement("div", null,
            "time: ",
            tick.data,
            "s",
            this.props.children));
    }
};
App.propTypes = {
    children: prop_types_1.default.node,
};
App = __decorate([
    mobx_react_1.observer
], App);
let Counter = class Counter extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.manuallyIncrease = mobx_1.action('manuallyIncrease', () => {
            store.count += 1;
        });
        this.manuallyDecrease = mobx_1.action('manuallyDecrease', () => {
            store.count -= 1;
        });
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                react_1.default.createElement("button", { onClick: this.manuallyDecrease }, "\u2013"),
                store.count,
                react_1.default.createElement("button", { onClick: this.manuallyIncrease }, "+")),
            react_1.default.createElement("div", null, autoCounter.computedData)));
    }
};
Counter = __decorate([
    mobx_react_1.observer
], Counter);
react_dom_1.render(react_1.default.createElement(App, null,
    react_1.default.createElement(Counter, null)), document.querySelector('#root'));
