import React, { ReactNode } from 'react'

import { ReactComponent as CartIcon } from './Cart.svg'
import Overlay from './CartOverlay'

type Props_ = { buttonChildren: ReactNode }
type State_ = { isVisible: boolean }
class Dropdown extends React.Component<Props_, State_> {
	private ref = React.createRef<HTMLButtonElement>()

	constructor(props: Props_) {
		super(props)
		this.toggle = this.toggle.bind(this)
	}

	toggle = () => this.setState({ isVisible: !this.state.isVisible })

	render = () => (
		<>
			<button
				ref={this.ref}
				onClick={this.toggle}
				children={this.props.buttonChildren}
			/>
			{this.state.isVisible &&// somehow add onOutsideClickContainer 
				<>
					{this.props.children}
				</>
			}
		</>
	)
}

type Props = { currency: string }// TODO: probably need to have some shared storage to not redraw?
type State = { isVisible: boolean }

class Cart extends React.Component<Props, State> {
	private ref = React.createRef<SVGSVGElement>()
	constructor(props: Props) {
		super(props)
		this.state = { isVisible: false }
		this.onClickOutsideOverlay = this.onClickOutsideOverlay.bind(this)
		this.toggle = this.toggle.bind(this)
	}

	onClickOutsideOverlay(e: MouseEvent) {
		this.setState({ isVisible: false })
		// open cart and close overlay in one click
		if (this.ref.current?.contains(e.target as Node)) {
			e.stopImmediatePropagation()
		}
	}

	toggle = () => this.setState({ isVisible: !this.state.isVisible })

	render = () =>  (
		<div className='cart'>
			<CartIcon
				ref={this.ref}
				className='cartIcon'
				onClick={this.toggle}
			/>
			{this.state.isVisible && <Overlay
				currency={this.props.currency}
				onClickOutside={this.onClickOutsideOverlay}
			/>}
		</div>
	)
}

export default Cart