import React, { PureComponent } from 'react';
import './HeaderDesktopView.sass';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../Icons/Logo.svg';
import { ReactComponent as Cart } from '../Icons/Cart.svg';
import CurrencySwitcher from './CurrencySwitcher';

type Props = { status: 'error' | 'loading' }
           | { 
							status: 'OK',
							categories: string[],
							categoryIndex: number,
							currencies: { label: string, symbol: string }[],
							currencyIndex?: number 
						}

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
				<div className='actions'>
					<CurrencySwitcher currencies={this.props.currencies ?? [{label: 'USD', symbol: '$'}]} />
					<Cart className='cart' />
				</div>
			</div>
		);
	}
}

export default HeaderDesktopView;