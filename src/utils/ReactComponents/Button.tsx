import React, {Component} from "react";

export class Button extends Component<{text: string} & Omit<React.HTMLProps<HTMLButtonElement>, "type">, {}> {
	render() {
		const {text, ...rest} = this.props;
		return (
			<button {...rest}>
				{text}
			</button>
		);
	}
}