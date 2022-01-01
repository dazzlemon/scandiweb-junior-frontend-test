import React, { PureComponent } from 'react';
import _ from 'lodash';

type Props = { status: 'error' | 'loading' }
           | { status: 'OK', categoryNames: string[] }

type State = Props

class HeaderDesktopView extends PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = _.cloneDeep(props);
	}
	
	render() {
		if (this.state.status !== 'OK') {
			return <div>{this.state.status}</div>;
		}
		return (
			<nav>
				{
					this.state.categoryNames.map((name: string) => (
						<a key={name} href={`\\${name}`}>{` ${name} `}</a>
					))
				}
			</nav>
		);
	}
}

export default HeaderDesktopView;