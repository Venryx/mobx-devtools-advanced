"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const root = document.querySelector('#root');
const createButton = (title, onClick) => {
    const wrapper = document.createElement('div');
    const btn = document.createElement('button');
    btn.onclick = onClick;
    btn.innerHTML = title;
    wrapper.appendChild(btn);
    return wrapper;
};
class MyClass {
    constructor() {
        this.count = 0;
        this.count2 = 0;
        this.count3 = 0;
    }
}
__decorate([
    mobx_1.observable
], MyClass.prototype, "count", void 0);
__decorate([
    mobx_1.observable
], MyClass.prototype, "count2", void 0);
__decorate([
    mobx_1.observable
], MyClass.prototype, "count3", void 0);
const observableObject = mobx_1.observable({
    count: 0,
    count2: 0,
    count3: 0,
    map1: undefined,
});
const myClass = new MyClass();
mobx_1.reaction(() => myClass.count2, (c) => { myClass.count = c; }, { name: 'My reaction' });
mobx_1.reaction(() => myClass.count3, (c) => { myClass.count2 = c; });
const actionIncrement = mobx_1.action(() => { myClass.count += 1; });
const actionIncrement2 = mobx_1.action(() => { myClass.count2 += 1; });
const actionIncrement3 = mobx_1.action(() => { myClass.count3 += 1; });
const actionMapSet = mobx_1.action(() => {
    observableObject.map1 = new Map([['timestamp', Date.now()]]);
});
root.appendChild(createButton('Increment counter (object)', () => {
    observableObject.count += 1;
}));
root.appendChild(createButton('Increment counter (class)', () => {
    myClass.count += 1;
}));
root.appendChild(createButton('actionIncrement', actionIncrement));
root.appendChild(createButton('actionIncrement2', actionIncrement2));
root.appendChild(createButton('actionIncrement3', actionIncrement3));
root.appendChild(createButton('actionMapSet', actionMapSet));
