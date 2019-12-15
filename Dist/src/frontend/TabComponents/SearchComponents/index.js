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
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const InjectStores_1 = require("../../../utils/InjectStores");
let SearchComponents = class SearchComponents extends react_1.default.PureComponent {
    render() {
        return (react_1.default.createElement("input", { type: "search", value: this.props.searchText, onChange: this.props.changeSearch, placeholder: "Search (string/regex)", style: {
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: 3,
                borderRadius: 4,
                width: 133,
            } }));
    }
};
SearchComponents.propTypes = {
    searchText: prop_types_1.default.string.isRequired,
    changeSearch: prop_types_1.default.func.isRequired,
};
SearchComponents = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            treeExplorerStore: ["searchText"],
        },
        injectProps: ({ treeExplorerStore }) => ({
            searchText: treeExplorerStore.searchText,
            changeSearch: e => treeExplorerStore.changeSearch(e.target.value),
        }),
    })
], SearchComponents);
exports.default = SearchComponents;
