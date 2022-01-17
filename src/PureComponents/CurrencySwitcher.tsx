import { useState } from 'react';
import { ReactComponent as ArrowDown } from '../Icons/ArrowDown.svg';

type Currency = { label: string, symbol: string }

type Props = {
	currencies: Currency[],
	currencyIndex?: number,
	onChange?: (currencyIndex: number) => void
}

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
			<div className='currency'>{props.currencies[currencyIndex].symbol}</div>
			<ArrowDown className='arrow'/>
			{showDropdown &&
				<div className='dropdown'>
					{props.currencies.map(({ label, symbol }, index) => {
						return (
							<div className='row' onClick={() =>changeCurrency(index)}>
								<div>{symbol}</div>
								<div>{label}</div>
							</div>
						);
					})}
				</div>
			}
		</div>
	);
}

export default CurrencySwitcher;