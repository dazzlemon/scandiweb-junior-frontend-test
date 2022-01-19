import { ReactComponent as CartIcon } from '../Icons/Cart.svg';
import clickOutside from '../HOCs/clickOutside';
import React from 'react';

type Props = { price: number, currency: string }

class CartOverlay extends React.Component<Props> {
	render() {
		return (
			<div className='cartOverlay'>
				<div>
					Items
				</div>
				<div className='total'>
					<div>Total</div>
					<div className='price'>{this.props.currency}{this.props.price.toFixed(2)}</div>
				</div>
				<div className='buttons'>
					<button className='viewBag'>View bag</button>
					<button className='checkout'>Check out</button>
				</div>
			</div>
		);
	}
}

const Overlay = clickOutside(CartOverlay);

type State = { isVisible: boolean }

class Cart extends React.Component<{}, State> {
		private ref = React.createRef<SVGSVGElement>();
		constructor(props: {}) {
		super(props);
		this.state = { isVisible: false };
	} 

	render() {
		console.log();
		console.log(this.state);

		return (
			<div className='cart'>
				<CartIcon
					ref={this.ref}
					className='cartIcon'
					onClick={() => this.setState({ isVisible: !this.state.isVisible })}
				/>
				{this.state.isVisible &&
					<>
						<div className='bgEffect'/>
						<Overlay 
							onClickOutside={(e) => {
								this.setState({ isVisible: false })
								// open cart and close overlay in one click
								if (this.ref.current?.contains(e.target as Node)) {
									e.stopImmediatePropagation();
								}
							}}
							// tmp
							price={100}
							currency='$'
						/>
					</>
				}
			</div>
		);
	}
}

export default Cart;