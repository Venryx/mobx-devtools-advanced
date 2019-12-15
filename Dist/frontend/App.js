"use strict";
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
const Aphrodite = __importStar(require("aphrodite"));
require("hack-font/build/web/hack.css");
const Bridge_1 = __importDefault(require("../Bridge"));
const stores_1 = __importDefault(require("./stores"));
const Blocker_1 = __importDefault(require("./Blocker"));
const ContextProvider_1 = __importDefault(require("../utils/ContextProvider"));
const theme_1 = __importDefault(require("./theme"));
const { css, StyleSheet } = Aphrodite;
class App extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            loaded: false,
            connected: false,
            mobxFound: false,
        };
        this.$unMounted = false;
        this.$disposables = [];
        this.handleContextMenu = e => e.preventDefault();
    }
    UNSAFE_componentWillMount() {
        if (this.props.reloadSubscribe) {
            this.$unsubscribeReload = this.props.reloadSubscribe(() => this.reload());
        }
        this.props.inject((wall, teardownWall) => {
            this.$teardownWall = teardownWall;
            const bridge = new Bridge_1.default(wall);
            window["bridge_"] = bridge; // custom
            this.$disposables.push(bridge.sub("capabilities", ({ mobxFound }) => {
                this.setState({ mobxFound });
            }), bridge.sub("content-script-installation-error", () => {
                this.setState({ contentScriptInstallationError: true });
            }));
            bridge.send("backend:ping");
            const connectInterval = setInterval(() => bridge.send("backend:ping"), 500);
            bridge.once("frontend:pong", () => {
                clearInterval(connectInterval);
                this.stores = stores_1.default(bridge);
                if (__DEV__) {
                    window["$$frontendStores$$"] = this.stores;
                }
                this.setState({ connected: true });
                bridge.send("get-capabilities");
            });
            if (!this.$unMounted) {
                this.setState({ loaded: true });
            }
        });
    }
    componentWillUnmount() {
        this.$unMounted = true;
        this.reload();
    }
    reload() {
        if (!this.$unMounted)
            this.setState({ loaded: false, store: undefined }, this.props.reload);
        this.teardown();
    }
    teardown() {
        if (this.$unsubscribeReload) {
            this.$unsubscribeReload();
            this.$unsubscribeReload = undefined;
        }
        if (this.$teardownWall) {
            this.$teardownWall();
            this.$teardownWall = undefined;
        }
    }
    renderContent() {
        if (this.state.contentScriptInstallationError) {
            return react_1.default.createElement(Blocker_1.default, null, "Error while installing content-script");
        }
        if (!this.state.loaded) {
            return !this.props.quiet && react_1.default.createElement(Blocker_1.default, null, "Loading...");
        }
        if (!this.state.connected) {
            return !this.props.quiet && react_1.default.createElement(Blocker_1.default, null, "Connecting...");
        }
        if (this.state.mobxFound !== true) {
            return !this.props.quiet && react_1.default.createElement(Blocker_1.default, null, "Looking for mobx...");
        }
        return (react_1.default.createElement(ContextProvider_1.default, { stores: this.stores }, react_1.default.Children.only(this.props.children)));
    }
    render() {
        return (react_1.default.createElement("div", { className: css(styles.app, theme_1.default.default), onContextMenu: this.handleContextMenu }, this.renderContent()));
    }
}
App.defaultProps = {
    quiet: false,
};
exports.default = App;
const styles = StyleSheet.create({
    app: {
        width: "100%",
        height: "100%",
        fontSize: 13,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fontWeight: 400,
    },
});
