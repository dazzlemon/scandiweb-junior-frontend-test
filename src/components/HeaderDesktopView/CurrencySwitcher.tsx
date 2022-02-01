import React from 'react';
import withClickOutside from '../../common/withClickOutside';
import { ReactComponent as ArrowDown } from './ArrowDown.svg';
import { ReactComponent as ArrowUp } from './ArrowUp.svg';
import Dropdown from './CurrencySwitcherDrodown'

type Currency = { label: string, symbol: string }

type Props = {
	currencies: Currency[],
	currencyIndex?: number,
	onChange?: (currencyIndex: number) => void
}

type State = {
	currencyIndex: number
	showDropdown: boolean
}

const DropdownClickOutside = withClickOutside(Dropdown);

class CurrencySwitcher extends React.Component<Props, State> {
	private ref = React.createRef<HTMLButtonElement>()
	
	constructor(props: Props) {
		super(props)
		this.state = {
			showDropdown: false,
			currencyIndex: props.currencyIndex ?? 0
		}
		this.onClickOutsideDropdown = this.onClickOutsideDropdown.bind(this)
		this.toggle = this.toggle.bind(this)
	}

	changeCurrency(index: number) {
		this.props.onChange?.(index)
		this.setState({
			currencyIndex: index,
			showDropdown: false
		})
	}

	toggle = () => this.setState({ showDropdown: !this.state.showDropdown })

	onClickOutsideDropdown(e: MouseEvent) {
		this.setState({ showDropdown: false })
		// open cart and close overlay in one click
		if (this.ref.current?.contains(e.target as Node)) {
			e.stopImmediatePropagation();
		}
	}

	render = () => (
		<div className='currencySwitcher'>
			<button
				ref={this.ref}
				onClick={this.toggle}
			>
				<div className='currency'>{this.props.currencies[this.state.currencyIndex]?.symbol ?? '$'}</div>
				{this.state.showDropdown ? <ArrowUp className='arrow'/> : <ArrowDown className='arrow'/>}
			</button>
			{this.state.showDropdown &&
				<DropdownClickOutside
					currencies={this.props.currencies}
					changeCurrency={this.changeCurrency}
					onClickOutside={this.onClickOutsideDropdown}
				/>
			}
		</div>
	)
}

export default CurrencySwitcher;