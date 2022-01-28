import { gql, QueryResult } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import React from 'react';
import { Link } from 'react-router-dom';
import { AttributeSet } from '../common/types';
import PageContainer from '../components/PageContainer'
import { Loading, Error, Attribute } from '../PureComponents';
import AttributeItem from '../PureComponents/Attribute/AttributeItem';
import { CartProduct, getCart, setCart } from '../util'
import { Product } from './Product/ProductContainerTypes';
import './Cart.sass'

type State_ = { count: number }
type Props__ = {
	brand: string
	name: string
	price: string
	attributes: AttributeSet[]
	selectedAttributes: number[]
	img: string
	count: number
	onChange: (count: number) => void
	onRemove: () => void
}

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
				<div className='attributes'>
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
			</div>
			<div className='right'>
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
				<button className='deleteCross' onClick={() => this.props.onRemove()}>x</button>
			</div>
		</div>
	)
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

type State = {cart: CartProduct[]}

class Cart extends React.Component<{}, State> {
	constructor() {
		super({})
		document.title = 'Cart'
		this.state = {
			cart: getCart(),
		}
	}

	render = () => (
		<PageContainer>
			{({currencies, currencyIndex}) =>
				<div className='cartPage'>
					<div className='myBag'>My Bag, <span className='itemCounter'>{this.state.cart.length} items</span> </div>
					{this.state.cart.length != 0 && <Query
						query={products(this.state.cart.map(p => p.productRecord.id))}
					>
					{(result: QueryResult<any>) => {//TODO: typing?
						const currency = currencies[currencyIndex].symbol ?? '$'
						const { loading, error, data } = result
						if (loading) return <Loading/>
						// if bad productId it doesnt return Error but product is undef
						if (error || !data?.product0) return <Error/>
		
						const products = new Array<Product>()
						for (let i = 0; i < this.state.cart.length; i++) {
							products[i] = data[`product${i}`]
						}
						return (
							<>
								<div className='items'>
									{products.map((product, index) => (<MiniCartProduct
										brand={product.brand}
										name={product.name}
										price={currency +
											product.prices.find(price =>
												price.currency.symbol == currency
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
										onRemove={() => {
											this.state.cart.splice(index, 1)
											this.setState({ cart: this.state.cart })
											setCart(this.state.cart)
										}}
									/>
									))}
								</div>
								<div className='total'>
									<div>Total</div>
									<div className='price'>{currency}{
										products.map(product =>
											product.prices.find(price =>
												price.currency.symbol == currency
											)?.amount ?? 0
										).reduce((a, b, index) => a + b * this.state.cart[index].count).toFixed(2)
									}</div>
								</div>
							</>
						)
					}}
					</Query>}
					<div className='buttons'>
						<button
							className='clearCart'
							onClick={() => {
								this.setState({cart: []})
								setCart([])
							}}
						>
							Clear this.state.cart
						</button>
						<Link to='/this.state.cart' className='viewBag'>View bag</Link>
						<button className='checkout'>Check out</button>
						
					</div>
				</div>
			}
		</PageContainer>
	)
}

export default Cart