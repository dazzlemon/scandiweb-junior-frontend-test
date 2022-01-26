import { PureComponent } from 'react';
import { Link }          from 'react-router-dom';

import CurrencySwitcher           from './CurrencySwitcher';
import { Cart }                   from '../Cart';
import { ReactComponent as Logo } from './Logo.svg';
import './HeaderDesktopView.sass';

type Props = { 
	categories: string[],
	categoryIndex: number,
	currencies: { label: string, symbol: string }[],
	currencyIndex?: number
	onCurrencyChange?: (currencyIndex: number) => void
}

class HeaderDesktopView extends PureComponent<Props> {
	render = () => (
		<header className='header'>
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
					<Cart currency={this.props.currencies[this.props.currencyIndex ?? 0]?.symbol ?? '$'}/>
				</div>
			</div>
		</header>
	)
}

export default HeaderDesktopView;