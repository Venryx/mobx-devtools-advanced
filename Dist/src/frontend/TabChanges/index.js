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
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const Aphrodite = __importStar(require("aphrodite"));
const SecondaryPanel_1 = __importDefault(require("../SecondaryPanel"));
const ButtonRecord_1 = __importDefault(require("../SecondaryPanel/ButtonRecord"));
const ButtonClear_1 = __importDefault(require("../SecondaryPanel/ButtonClear"));
const Log_1 = require("./Log");
const InjectStores_1 = require("../../utils/InjectStores");
const InputSearch_1 = __importDefault(require("../SecondaryPanel/InputSearch"));
const { css, StyleSheet } = Aphrodite;
let TabChanges = class TabChanges extends react_1.default.PureComponent {
    render() {
        return (react_1.default.createElement("div", { className: css(styles.panel) },
            react_1.default.createElement(SecondaryPanel_1.default, null,
                react_1.default.createElement(ButtonRecord_1.default, { active: this.props.logEnabled, onClick: this.props.toggleLogging, showTipStartRecoding: !this.props.logEnabled && this.props.logItemsIds.length === 0 }),
                react_1.default.createElement(ButtonClear_1.default, { onClick: this.props.clearLog }),
                react_1.default.createElement(InputSearch_1.default, { searchText: this.props.searchText, changeSearch: this.props.setSearchText })),
            react_1.default.createElement(Log_1.Log, null)));
    }
};
TabChanges.propTypes = {
    searchText: prop_types_1.default.string.isRequired,
    logEnabled: prop_types_1.default.bool.isRequired,
    logItemsIds: prop_types_1.default.array.isRequired,
    clearLog: prop_types_1.default.func.isRequired,
    toggleLogging: prop_types_1.default.func.isRequired,
    setSearchText: prop_types_1.default.func.isRequired,
};
TabChanges = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            actionsLoggerStore: ["logEnabled", "log"],
        },
        injectProps: ({ actionsLoggerStore }) => ({
            searchText: actionsLoggerStore.searchText,
            logEnabled: actionsLoggerStore.logEnabled,
            logItemsIds: actionsLoggerStore.logItemsIds,
            clearLog() {
                actionsLoggerStore.clearLog();
            },
            toggleLogging() {
                actionsLoggerStore.toggleLogging();
            },
            setSearchText(e) {
                actionsLoggerStore.setSearchText(e.target.value);
            },
        }),
    })
], TabChanges);
exports.TabChanges = TabChanges;
const styles = StyleSheet.create({
    panel: {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
    },
    panelBody: {
        display: "flex",
        flex: "1 1 auto",
    },
    leftPane: {
        width: "100%",
        flex: "1 1 auto",
    },
    rightPane: {
        width: "100%",
        flex: "1 1 auto",
        padding: 10,
    },
});
