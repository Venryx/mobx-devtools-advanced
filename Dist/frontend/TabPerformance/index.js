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
const InjectStores_1 = require("../../utils/InjectStores");
const Checkbox_1 = require("./Checkbox");
let TabPerformance = class TabPerformance extends react_1.default.PureComponent {
    shownAllUpdates() {
        const { slow, medium, fast } = this.props.updatesFilterByDuration;
        return slow && medium && fast;
    }
    render() {
        const { updatesEnabled, updatesFilterByDuration } = this.props;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: aphrodite_1.css(styles.panelBody) },
                react_1.default.createElement("div", { className: aphrodite_1.css(styles.block) },
                    react_1.default.createElement("div", { className: aphrodite_1.css(styles.blockHeding) }, "Show updates"),
                    react_1.default.createElement("label", null,
                        react_1.default.createElement(Checkbox_1.Checkbox, { checked: updatesEnabled, indeterminate: updatesEnabled && !this.shownAllUpdates(), onClick: this.props.toggleShowingUpdates }),
                        "Any"),
                    react_1.default.createElement("div", { className: aphrodite_1.css(styles.filterCheckboxes) },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("label", null,
                                react_1.default.createElement(Checkbox_1.Checkbox, { checked: updatesFilterByDuration.fast, onChange: this.props.toggleFastUpdates }),
                                "Fast")),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("label", null,
                                react_1.default.createElement(Checkbox_1.Checkbox, { checked: updatesFilterByDuration.medium, onChange: this.props.toggleMediumUpdates }),
                                "Medium")),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("label", null,
                                react_1.default.createElement(Checkbox_1.Checkbox, { checked: updatesFilterByDuration.slow, onChange: this.props.toggleSlowUpdates }),
                                "Slow")))))));
    }
};
TabPerformance.propTypes = {
    updatesEnabled: prop_types_1.default.bool,
    toggleShowingUpdates: prop_types_1.default.func.isRequired,
    toggleFastUpdates: prop_types_1.default.func.isRequired,
    toggleMediumUpdates: prop_types_1.default.func.isRequired,
    toggleSlowUpdates: prop_types_1.default.func.isRequired,
    updatesFilterByDuration: prop_types_1.default.shape({
        slow: prop_types_1.default.bool,
        medium: prop_types_1.default.bool,
        fast: prop_types_1.default.bool,
    }).isRequired,
};
TabPerformance = __decorate([
    InjectStores_1.InjectStores({
        subscribe: {
            updatesHighlighterStore: ["updatesEnabled", "updatesFilterByDuration"],
        },
        injectProps: ({ updatesHighlighterStore }) => ({
            updatesEnabled: updatesHighlighterStore.updatesEnabled,
            updatesFilterByDuration: updatesHighlighterStore.updatesFilterByDuration,
            toggleShowingUpdates() {
                updatesHighlighterStore.toggleShowingUpdates();
            },
            toggleFastUpdates() {
                const { updatesFilterByDuration } = updatesHighlighterStore;
                updatesHighlighterStore.setUpdatesFilterByDuration(Object.assign({}, updatesFilterByDuration, { fast: !updatesFilterByDuration.fast }));
            },
            toggleMediumUpdates() {
                const { updatesFilterByDuration } = updatesHighlighterStore;
                updatesHighlighterStore.setUpdatesFilterByDuration(Object.assign({}, updatesFilterByDuration, { medium: !updatesFilterByDuration.medium }));
            },
            toggleSlowUpdates() {
                const { updatesFilterByDuration } = updatesHighlighterStore;
                updatesHighlighterStore.setUpdatesFilterByDuration(Object.assign({}, updatesFilterByDuration, { slow: !updatesFilterByDuration.slow }));
            },
        }),
    })
], TabPerformance);
exports.default = TabPerformance;
const styles = aphrodite_1.StyleSheet.create({
    panelBody: {
        padding: "15px 10px",
    },
    block: {
        padding: "10px",
        background: "#f7f7f7",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
        userSelect: "none",
    },
    blockHeding: {
        fontSize: 17,
        color: "var(--lighter-text-color)",
        fontWeight: 500,
        marginBottom: 5,
    },
    filterCheckboxes: {
        marginLeft: 10,
    },
});
