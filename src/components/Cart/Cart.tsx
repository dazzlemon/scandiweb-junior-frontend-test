import React from 'react'

import { ReactComponent as CartIcon } from './Cart.svg'
import Overlay from './CartOverlay'


type Props = { currency: string }// TODO: probably need to have some shared storage to not redraw?
type State = { isVisible: boolean }

class Cart extends React.Component<Props, State> {
	private ref = React.createRef<SVGSVGElement>()
	constructor(props: Props) {
		super(props)
		this.state = { isVisible: false }
		this.onClickOutsideOverlay = this.onClickOutsideOverlay.bind(this)
		this.onCartIconClick = this.onCartIconClick.bind(this)
	}

	onClickOutsideOverlay(e: MouseEvent) {
		this.setState({ isVisible: false })
		// open cart and close overlay in one click
		if (this.ref.current?.contains(e.target as Node)) {
			e.stopImmediatePropagation()
		}
	}

	onCartIconClick = () => this.setState({ isVisible: !this.state.isVisible })

	render = () =>  (
		<div className='cart'>
			<CartIcon
				ref={this.ref}
				className='cartIcon'
				onClick={this.onCartIconClick}
			/>
			{this.state.isVisible && <Overlay
				currency={this.props.currency}
				onClickOutside={this.onClickOutsideOverlay}
			/>}
		</div>
	)
}

export default Cart