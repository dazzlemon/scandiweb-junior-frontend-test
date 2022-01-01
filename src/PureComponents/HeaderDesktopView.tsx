import React, { PureComponent } from 'react';

type Props = { status: 'error' | 'loading' }
           | { status: 'OK', categoryNames: string[] }

class HeaderDesktopView extends PureComponent<Props> {
	render() {
		if (this.props.status !== 'OK') {
			return <div>{this.props.status}</div>;
		}
		return (
			<nav>
				{
					this.props.categoryNames.map((name: string) => (
						<a key={name} href={`\\${name}`}>{` ${name} `}</a>
					))
				}
			</nav>
		);
	}
}

export default HeaderDesktopView;