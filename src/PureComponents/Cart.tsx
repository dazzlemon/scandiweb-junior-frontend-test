import { ReactComponent as CartIcon } from '../Icons/Cart.svg';
import clickOutside from '../HOCs/clickOutside';
import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';

import { Product as ProductType }  from '../Types/ProductContainer'
import { QueryResult } from '@apollo/client';
import { Loading, Error } from '../PureComponents'
import { gql } from '@apollo/client';

type Props = { currency: string }

type ProductRecord = {
	id: string,
	selectedAttributes?: number[]
}

const product = (name: string, id: string) => `
	${name}: product(id: \"${id}\") {
		name
		inStock
		gallery
		description
		category
		attributes {
			id
			name
			type
			items {
				displayValue
				value
				id
			}
		}
		prices {
			currency {
				label
				symbol
			}
			amount
		}
		brand
	}
`

const products = (ids: string[]) => {
	const query = `query GetProducts {
		${ids.map((i, index) => product('product'+index, i)).join('')}
	}`
	console.log('query =', query)
	return gql(query)
};

class CartDropdown extends React.Component<Props> {
	render() {
		const cart: ProductRecord[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
		const price = '100.00';

		return (
			<div className='cartOverlay'>
				<div className='myBag'>My Bag, <span className='itemCounter'>{cart.length} items</span> </div>
				<Query
					query={products(cart.map(({id}) => id))}
				>
				{(result: QueryResult<any>) => {//TODO: typing?
					const { loading, error, data } = result
					if (loading) return <Loading/>
					// if bad productId it doesnt return Error but product is undef
					if (error || !data?.product0) return <Error/>
	
					const products = new Array<ProductType>()
					for (let i = 0; i < cart.length; i++) {
						products[i] = data[`product${i}`]
					}
					return (
						<>
							{products.map(product => (
								<>
									<div>{product.brand}</div>
									<div>{product.name}</div>
									<div>
										{this.props.currency}
										{product.prices.find(price => price.currency.symbol == this.props.currency)?.amount}
									</div>
									<br/>
								</>
							))}
							<div className='total'>
								<div>Total</div>
								<div className='price'>{this.props.currency}{
									products.map(product =>
										product.prices.find(price =>
											price.currency.symbol == this.props.currency
										)?.amount ?? 0
									).reduce((a, b) => a + b)
								}</div>
							</div>
						</>
					)
				}}
				</Query>
				<div className='buttons'>
					<Link to='/cart' className='viewBag'>View bag</Link>
					<button className='checkout'>Check out</button>
				</div>
			</div>
		);
	}
}

const Overlay = clickOutside(CartDropdown);

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