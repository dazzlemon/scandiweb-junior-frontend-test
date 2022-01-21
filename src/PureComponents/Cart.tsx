import { ReactComponent as CartIcon } from '../Icons/Cart.svg';
import clickOutside from '../HOCs/clickOutside';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = { currency: string }

class CartOverlay extends React.Component<Props> {
	render() {
		const cart: string[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
		const price = '100.00';

		return (
			<div className='cartOverlay'>
				<div className='myBag'>My Bag, <span className='itemCounter'>{cart.length} items</span> </div>
				<div>
					{cart.map(id => <div>{id}</div>)}
				</div>
				<div className='total'>
					<div>Total</div>
					<div className='price'>{this.props.currency}{price}</div>
				</div>
				<div className='buttons'>
					<Link to='/cart' className='viewBag'>View bag</Link>
					<button className='checkout'>Check out</button>
				</div>
			</div>
		);
	}
}

const Overlay = clickOutside(CartOverlay);

type Props_ = { currency: string }// TODO: probably need to have some shared storage to not redraw?
type State = { isVisible: boolean }

class Cart extends React.Component<Props_, State> {
		private ref = React.createRef<SVGSVGElement>();
		constructor(props: Props_) {
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
							currency={this.props.currency}
						/>
					</>
				}
			</div>
		);
	}
}

export default Cart;