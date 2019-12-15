import React, {HTMLProps} from "react";
import * as Aphrodite from "aphrodite";
import {ClearIcon} from "./icons";

const {css, StyleSheet} = Aphrodite;

export default class ButtonClear extends React.PureComponent<Partial<HTMLProps<HTMLDivElement>>> {
	render() {
		return (
			<div className={css(styles.button)} {...this.props}>
				<ClearIcon />
			</div>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		flex: "0 0 auto",
		display: "inline-flex",
		width: 33,
		height: 33,
		alignItems: "center",
		justifyContent: "center",
	},
});