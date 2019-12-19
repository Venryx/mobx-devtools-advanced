import React from "react";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";
import {LObjDiff} from "./LObjDiff";
import {LObjDiffPreview} from "./LObjDiffPreview";
import {IconComputed, IconScheduledReaction, IconError} from "./icons";
import {InjectStores} from "../../utils/InjectStores";
import {PopoverTrigger} from "../Popover";
import {ChangeDataViewerPopover} from "./ChangeDataViewerPopover";
import {Change} from "../../utils/changesProcessor";
import {ActionsStore} from "../stores/ActionsStore";

const {css, StyleSheet} = Aphrodite;

const getColor = type=>{
	switch (type) {
		case "action":
			return "#0486e2";
		case "reaction":
			return "#1fcc5c";
		default:
			return "var(--lighter-text-color)";
	}
};

@InjectStores({
	subscribe: (stores, {change})=>({
		actionsLoggerStore: [change.id],
	}),
	injectProps: ({actionsLoggerStore}, {change})=>({
		getDetails() {
			actionsLoggerStore.getDetails(change.id);
		},
	}),
})
export class LogItem extends React.Component<
	{
		rootChange: Change, change: Change, path: any[], getValueByPath: (path: string[])=>any, inspect: (path: string[])=>void, stopInspecting: (path: string[])=>void,
		showMenu: (event, changeId: number, path: string[])=>void, preferredHeight?: number, onHeightUpdate: ()=>void
	} & Partial<{getDetails: ()=>void}>,
	{open: boolean}
> {
	static defaultProps = {
		path: [],
	};

	constructor(props) {
		super(props);
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

	toggleOpen = ()=>{
		const {change} = this.props;
		const open = !this.state.open;
		change.open = open;
		if (open && change.summary) {
			if (this.props.getDetails) this.props.getDetails();
		}
		this.setState({open});
	};

	el;
	recomputeHeight = ()=>setTimeout(()=>{
		// timeout for css applying
		if (this.props.onHeightUpdate && this.el) {
			const height = this.el.offsetHeight;
			if (this.props.change.height !== height) {
				this.props.change.height = this.el.offsetHeight;
				this.props.onHeightUpdate();
			}
		}
	}, 0);

	renderChange() {
		const {rootChange, change, path} = this.props;

		//const change_full = ActionsStore.main.logItemsById[change.id];
		const changeViewer = (
			<ChangeDataViewerPopover previewText="(details)" path={[]} getValueByPath={subpath=>subpath.reduce((acc, next)=>acc && acc[next], change)}
				inspect={subpath=>ActionsStore.main.inspect(rootChange.id, path.concat(subpath))} stopInspecting={subpath=>ActionsStore.main.stopInspecting(rootChange.id, path.concat(subpath))}/>
				//inspect={subpath=>ActionsStore.main.inspect(change.id, subpath)} stopInspecting={subpath=>ActionsStore.main.stopInspecting(change.id, subpath)}/>
		);

		switch (change.type) {
			case "action":
			case "transaction":
			case "reaction":
				return (
					<div className={css(styles.headContent)}>
						<span className={css(styles.headContentTitle)}>
							{change.name
								? change.name
								: change.type.toUpperCase().slice(0, 1) + change.type.slice(1)}
						</span>
						{" "}
						{change.object && (
							<ChangeDataViewerPopover
								path={this.props.path.concat(["object"])}
								displayName={change.objectName}
								getValueByPath={this.props.getValueByPath}
								inspect={this.props.inspect}
								stopInspecting={this.props.stopInspecting}
								showMenu={this.props.showMenu}
								className={css(styles.headContentMisc)}
							/>
						)}
						{changeViewer}
					</div>
				);

			case "add":
			case "delete":
			case "update":
			case "splice":
				return (
					<div className={css(styles.headContent)}>
						<ChangeDataViewerPopover
							path={this.props.path.concat(["object"])}
							displayName={change.objectName}
							getValueByPath={this.props.getValueByPath}
							inspect={this.props.inspect}
							stopInspecting={this.props.stopInspecting}
							showMenu={this.props.showMenu}
							className={css(styles.headContentMisc)}
						/>
						<PopoverTrigger
							className={css(styles.headContentMisc)}
							requireClick
							// eslint-disable-next-line react/jsx-no-bind
							//onShown={()=>this.props.getDetails && this.props.getDetails(change.id)}
							onShown={()=>this.props.getDetails && this.props.getDetails()}
							content={(
								<LObjDiff
									change={change}
									path={this.props.path}
									getValueByPath={this.props.getValueByPath}
									inspect={this.props.inspect}
									stopInspecting={this.props.stopInspecting}
									showMenu={this.props.showMenu}
								/>
							)}
						>
							<div>
								<LObjDiffPreview change={change} />
							</div>
						</PopoverTrigger>
						{changeViewer}
					</div>
				);
			case "compute":
				return (
					<div className={css(styles.headContent, styles.headContentWithIcon)}>
						<IconComputed className={css(styles.headContentIcon)} />
						<span className={css(styles.headContentTitle)}>
							Computed
							{change.targetName}
						</span>
						{change.object && (
							<ChangeDataViewerPopover
								path={this.props.path.concat(["object"])}
								displayName={change.objectName}
								getValueByPath={this.props.getValueByPath}
								inspect={this.props.inspect}
								stopInspecting={this.props.stopInspecting}
								showMenu={this.props.showMenu}
							/>
						)}
						<span className={css(styles.headContentMisc)}>fn:</span>
						{/*<ChangeDataViewerPopover
							path={this.props.path.concat(["fn"])}
							getValueByPath={this.props.getValueByPath}
							inspect={this.props.inspect}
							stopInspecting={this.props.stopInspecting}
							showMenu={this.props.showMenu}
							className={css(styles.headContentMisc)}
						/>*/}
						<span>{change.name}</span>
						{changeViewer}
					</div>
				);

			case "error":
				return (
					<div className={css(styles.headContent, styles.headContentWithIcon)}>
						<IconError className={css(styles.headContentIcon)} />
						<span className={css(styles.headContentTitle)}>{change.message}</span>
						{changeViewer}
					</div>
				);

			case "scheduled-reaction":
				return (
					<div className={css(styles.headContent, styles.headContentWithIcon)}>
						<IconScheduledReaction className={css(styles.headContentIcon)} />
						<span className={css(styles.headContentTitle)}>Scheduled async reaction</span>
						<ChangeDataViewerPopover
							path={this.props.path.concat(["object"])}
							displayName={change.objectName}
							getValueByPath={this.props.getValueByPath}
							inspect={this.props.inspect}
							stopInspecting={this.props.stopInspecting}
							showMenu={this.props.showMenu}
							className={css(styles.headContentMisc)}
						/>
						{changeViewer}
					</div>
				);

			case "create":
				return (
					<div>
						<span className={css(styles.headContentTitle)}>Create</span>
						<ChangeDataViewerPopover
							path={this.props.path.concat(["object"])}
							displayName={change.objectName}
							getValueByPath={this.props.getValueByPath}
							inspect={this.props.inspect}
							stopInspecting={this.props.stopInspecting}
							showMenu={this.props.showMenu}
							className={css(styles.headContentMisc)}
						/>
						:
						<ChangeDataViewerPopover
							path={this.props.path.concat(["newValue"])}
							getValueByPath={this.props.getValueByPath}
							inspect={this.props.inspect}
							stopInspecting={this.props.stopInspecting}
							showMenu={this.props.showMenu}
							className={css(styles.headContentMisc)}
						/>
						{changeViewer}
					</div>
				);

			default:
				return <div>
					<div className={css(styles.headContent)}>{change.type}</div>
					{changeViewer}
				</div>;
		}
	}

	render() {
		const {change} = this.props;
		const {open} = this.state;
		const openable = this.props.change.hasChildren || (this.props.change.children || []).length > 0;
		return (
			<div ref={el=>this.el = el} className={css(styles.container, open && styles.containerOpen)} style={{borderColor: getColor(change.type)}}>
				<div className={css(styles.head, openable && styles.headCollapsible)}
					style={{lineHeight: `${this.props.preferredHeight}px`}}
					onClick={openable ? this.toggleOpen : undefined}
				>
					{openable && (
						<div className={css(styles.opener)}>
							<span className={css(open ? styles.expandedArrow : styles.collapsedArrow)} />
						</div>
					)}
					{this.renderChange()}
				</div>
				{open && (
					<div className={css(styles.body)}>
						{change.children
							&& change.children.map((c, i)=>(
								<LogItem
									getValueByPath={this.props.getValueByPath}
									inspect={this.props.inspect}
									stopInspecting={this.props.stopInspecting}
									showMenu={this.props.showMenu}
									key={c.id}
									rootChange={change}
									change={c}
									onHeightUpdate={this.recomputeHeight}
									path={this.props.path.concat(["children", i])}
								/>
							))}
					</div>
				)}
			</div>
		);
	}
}

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