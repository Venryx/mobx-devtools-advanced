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
const react_dom_1 = __importDefault(require("react-dom"));
const aphrodite_1 = require("aphrodite");
const InjectStores_1 = require("../utils/InjectStores");
const MIN_WIDTH = 150;
let ContextMenu = class ContextMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleClickOutside = e => {
            if (this.el && this.el.contains(e.target))
                return;
            this.props.contextMenu.close();
            this.unsubscribeClickOutside();
        };
    }
    componentWillMount() {
        this.portalHtmlEl = document.createElement("div");
        document.body.appendChild(this.portalHtmlEl);
    }
    componentDidMount() {
        if (this.props.contextMenu) {
            this.subscribeClickOutside();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.contextMenu && !nextProps.contextMenu) {
            this.unsubscribeClickOutside();
        }
        else if (!this.props.contextMenu && nextProps.contextMenu) {
            this.subscribeClickOutside();
        }
    }
    componentWillUnmount() {
        document.body.removeChild(this.portalHtmlEl);
    }
    subscribeClickOutside() {
        if (this.$subscribed)
            return;
        this.$subscribed = true;
        window.addEventListener("click", this.handleClickOutside, true);
    }
    unsubscribeClickOutside() {
        if (!this.$subscribed)
            return;
        this.$subscribed = false;
        window.removeEventListener("click", this.handleClickOutside, true);
    }
    render() {
        const { contextMenu } = this.props;
        if (!this.props.contextMenu)
            return null;
        return react_dom_1.default.createPortal(react_1.default.createElement("div", { className: aphrodite_1.css(styles.container), style: { left: Math.min(contextMenu.x, window.innerWidth - MIN_WIDTH), top: contextMenu.y }, ref: el => {
                this.el = el;
            } }, contextMenu.items.map(item => item && (react_1.default.createElement("div", { className: aphrodite_1.css(styles.item), key: item.key, onClick: item.action }, item.title)))), this.portalHtmlEl);
    }
};
ContextMenu.propTypes = {
    contextMenu: prop_types_1.default.shape({
        x: prop_types_1.default.number.isRequired,
        y: prop_types_1.default.number.isRequired,
        items: prop_types_1.default.array.isRequired,
        close: prop_types_1.default.func.isRequired,
    }),
};
ContextMenu = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            treeExplorerStore: ["contextMenu"],
            actionsLoggerStore: ["contextMenu"],
        },
        injectProps: ({ treeExplorerStore, actionsLoggerStore }) => ({
            contextMenu: treeExplorerStore.contextMenu || actionsLoggerStore.contextMenu,
        }),
    })
], ContextMenu);
exports.default = ContextMenu;
const styles = aphrodite_1.StyleSheet.create({
    container: {
        position: "fixed",
        backgroundColor: "#fff",
        border: "1px solid #eee",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
        minWidth: MIN_WIDTH,
        zIndex: 100002,
    },
    item: {
        color: "--default-text-color",
        padding: "5px 10px",
        cursor: "pointer",
        ":not(:last-child)": {
            borderBottom: "1px solid #eee",
        },
        ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
    },
});
