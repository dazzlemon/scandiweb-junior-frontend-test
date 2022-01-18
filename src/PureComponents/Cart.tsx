import { ReactComponent as CartIcon } from '../Icons/Cart.svg';
import clickOutside from '../HOCs/clickOutside';
import React from 'react';

class CartOverlay {
	render() {
		return (
			<>
				<div className='bgEffect'/>
				<div className='cartOverlay'>
					<div>
						Items
					</div>
					<div>
						Total
					</div>
					<div>
						Buttons
					</div>
				</div>
			</>
		);
	}
}

const Overlay = clickOutside(CartOverlay);

type State = { isVisible: boolean }

class Cart extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);
		this.setState({ isVisible: false });
	} 

	render() {
		return (
			<div className='cart'>
				<CartIcon
					className='cartIcon'
					onClick={() => this.setState({ isVisible: !this.state.isVisible })}
				/>
				{this.state.isVisible &&
					<Overlay onClickOutside={() => this.setState({ isVisible: false })}/>
				}
			</div>
		);
	}
}

export default Cart;