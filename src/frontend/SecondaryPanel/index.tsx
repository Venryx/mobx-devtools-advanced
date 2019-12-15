import React from "react";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";

const {css, StyleSheet} = Aphrodite;

SecondaryPanel.propTypes = {
  children: PropTypes.node,
};

export default function SecondaryPanel({children}) {
	return <div className={css(styles.panel)}>{children}</div>;
}

const styles = StyleSheet.create({
  panel: {
    display: "flex",
    flex: "0 0 auto",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    alignItems: "center",
  },
});