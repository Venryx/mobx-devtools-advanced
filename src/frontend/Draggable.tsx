import React from "react";
import PropTypes from "prop-types";

export default class Draggable extends React.Component<Partial<{onStart, onStop, onMove, className, style}>> {
	static propTypes = {
		onStart: PropTypes.func.isRequired,
		onStop: PropTypes.func.isRequired,
		onMove: PropTypes.func.isRequired,
		className: PropTypes.string,
		style: PropTypes.object,
		children: PropTypes.node,
	};

	onMove = evt=>{
		evt.preventDefault();
		this.props.onMove(evt.pageX, evt.pageY);
	};

	onUp = evt=>{
		evt.preventDefault();
		const doc = this.el.ownerDocument;
		doc.removeEventListener("mousemove", this.onMove);
		doc.removeEventListener("mouseup", this.onUp);
		this.props.onStop();
	};

	startDragging = evt=>{
		evt.preventDefault();
		const doc = this.el.ownerDocument;
		doc.addEventListener("mousemove", this.onMove);
		doc.addEventListener("mouseup", this.onUp);
		this.props.onStart();
	};

	el;
	render() {
		return (
			<div
				ref={el=>{ this.el = el; }}
				style={this.props.style}
				className={this.props.className}
				onMouseDown={this.startDragging}
			>
				{this.props.children}
			</div>
		);
	}
}