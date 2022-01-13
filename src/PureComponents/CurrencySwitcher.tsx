import { useState } from 'react';
import { ReactComponent as ArrowDown } from '../Icons/ArrowDown.svg';

type Props = {
	currencies: { label: string, symbol: string }[],
	currencyIndex?: number
}

const CurrencySwitcher = (props: Props) => {
	const [showDropdown, setShowDropdown] = useState(false)


	return (
		<div
			className='currencySwitcher'
			onClick={() => setShowDropdown(!showDropdown)}
		>
			<div className='currency'>$</div>
			<ArrowDown className='arrow'/>
			{showDropdown &&
				<div className='dropdown'>
					{ props.currencies.map(({ label, symbol }) => {
						return (
							<div className='row'>
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