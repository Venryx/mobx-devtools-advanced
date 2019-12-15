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
const preferences_1 = __importDefault(require("../preferences"));
const InjectStores_1 = require("../utils/InjectStores");
const ContextMenu_1 = __importDefault(require("./ContextMenu"));
const MainMenu_1 = __importDefault(require("./MainMenu"));
const TabChanges_1 = require("./TabChanges");
const TabComponents_1 = __importDefault(require("./TabComponents"));
const TabMST_1 = __importDefault(require("./TabMST"));
const TabPerformance_1 = __importDefault(require("./TabPerformance"));
let RichPanel = class RichPanel extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleTabChage = tab => {
            this.setState({ activeTab: tab, preferredTab: tab });
            preferences_1.default.set({ lastTab: tab });
        };
    }
    UNSAFE_componentWillMount() {
        this.setState({ activeTab: this.getAvailableTabs()[0] });
        preferences_1.default.get("lastTab").then(({ lastTab = "components" }) => {
            if (lastTab) {
                if (this.getAvailableTabs().includes(lastTab)) {
                    this.setState({ activeTab: lastTab });
                }
                else {
                    this.setState({ preferredTab: lastTab });
                }
            }
        });
    }
    UNSAFE_componentWillUpdate(nextProps) {
        if (this.state.preferredTab
            && this.state.activeTab !== this.state.preferredTab
            && this.getAvailableTabs(nextProps).includes(this.state.preferredTab)) {
            // eslint-disable-next-line react/no-will-update-set-state
            this.setState({ activeTab: this.state.preferredTab });
        }
    }
    getAvailableTabs(props = this.props) {
        return [
            "components",
            "mst",
            "changes",
            "performance",
        ].filter(t => t);
    }
    renderContent() {
        switch (this.state.activeTab) {
            case "components":
                return react_1.default.createElement(TabComponents_1.default, null);
            case "changes":
                return react_1.default.createElement(TabChanges_1.TabChanges, null);
            case "mst":
                return react_1.default.createElement(TabMST_1.default, null);
            case "performance":
                return react_1.default.createElement(TabPerformance_1.default, null);
            default:
                return null;
        }
    }
    render() {
        const availableTabs = this.getAvailableTabs();
        return (react_1.default.createElement("div", { style: {
                width: "100%", height: "100%", display: "flex", flexDirection: "column",
            } },
            react_1.default.createElement(MainMenu_1.default, { availableTabs: availableTabs, activeTab: this.state.activeTab, onTabChange: this.handleTabChage, processingTabs: [
                    this.props.recordingActions && "changes",
                    this.props.showingUpdates && "performance",
                    this.props.mstLogEnabled && "mst",
                ] }),
            this.renderContent(),
            react_1.default.createElement(ContextMenu_1.default, null)));
    }
};
RichPanel = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            updatesHighlighterStore: ["updatesEnabled"],
            actionsLoggerStore: ["logEnabled"],
            capabilitiesStore: ["mstFound", "mobxReactFound"],
            mstLoggerStore: ["mstLogEnabled"],
        },
        injectProps: ({ actionsLoggerStore, updatesHighlighterStore, capabilitiesStore, mstLoggerStore, }) => ({
            mobxReactFound: capabilitiesStore.mobxReactFound,
            mstFound: capabilitiesStore.mstFound,
            recordingActions: actionsLoggerStore.logEnabled,
            showingUpdates: updatesHighlighterStore.updatesEnabled,
            mstLogEnabled: mstLoggerStore.mstLogEnabled,
        }),
    })
], RichPanel);
exports.RichPanel = RichPanel;
