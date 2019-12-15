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
const List_1 = __importDefault(require("react-virtualized/dist/commonjs/List"));
const InjectStores_1 = require("../../utils/InjectStores");
const MstLogItem_1 = require("./MstLogItem");
const ITEM_HEIGHT = 30;
let Log = class Log extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            listHeight: 400,
            listWidth: 400,
            autoScroll: true,
        };
        this.handleResize = () => {
            if (this.resizeTimeout)
                return;
            this.resizeTimeout = setTimeout(() => { this.updateSize(); }, 200);
        };
        this.handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
            const autoScroll = scrollTop >= scrollHeight - clientHeight;
            if (autoScroll !== this.state.autoScroll) {
                this.setState({ autoScroll });
            }
        };
        this.renderItem = ({ index, style, key }) => {
            const logItem = this.props.logItemsById[this.props.logItemsIds[index]];
            return (react_1.default.createElement(MstLogItem_1.MstLogItem, { style: style, key: key, logItem: logItem, selected: this.props.selectedLogItemId === logItem.id, last: index === this.props.logItemsIds.length - 1, active: this.props.activeLogItemId === logItem.id, initial: index === 0, onSelect: this.props.selectLogItemId, onCommit: this.props.commitLogItemId, onCancel: this.props.cancelLogItemId, onActivate: this.props.activateLogItemId }));
        };
    }
    componentDidMount() {
        this.resizeTimeout = setTimeout(() => this.updateSize(), 0); // timeout for css applying
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }
    updateSize() {
        if (!this.containerEl)
            return;
        this.resizeTimeout = undefined;
        this.setState({
            listWidth: this.containerEl.offsetWidth,
            listHeight: this.containerEl.offsetHeight,
        });
    }
    render() {
        if (!this.props.activeRootId)
            return null;
        const padding = 5;
        const rowCount = this.props.logItemsIds.length;
        return (react_1.default.createElement("div", { className: aphrodite_1.css(styles.logItems), ref: el => {
                this.containerEl = el;
            } },
            react_1.default.createElement(List_1.default, { ref: list => {
                    this.list = list;
                }, onScroll: this.handleScroll, style: { width: "auto", padding, boxSizing: "content-box" }, containerStyle: { width: "auto", maxWidth: "none" }, width: this.state.listWidth - (padding * 2), height: this.state.listHeight - (padding * 2), rowCount: rowCount, scrollToIndex: this.state.autoScroll && rowCount > 0 ? rowCount - 1 : undefined, rowHeight: ITEM_HEIGHT, overscanCount: 1, rowRenderer: this.renderItem })));
    }
};
Log.propTypes = {
    logItemsIds: prop_types_1.default.array.isRequired,
    logItemsById: prop_types_1.default.object.isRequired,
    activeRootId: prop_types_1.default.any,
    selectedLogItemId: prop_types_1.default.any,
    activeLogItemId: prop_types_1.default.any,
    activateLogItemId: prop_types_1.default.func.isRequired,
    cancelLogItemId: prop_types_1.default.func.isRequired,
    commitLogItemId: prop_types_1.default.func.isRequired,
    selectLogItemId: prop_types_1.default.func.isRequired,
};
Log = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            mstLoggerStore: [
                "mstLogItems",
                "activeRootId",
                "selectedLogItemId",
                "activeLogItemId",
            ],
        },
        injectProps: ({ mstLoggerStore }) => {
            const itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
            return {
                logItemsIds: itemData ? itemData.logItemsIds : [],
                logItemsById: itemData ? itemData.logItemsById : [],
                selectedLogItemId: itemData && itemData.selectedLogItemId,
                activeLogItemId: itemData && itemData.activeLogItemId,
                activeRootId: mstLoggerStore.activeRootId,
                activateLogItemId(id) {
                    mstLoggerStore.activateLogItemId(id);
                },
                commitLogItemId(id) {
                    mstLoggerStore.commitLogItemId(id);
                },
                cancelLogItemId(id) {
                    mstLoggerStore.cancelLogItemId(id);
                },
                selectLogItemId(id) {
                    mstLoggerStore.selectLogItemId(id);
                },
            };
        },
    })
], Log);
exports.default = Log;
const styles = aphrodite_1.StyleSheet.create({
    logItems: {
        width: "100%",
    },
});
