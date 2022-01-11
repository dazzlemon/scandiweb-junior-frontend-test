import React, { PureComponent } from 'react';
import './HeaderDesktopView.sass';
import { Link } from 'react-router-dom';

type Props = { status: 'error' | 'loading' }
           | { status: 'OK', categories: string[], categoryIndex: number }

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
					this.props.categories.map((name: string, index: number) => (
						<Link
							to={`/${name}`}
							className={categoryIndex == index ? 'headerElementSelected' : 'headerElement'}
						>
							{name}
						</Link>
					))
				}
			</nav>
		);
	}
}

export default HeaderDesktopView;