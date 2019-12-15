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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/jsx-no-bind */
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const List_1 = __importDefault(require("react-virtualized/dist/commonjs/List"));
const Aphrodite = __importStar(require("aphrodite"));
const LogItem_1 = require("./LogItem");
const InjectStores_1 = require("../../utils/InjectStores");
const { css, StyleSheet } = Aphrodite;
const ITEM_HEIGHT = 24;
let Log = class Log extends react_1.default.Component {
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
            this.resizeTimeout = setTimeout(() => {
                this.resizeTimeout = undefined;
                this.updateSize();
            }, 200);
        };
        this.handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
            const autoScroll = scrollTop >= scrollHeight - clientHeight;
            if (autoScroll !== this.state.autoScroll) {
                this.setState({ autoScroll });
            }
        };
        this.renderItem = ({ index, style }) => {
            const id = this.props.logItemsIds[index];
            const change = this.props.logItemsById[id];
            if (!change.height)
                change.height = ITEM_HEIGHT;
            return (react_1.default.createElement("div", { style: style, key: id },
                react_1.default.createElement(LogItem_1.LogItem, { getValueByPath: path => this.props.getValueByPath(change.id, path), inspect: path => this.props.inspect(change.id, path), stopInspecting: path => this.props.stopInspecting(change.id, path), showMenu: (e, _val, path) => this.props.showMenu(e, change.id, path), change: change, onHeightUpdate: () => this.list && this.list.recomputeRowHeights(index), preferredHeight: ITEM_HEIGHT })));
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
        this.setState({
            listWidth: this.containerEl.offsetWidth,
            listHeight: this.containerEl.offsetHeight,
        });
    }
    render() {
        const rowCount = this.props.logItemsIds.length;
        const padding = 5;
        return (react_1.default.createElement("div", { className: css(styles.container), ref: el => {
                this.containerEl = el;
            } },
            react_1.default.createElement(List_1.default, { ref: list => {
                    this.list = list;
                }, onScroll: this.handleScroll, style: { width: "auto", padding, boxSizing: "content-box" }, containerStyle: { width: "auto", maxWidth: "none" }, width: this.state.listWidth - (padding * 2), height: this.state.listHeight - (padding * 2), rowCount: rowCount, scrollToIndex: this.state.autoScroll && rowCount > 0 ? rowCount - 1 : undefined, rowHeight: ({ index }) => this.props.logItemsById[this.props.logItemsIds[index]].height || ITEM_HEIGHT, overscanCount: 1, rowRenderer: this.renderItem })));
    }
};
Log.propTypes = {
    logItemsById: prop_types_1.default.object.isRequired,
    logItemsIds: prop_types_1.default.array.isRequired,
    inspect: prop_types_1.default.func.isRequired,
    stopInspecting: prop_types_1.default.func.isRequired,
    getValueByPath: prop_types_1.default.func.isRequired,
    showMenu: prop_types_1.default.func.isRequired,
};
Log = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            actionsLoggerStore: ["log"],
        },
        injectProps: ({ actionsLoggerStore }) => ({
            logItemsById: actionsLoggerStore.logItemsById,
            logItemsIds: actionsLoggerStore.getFilteredLogItemsIds(),
            inspect(changeId, path) {
                actionsLoggerStore.inspect(changeId, path);
            },
            stopInspecting(changeId, path) {
                actionsLoggerStore.stopInspecting(changeId, path);
            },
            getValueByPath(changeId, path) {
                return path.reduce((acc, next) => acc && acc[next], actionsLoggerStore.logItemsById[changeId]);
            },
            showMenu(e, changeId, path) {
                e.preventDefault();
                actionsLoggerStore.showContextMenu("attr", e, changeId, path);
            },
        }),
    })
], Log);
exports.Log = Log;
const styles = StyleSheet.create({
    container: {
        flex: "1 1 auto",
        overflow: "hidden",
        height: "100%",
    },
});
