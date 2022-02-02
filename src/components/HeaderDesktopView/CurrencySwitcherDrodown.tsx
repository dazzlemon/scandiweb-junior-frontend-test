import React from 'react'
import { Currency } from '../../common/types'

type Props = {
	currencies: Currency[],
	changeCurrency: (currencyIndex: number) => void
}

class Dropdown extends React.Component<Props> {
	render = () => (
		<div className='dropdown'>
			{this.props.currencies.map(({ label, symbol }, index) => (
				<div className='row' onClick={() => this.props.changeCurrency(index)}>
					<div>{symbol}</div>
					<div>{label}</div>
				</div>
			))}
		</div>
	)
}

export default Dropdown