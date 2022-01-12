import React, { PureComponent } from 'react';
import './HeaderDesktopView.sass';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from './Vector.svg';

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
			<div className='header'>
				<nav className='navigation'>
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
				<Logo className='logo' />
				<div className='actions' />
			</div>
		);
	}
}

export default HeaderDesktopView;