import React from "react";
import PropTypes from "prop-types";
import * as Aphrodite from "aphrodite";
import {PickComponentIcon} from "./icons";

const {css, StyleSheet} = Aphrodite;

ButtonPickComponent.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function ButtonPickComponent({active, onClick}) {
	return (
    <div className={css(styles.button, active && styles.active)} onClick={onClick}>
      <PickComponentIcon />
    </div>
	);
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
  active: {
    "--light-text-color": "var(--primary-color)",
  },
});