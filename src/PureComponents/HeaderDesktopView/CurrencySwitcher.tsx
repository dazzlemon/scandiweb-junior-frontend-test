import React, { useRef, useState } from 'react';
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
	const [showDropdown, setShowDropdown_] = useState(false);
	const [currencyIndex, setCurrencyIndex] = useState(props.currencyIndex ?? 0);

	const setShowDropdown = (b: boolean) => {
		setShowDropdown_(b)
		console.log('showDropDown =', b)
	}

	const ref = useRef<HTMLButtonElement>(null)

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
			<button  ref={ref}>
				<div className='currency'>{props.currencies[currencyIndex]?.symbol ?? '$'}</div>
				<ArrowDown className='arrow'/>
			</button>
			{showDropdown &&
				<DropdownClickOutside
					currencies={props.currencies}
					changeCurrency={changeCurrency}
					onClickOutside={e => {
						setShowDropdown(false)
						// open cart and close overlay in one click
						if (ref.current?.contains(e.target as Node)) {
							e.stopImmediatePropagation();
						}
					}}
				/>
			}
		</div>
	);
}

export default CurrencySwitcher;