import React from "react";
import * as Aphrodite from "aphrodite";
import "hack-font/build/web/hack.css";
import {CheckBox} from "react-vcomponents";
import {Bridge} from "../Bridge";
import createStores from "./stores";
import Blocker from "./Blocker";
import ContextProvider from "../utils/ContextProvider";
import theme from "./theme";

const {css, StyleSheet} = Aphrodite;

declare global {
	// we also have to declare built-in globals that we use (otherwise ts complains, eg. in _testHelpers.ts)
	/*const window: any;
	const document: any;
	const navigator: any;*/

	//let bridge_: Bridge;
	let $$frontendStores$$;
}

type State = {
	loaded: boolean, store: any, connected: boolean, mobxFound: boolean, contentScriptInstallationError: any,
};
export class App extends React.PureComponent<
	{
		quiet: boolean,
		reloadSubscribe: (func: Function)=>any,
		inject: (func: Function)=>any,
		reload: ()=>any,
		children: any,
	},
	State
> {
	static defaultProps = {
		quiet: false,
	};
	state = {
		loaded: false,
		connected: false,
		mobxFound: false,
	} as State;

	$unsubscribeReload;
	$teardownWall;
	stores;
	UNSAFE_componentWillMount() {
		if (this.props.reloadSubscribe) {
			this.$unsubscribeReload = this.props.reloadSubscribe(()=>this.reload());
		}
		this.props.inject((wall, teardownWall)=>{
			this.$teardownWall = teardownWall;
			const bridge = new Bridge(wall);
			//window["bridge_"] = bridge; // custom

			this.$disposables.push(
				bridge.sub("capabilities", ({mobxFound})=>{
					this.setState({mobxFound});
				}),
				bridge.sub("content-script-installation-error", ()=>{
					this.setState({contentScriptInstallationError: true});
				}),
			);

			bridge.send("backend:ping");
			const connectInterval = setInterval(()=>bridge.send("backend:ping"), 500);
			bridge.once("frontend:pong", ()=>{
				clearInterval(connectInterval);

				this.stores = createStores(bridge);
				if (__DEV__) {
					window["$$frontendStores$$"] = this.stores;
				}

				this.setState({connected: true});
				bridge.send("get-capabilities");
			});

			if (!this.$unMounted) {
				this.setState({loaded: true});
			}
		});
	}

	componentWillUnmount() {
		this.$unMounted = true;
		this.reload();
	}

	$unMounted = false;

	$disposables = [];

	reload() {
		if (!this.$unMounted) this.setState({loaded: false, store: undefined}, this.props.reload);
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

	handleContextMenu = e=>e.preventDefault();

	renderContent() {
		if (this.state.contentScriptInstallationError) {
			return <Blocker>Error while installing content-script</Blocker>;
		}
		if (!this.state.loaded) {
			return !this.props.quiet && <Blocker>Loading...</Blocker>;
		}
		if (!this.state.connected) {
			return !this.props.quiet && <Blocker>Connecting...</Blocker>;
		}
		if (this.state.mobxFound !== true) {
			return !this.props.quiet && <Blocker>Looking for mobx...</Blocker>;
		}
		return (
			<ContextProvider stores={this.stores}>
				{React.Children.only(this.props.children)}
			</ContextProvider>
		);
	}

	render() {
		return (
			<div className={css(styles.app, theme.default)} onContextMenu={this.handleContextMenu}>
				<style>{`
				*, *:before, *:after {
					box-sizing: inherit;
				}
				`}</style>
				{this.renderContent()}
			</div>
		);
	}
}

const styles = StyleSheet.create({
	app: {
		width: "100%",
		height: "100%",
		fontSize: 13,
		fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
		fontWeight: 400,
		boxSizing: "border-box",
	},
});

// some modifications of react-vcomponents
// ==========

CheckBox.defaultProps["labelStyle"] = {marginLeft: 0};