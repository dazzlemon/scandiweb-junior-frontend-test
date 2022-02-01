import React                from 'react'

import withClickOutside               from '../../common/withClickOutside'
import CartDropdown                   from './CartDropdown'

const Dropdown = withClickOutside(CartDropdown)

type Props_ = {
	currency: string
	onClickOutside: (e: MouseEvent) => void
}

class Overlay extends React.Component<Props_> {
	render = () => (
		<>
			<div className='bgEffect'/>
			<Dropdown
				onClickOutside={this.props.onClickOutside}
				currency={this.props.currency}
				onRedirect={() => this.setState({ isVisible: false })}
			/>
		</>
	)
}

export default Overlay