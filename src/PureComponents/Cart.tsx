import { ReactComponent as CartIcon } from '../Icons/Cart.svg';
import clickOutside from '../HOCs/clickOutside';
import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';

import { AttributeSet, Product as ProductType }  from '../Types/ProductContainer'
import { QueryResult } from '@apollo/client';
import { Loading, Error } from '../PureComponents'
import { gql } from '@apollo/client';
import { Price } from '../Types/CategoryContainer';
import Attribute from './Attribute';
import { CartProduct, getCart, setCart } from '../util';

type Props = { currency: string }

type ProductRecord = {
	id: string,
	selectedAttributes: number[]
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

type Props__ = {
	brand: string
	name: string
	price: string
	attributes: AttributeSet[]
	selectedAttributes: number[]
	img: string
	count: number
	onChange: (count: number) => void
}

type State_ = { count: number }

class MiniCartProduct extends React.Component<Props__, State_> {
	constructor(props: Props__)	{
		super(props)
		this.state = { count: props.count }

		this.incrementCount = this.incrementCount.bind(this)
		this.decrementCount = this.decrementCount.bind(this)
	}

	incrementCount() {
		this.props.onChange(this.state.count + 1)
		this.setState({ count: this.state.count + 1 })
	}

	decrementCount() {
		this.props.onChange(this.state.count - 1)
		this.setState({ count: this.state.count - 1 })
	}
	
	render = () => (
		<div className='item'>
			<div className='left'>
				<div className='productName'>
					<p>{this.props.brand}</p>
					<p>{this.props.name}</p>
				</div>
				<div className='price'>{this.props.price}</div>
				{this.props.attributes.map((attr, attrIndex) =>
					<Attribute
						name={attr.name}
						type={attr.type}
						items={attr.items}
						selectedIndex={this.props.selectedAttributes[attrIndex]}
						onChange={() => null}
					/>
				)}
			</div>
			<div className='counter'>
				<button onClick={this.incrementCount}>+</button>
				<p>{this.state.count}</p>
				<button
					onClick={this.decrementCount}
					disabled={this.state.count == 1}
				>
					-
				</button>
			</div>
			<img src={this.props.img} />
			<br/>
		</div>
	)
}

const products = (ids: string[]) => {
	const query = `query GetProducts {
		${ids.map((i, index) => product('product'+index, i)).join('')}
	}`
	console.log('query =', query)
	return gql(query)
};

type State__ = { cart: CartProduct[] }

class CartDropdown extends React.Component<Props, State__> {
	constructor(props: Props) {
		super(props)
		this.state = { cart: getCart() }
	}

	render() {
		return (
			<div className='cartOverlay'>
				<div className='myBag'>My Bag, <span className='itemCounter'>{this.state.cart.length} items</span> </div>
				{this.state.cart.length != 0 && <Query
					query={products(this.state.cart.map(p => p.productRecord.id))}
				>
				{(result: QueryResult<any>) => {//TODO: typing?
					const { loading, error, data } = result
					if (loading) return <Loading/>
					// if bad productId it doesnt return Error but product is undef
					if (error || !data?.product0) return <Error/>
	
					const products = new Array<ProductType>()
					for (let i = 0; i < this.state.cart.length; i++) {
						products[i] = data[`product${i}`]
					}
					return (
						<>
							<div className='items'>
								{products.map((product, index) => (<MiniCartProduct
									brand={product.brand}
									name={product.name}
									price={this.props.currency +
										product.prices.find(price =>
											price.currency.symbol == this.props.currency
										)?.amount
									}
									attributes={product.attributes}
									selectedAttributes={this.state.cart[index].productRecord.selectedAttributes}
									img={product.gallery[0]}
									count={this.state.cart[index].count}
									onChange={count => {
										this.state.cart[index].count = count
										setCart(this.state.cart)
										this.setState({ cart: this.state.cart })
									}}
								/>
								))}
							</div>
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
				</Query>}
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