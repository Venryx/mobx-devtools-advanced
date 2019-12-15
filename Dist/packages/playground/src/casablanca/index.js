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
/* eslint-disable react/prop-types */
const react_1 = __importDefault(require("react"));
const mobx_state_tree_1 = require("mobx-state-tree");
const mobx_react_1 = require("mobx-react");
const react_dom_1 = require("react-dom");
const mobx_devtools_mst_1 = __importDefault(require("mobx-devtools-mst")); // eslint-disable-line
const getId = (() => { let i = 1; return () => { i += 1; return i; }; })();
const Todo = mobx_state_tree_1.types.model({
    id: mobx_state_tree_1.types.number,
    title: mobx_state_tree_1.types.string,
});
const TodoStore = mobx_state_tree_1.types
    .model('TodoStore', {
    todos: mobx_state_tree_1.types.array(Todo),
})
    .views(self => ({
    get completedTodos() {
        return self.todos.filter(t => t.done);
    },
    findTodosByUser(user) {
        return self.todos.filter(t => t.assignee === user);
    },
}))
    .actions(self => ({
    addTodo(title) {
        self.todos.push({
            id: getId(),
            title,
        });
    },
}));
const storeInstance = mobx_devtools_mst_1.default(TodoStore.create({
    todos: [{ title: 'Get biscuit', id: getId() }],
}));
class TodoComponent extends react_1.default.Component {
    render() {
        return (react_1.default.createElement("div", null,
            "#",
            this.props.id,
            " ",
            react_1.default.createElement("strong", null, this.props.title)));
    }
}
let TodoAppComponent = class TodoAppComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleInputKeydown = (e) => {
            if (e.keyCode === 13) {
                storeInstance.addTodo(e.target.value);
                e.target.value = '';
            }
        };
    }
    render() {
        return (react_1.default.createElement("div", null,
            storeInstance.todos.map(t => react_1.default.createElement(TodoComponent, Object.assign({ key: t.id }, t))),
            react_1.default.createElement("input", { type: "test", onKeyDown: this.handleInputKeydown }),
            react_1.default.createElement("button", { onClick: () => mobx_state_tree_1.destroy(storeInstance) }, "destroy")));
    }
};
TodoAppComponent = __decorate([
    mobx_react_1.observer
], TodoAppComponent);
react_dom_1.render(react_1.default.createElement(TodoAppComponent, null), document.querySelector('#root'));
