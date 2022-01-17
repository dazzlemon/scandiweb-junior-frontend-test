import React, { PureComponent } from 'react';
import './HeaderDesktopView.sass';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../Icons/Logo.svg';
import { ReactComponent as Cart } from '../Icons/Cart.svg';
import CurrencySwitcher from './CurrencySwitcher';

type Props = { 
	categories: string[],
	categoryIndex: number,
	currencies: { label: string, symbol: string }[],
	currencyIndex?: number
	onCurrencyChange?: (currencyIndex: number) => void
}

class HeaderDesktopView extends PureComponent<Props> {
	render() {
		return (
			<div className='header'>
				<nav className='navigation'>
					{
						this.props.categories.map((name: string, index: number) => (
							<Link
								to={`/${name}`}
								className={this.props.categoryIndex == index ? 'headerElementSelected' : 'headerElement'}
							>
								{name}
							</Link>
						))
					}
				</nav>
				<Logo className='logo' />
				<div className='actions'>
					<CurrencySwitcher currencies={this.props.currencies} onChange={this.props.onCurrencyChange}/>
					<Cart className='cart' />
				</div>
			</div>
		);
	}
}

export default HeaderDesktopView;