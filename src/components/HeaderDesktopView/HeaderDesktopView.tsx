import { PureComponent } from 'react';
import { Link }          from 'react-router-dom';

import CurrencySwitcher           from './CurrencySwitcher';
import { Cart }                   from '../Cart';
import { ReactComponent as Logo } from './Logo.svg';
import './HeaderDesktopView.sass';
import { CartProduct, getCart } from '../../util';

type Props = { 
	categories: string[],
	categoryIndex: number,
	currencies: { label: string, symbol: string }[],
	currencyIndex?: number
	onCurrencyChange?: (currencyIndex: number) => void
}

type State = {
	cart: CartProduct[]
}

class HeaderDesktopView extends PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { cart: getCart() }
		this.localStorageUpdated = this.localStorageUpdated.bind(this)
	}

	componentDidMount() {
		document.addEventListener('storage', this.localStorageUpdated)
	}
	componentWillUnmount() {
		document.removeEventListener('storage', this.localStorageUpdated)
	}

	localStorageUpdated() {
		this.setState({ cart: getCart() })
	}

	cartLengthToElement() {
		if (this.state.cart.length === 0) {
			return null
		}
		if (this.state.cart.length > 9) {
			return <div className='cartSize'>?</div>
		}
		return <div className='cartSize'>{this.state.cart.length}</div>
	}

	render = () => (
		<header className='header'>
			<div className='headerContainer'>
				<nav className='navigation'>
					{
						this.props.categories.map((name: string, index: number) => (
							<Link
								to={`/${name}`}
								className={this.props.categoryIndex === index ? 'headerElementSelected'
								                                              : 'headerElement'}
								key={name}
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
					<div className='cartContainer'>
						<Cart currency={this.props.currencies[this.props.currencyIndex ?? 0]?.symbol ?? '$'}/>
						{this.cartLengthToElement()}
					</div>
				</div>
			</div>
		</header>
	)
}

export default HeaderDesktopView;