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
const aphrodite_1 = require("aphrodite");
const Player_1 = __importDefault(require("./Player"));
const InjectStores_1 = require("../../utils/InjectStores");
const SecondaryPanel_1 = __importDefault(require("../SecondaryPanel"));
const ButtonRecord_1 = __importDefault(require("../SecondaryPanel/ButtonRecord"));
const ButtonClear_1 = __importDefault(require("../SecondaryPanel/ButtonClear"));
const SplitPane_1 = __importDefault(require("../SplitPane"));
const TabsMenu_1 = __importDefault(require("./TabsMenu"));
const MstLog_1 = __importDefault(require("./MstLog"));
const LogItemExplorer_1 = __importDefault(require("./LogItemExplorer"));
let TabMST = class TabMST extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.handleKeyDown = e => {
            switch (e.keyCode) {
                case 37:
                case 38: {
                    // left arrow
                    // up arrow
                    if (this.props.activeLogItemIndex > 0) {
                        e.preventDefault();
                        this.props.activateLogItemIndex(this.props.activeLogItemIndex - 1);
                    }
                    break;
                }
                case 39:
                case 40: {
                    // right arrow
                    // down arrow
                    if (this.props.activeLogItemIndex < this.props.length - 1) {
                        e.preventDefault();
                        this.props.activateLogItemIndex(this.props.activeLogItemIndex + 1);
                    }
                    break;
                }
                default:
                    break;
            }
        };
        this.leftRenderer = () => react_1.default.createElement(MstLog_1.default, null);
        this.rightRenderer = () => react_1.default.createElement(LogItemExplorer_1.default, null);
    }
    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }
    render() {
        if (!this.props.mstFound)
            return null;
        if (this.props.rootsIds.length === 0) {
            return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.emptyState) }, "No roots"));
        }
        const tabs = this.props.rootsIds.map(id => ({
            id,
            title: this.props.rootNamesById[id] || String(id),
        }));
        /* eslint-disable react/no-array-index-key */
        return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.tabmst), ref: el => {
                this.containerEl = el;
            } },
            react_1.default.createElement(SecondaryPanel_1.default, null,
                react_1.default.createElement(ButtonRecord_1.default, { active: this.props.mstLogEnabled, onClick: this.props.toggleMstLogging, showTipStartRecoding: !this.props.mstLogEnabled && this.props.length === 0 }),
                react_1.default.createElement(ButtonClear_1.default, { onClick: this.props.commitAll })),
            react_1.default.createElement(TabsMenu_1.default, { tabs: tabs, onChange: this.props.activateRootId, currentTabId: this.props.activeRootId }),
            react_1.default.createElement(SplitPane_1.default, { initialWidth: 10, initialHeight: 10, left: this.leftRenderer, right: this.rightRenderer, isVertical: false }),
            react_1.default.createElement(Player_1.default, { currentIndex: this.props.activeLogItemIndex, length: this.props.length, onIndexChange: this.props.activateLogItemIndex })));
    }
};
TabMST.propTypes = {
    mstFound: prop_types_1.default.bool,
    mstLogEnabled: prop_types_1.default.bool,
    length: prop_types_1.default.number.isRequired,
    rootsIds: prop_types_1.default.array.isRequired,
    rootNamesById: prop_types_1.default.object.isRequired,
    activeRootId: prop_types_1.default.any,
    activeLogItemIndex: prop_types_1.default.any,
    toggleMstLogging: prop_types_1.default.func.isRequired,
    activateRootId: prop_types_1.default.func.isRequired,
    activateLogItemIndex: prop_types_1.default.func.isRequired,
    commitAll: prop_types_1.default.func.isRequired,
};
TabMST = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            capabilitiesStore: ["mstFound"],
            mstLoggerStore: [
                "mstLogItems",
                "mstLogEnabled",
                "activeRootId",
                "activeLogItemId",
                "mstRootsUpdated",
            ],
        },
        injectProps: ({ mstLoggerStore, capabilitiesStore }) => {
            const itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
            return {
                mstFound: capabilitiesStore.mstFound,
                length: itemData ? itemData.logItemsIds.length : 0,
                activeLogItemIndex: itemData && itemData.activeLogItemIndex,
                rootsIds: Object.keys(mstLoggerStore.itemsDataByRootId),
                rootNamesById: mstLoggerStore.rootNamesById,
                mstLogEnabled: mstLoggerStore.mstLogEnabled,
                activeRootId: mstLoggerStore.activeRootId,
                toggleMstLogging() {
                    mstLoggerStore.toggleMstLogging();
                },
                commitAll() {
                    mstLoggerStore.commitAll();
                },
                activateRootId(id) {
                    mstLoggerStore.activateRootId(id);
                },
                activateLogItemIndex(index) {
                    mstLoggerStore.activateLogItemId(itemData.logItemsIds[index]);
                },
            };
        },
    })
], TabMST);
exports.default = TabMST;
const styles = aphrodite_1.StyleSheet.create({
    emptyState: {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        color: "#777",
        fontWeight: "bold",
    },
    tabmst: {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
    },
});
