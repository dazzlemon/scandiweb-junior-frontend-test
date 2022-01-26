import React, { useState } from 'react';
import clickOutside from '../../HOCs/clickOutside';
import { ReactComponent as ArrowDown } from './ArrowDown.svg';

type Currency = { label: string, symbol: string }

type Props = {
	currencies: Currency[],
	currencyIndex?: number,
	onChange?: (currencyIndex: number) => void
}

type Props_ = {
	currencies: Currency[],
	changeCurrency: (currencyIndex: number) => void
}

class Dropdown extends React.Component<Props_> {
	render() {
		return (
			<div className='dropdown'>
				{this.props.currencies.map(({ label, symbol }, index) => {
					return (
						<div className='row' onClick={() => this.props.changeCurrency(index)}>
							<div>{symbol}</div>
							<div>{label}</div>
						</div>
					);
				})}
			</div>
		);
	}
}

const DropdownClickOutside = clickOutside(Dropdown);

const CurrencySwitcher = (props: Props) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [currencyIndex, setCurrencyIndex] = useState(props.currencyIndex ?? 0);

	const changeCurrency = (index: number) => {
		props.onChange?.(index);
		setCurrencyIndex(index);
		setShowDropdown(false);
	}

	return (
		<div
			className='currencySwitcher'
			onClick={() => setShowDropdown(!showDropdown)}
		>
			<div className='currency'>{props.currencies[currencyIndex]?.symbol ?? '$'}</div>
			<ArrowDown className='arrow'/>
			{showDropdown &&
				<DropdownClickOutside
					currencies={props.currencies}
					changeCurrency={changeCurrency}
					onClickOutside={_ => setShowDropdown(false)}
				/>
			}
		</div>
	);
}

export default CurrencySwitcher;