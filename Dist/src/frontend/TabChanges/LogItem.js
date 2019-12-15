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
const LObjDiff_1 = require("./LObjDiff");
const LObjDiffPreview_1 = require("./LObjDiffPreview");
const icons_1 = require("./icons");
const InjectStores_1 = require("../../utils/InjectStores");
const Popover_1 = __importDefault(require("../Popover"));
const ChangeDataViewerPopover_1 = require("./ChangeDataViewerPopover");
const { css, StyleSheet } = Aphrodite;
const getColor = type => {
    switch (type) {
        case "action":
            return "#0486e2";
        case "reaction":
            return "#1fcc5c";
        default:
            return "var(--lighter-text-color)";
    }
};
let LogItem = LogItem_1 = class LogItem extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.toggleOpen = () => {
            const { change } = this.props;
            const open = !this.state.open;
            change.open = open;
            if (open && change.summary) {
                if (this.props.getDetails)
                    this.props.getDetails();
            }
            this.setState({ open });
        };
        this.recomputeHeight = () => setTimeout(() => {
            // timeout for css applying
            if (this.props.onHeightUpdate && this.el) {
                const height = this.el.offsetHeight;
                if (this.props.change.height !== height) {
                    this.props.change.height = this.el.offsetHeight;
                    this.props.onHeightUpdate();
                }
            }
        }, 0);
        this.state = {
            open: Boolean(this.props.change.open),
        };
    }
    componentDidMount() {
        this.recomputeHeight();
    }
    componentDidUpdate() {
        this.recomputeHeight();
    }
    renderChange() {
        const { change } = this.props;
        switch (change.type) {
            case "action":
            case "transaction":
            case "reaction":
                return (react_1.default.createElement("div", { className: css(styles.headContent) },
                    react_1.default.createElement("span", { className: css(styles.headContentTitle) }, change.name
                        ? change.name
                        : change.type.toUpperCase().slice(0, 1) + change.type.slice(1)),
                    " ",
                    change.object && (react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(["object"]), displayName: change.objectName, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu, className: css(styles.headContentMisc) }))));
            case "add":
            case "delete":
            case "update":
            case "splice":
                return (react_1.default.createElement("div", { className: css(styles.headContent) },
                    react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(["object"]), displayName: change.objectName, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu, className: css(styles.headContentMisc) }),
                    react_1.default.createElement(Popover_1.default, { className: css(styles.headContentMisc), requireClick: true, 
                        // eslint-disable-next-line react/jsx-no-bind
                        onShown: () => this.props.getDetails && this.props.getDetails(change.id), content: (react_1.default.createElement(LObjDiff_1.LObjDiff, { change: change, path: this.props.path, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu })) },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(LObjDiffPreview_1.LObjDiffPreview, { change: change })))));
            case "compute":
                return (react_1.default.createElement("div", { className: css(styles.headContent, styles.headContentWithIcon) },
                    react_1.default.createElement(icons_1.IconComputed, { className: css(styles.headContentIcon) }),
                    react_1.default.createElement("span", { className: css(styles.headContentTitle) },
                        "Computed",
                        change.targetName),
                    change.object && (react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(["object"]), displayName: change.objectName, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu })),
                    react_1.default.createElement("span", { className: css(styles.headContentMisc) }, "fn:"),
                    react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(["fn"]), getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu, className: css(styles.headContentMisc) })));
            case "error":
                return (react_1.default.createElement("div", { className: css(styles.headContent, styles.headContentWithIcon) },
                    react_1.default.createElement(icons_1.IconError, { className: css(styles.headContentIcon) }),
                    react_1.default.createElement("span", { className: css(styles.headContentTitle) }, change.message)));
            case "scheduled-reaction":
                return (react_1.default.createElement("div", { className: css(styles.headContent, styles.headContentWithIcon) },
                    react_1.default.createElement(icons_1.IconScheduledReaction, { className: css(styles.headContentIcon) }),
                    react_1.default.createElement("span", { className: css(styles.headContentTitle) }, "Scheduled async reaction"),
                    react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(["object"]), displayName: change.objectName, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu, className: css(styles.headContentMisc) })));
            case "create":
                return (react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: css(styles.headContentTitle) }, "Create"),
                    react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(["object"]), displayName: change.objectName, getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu, className: css(styles.headContentMisc) }),
                    ":",
                    react_1.default.createElement(ChangeDataViewerPopover_1.ChangeDataViewerPopover, { path: this.props.path.concat(["newValue"]), getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu, className: css(styles.headContentMisc) })));
            default:
                return react_1.default.createElement("div", { className: css(styles.headContent) }, change.type);
        }
    }
    render() {
        const { change } = this.props;
        const { open } = this.state;
        const openable = this.props.change.hasChildren || (this.props.change.children || []).length > 0;
        return (react_1.default.createElement("div", { ref: el => {
                this.el = el;
            }, className: css(styles.container, open && styles.containerOpen), style: { borderColor: getColor(change.type) } },
            react_1.default.createElement("div", { className: css(styles.head, openable && styles.headCollapsible), style: { lineHeight: `${this.props.preferredHeight}px` }, onClick: openable ? this.toggleOpen : undefined },
                openable && (react_1.default.createElement("div", { className: css(styles.opener) },
                    react_1.default.createElement("span", { className: css(open ? styles.expandedArrow : styles.collapsedArrow) }))),
                this.renderChange()),
            open && (react_1.default.createElement("div", { className: css(styles.body) }, change.children
                && change.children.map((c, i) => (react_1.default.createElement(LogItem_1, { getValueByPath: this.props.getValueByPath, inspect: this.props.inspect, stopInspecting: this.props.stopInspecting, showMenu: this.props.showMenu, key: c.id, change: c, onHeightUpdate: this.recomputeHeight, path: this.props.path.concat(["children", i]) })))))));
    }
};
LogItem.propTypes = {
    getDetails: prop_types_1.default.func,
    path: prop_types_1.default.array.isRequired,
    getValueByPath: prop_types_1.default.func,
    inspect: prop_types_1.default.func,
    stopInspecting: prop_types_1.default.func,
    showMenu: prop_types_1.default.func,
    preferredHeight: prop_types_1.default.number,
    onHeightUpdate: prop_types_1.default.func,
    change: prop_types_1.default.object.isRequired,
};
LogItem.defaultProps = {
    path: [],
};
LogItem = LogItem_1 = __decorate([
    InjectStores_1.InjectStores({
        subscribe: (stores, { change }) => ({
            actionsLoggerStore: [change.id],
        }),
        injectProps: ({ actionsLoggerStore }, { change }) => ({
            getDetails() {
                actionsLoggerStore.getDetails(change.id);
            },
        }),
    })
], LogItem);
exports.LogItem = LogItem;
const styles = StyleSheet.create({
    container: {
        position: "relative",
        paddingLeft: 13,
        marginBottom: 7,
    },
    containerOpen: {
        height: "auto",
        ":before": {
            content: '""',
            position: "absolute",
            width: 3,
            top: 2,
            left: 0,
            bottom: 2,
            borderWidth: "1px 0 1px 1px",
            borderColor: "inherit",
            borderStyle: "solid",
        },
    },
    head: {
        display: "flex",
        position: "relative",
        borderColor: "inherit",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    headCollapsible: {
        cursor: "pointer",
    },
    headContent: {
        display: "flex",
        flexWrap: "wrap",
    },
    headContentWithIcon: {
        paddingLeft: 19,
    },
    headContentTitle: {
        marginRight: 4,
    },
    headContentIcon: {
        marginRight: 4,
        flex: "0 0 auto",
        alignSelf: "center",
        marginLeft: -19,
    },
    headContentMisc: {
        marginRight: 4,
    },
    opener: {
        cursor: "pointer",
        marginLeft: -10,
        paddingRight: 3,
        position: "absolute",
        top: 0,
        borderColor: "inherit",
    },
    body: {
        overflow: "hidden",
    },
    collapsedArrow: {
        borderColor: "transparent",
        borderLeftColor: "inherit",
        borderStyle: "solid",
        borderWidth: "4px 0 4px 7px",
        display: "inline-block",
        marginLeft: 1,
        verticalAlign: 0,
    },
    expandedArrow: {
        borderColor: "transparent",
        borderTopColor: "inherit",
        borderStyle: "solid",
        borderWidth: "7px 4px 0 4px",
        display: "inline-block",
        marginTop: 1,
        verticalAlign: 0,
    },
});
var LogItem_1;
