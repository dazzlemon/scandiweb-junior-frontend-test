import React, { PureComponent } from 'react';
import './HeaderDesktopView.sass';

type Props = { status: 'error' | 'loading' }
           | { status: 'OK', categoryNames: string[], categoryIndex: number }

class HeaderDesktopView extends PureComponent<Props> {
	render() {
		if (this.props.status !== 'OK') {
			return <div>{this.props.status}</div>;
		}
		
		// it wouldn't believe that status is 'OK' without additional check
		const categoryIndex = this.props.categoryIndex;
		return (
			<nav>
				{
					this.props.categoryNames.map((name: string, index: number) => (
						<a
							key={name}
							href={`\\${name}`}
							className={categoryIndex == index ? 'headerElementSelected' : 'headerElement'}
						>
							{name}
						</a>
					))
				}
			</nav>
		);
	}
}

export default HeaderDesktopView;