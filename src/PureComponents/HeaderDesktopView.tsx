import React, { PureComponent } from 'react';
import './HeaderDesktopView.sass';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../Icons/Logo.svg';
import CurrencySwitcher from './CurrencySwitcher';
import Cart from './Cart';

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
			<header className='header'>
				{/* headerContainer is needed for correct work of CartOverlay */}
				<div className='headerContainer'>
					<nav className='navigation'>
						{
							this.props.categories.map((name: string, index: number) => (
								<Link
									to={`/${name}`}
									className={this.props.categoryIndex == index ? 'headerElementSelected'
									                                             : 'headerElement'}
								>
									{name}
								</Link>
							))
						}
					</nav>
					<Logo className='logo' />
					<div className='actions'>
						<CurrencySwitcher
							currencies={this.props.currencies}
							onChange={this.props.onCurrencyChange}
							currencyIndex={this.props.currencyIndex}
						/>
						<Cart />
					</div>
				</div>
			</header>
		);
	}
}

export default HeaderDesktopView;