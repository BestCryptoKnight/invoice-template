import * as React from "react";

export class Layout extends React.Component<any, any> {
	constructor(props: any) {
        super(props);
        this.state = {
        };
    }
	render() {
		return (
			<div className="">
				{this.props.children}
			</div>
		);
	}
}

export default Layout;
