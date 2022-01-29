import { gql, QueryResult } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import React from 'react';
import { AttributeSet } from '../common/types';
import PageContainer from '../components/PageContainer'
import { Loading, Error, Attribute } from '../PureComponents';
import { CartProduct, getCart, setCart } from '../util'
import { Product } from './Product/ProductContainerTypes';
import './Cart.sass'
import { Link } from 'react-router-dom';

type Props___ = { gallery: string[] }
type State__ = { index: number }
class Gallery extends React.Component<Props___, State__> {
	constructor(props: Props___) {
		super(props)
		this.state = { index: 0 }
	}

	render = () => (
		<div className='mainImageContainer'>
			<img src={this.props.gallery[this.state.index] } className='productImage' />
			{this.state.index > 0 && <button
				className='prev'
				onClick={() => this.setState({index: this.state.index > 0 ? this.state.index - 1 : 0})}
			>
				{`<`}
			</button>}
			{this.state.index < this.props.gallery.length - 1 && <button
				className='next'
				onClick={() =>
					this.setState({index:
						this.state.index + 1 < this.props.gallery.length ?
							this.state.index + 1 :
							this.props.gallery.length - 1})}
			>
				{`>`}
			</button>}
		</div>
	)
}

type State_ = { count: number }
type Props__ = {
	brand: string
	name: string
	price: string
	attributes: AttributeSet[]
	selectedAttributes: number[]
	// img: string
	gallery: string[]
	count: number
	onChange: (count: number) => void
	onRemove: () => void
	link: string
}

class MiniCartProduct extends React.Component<Props__, State_> {
	constructor(props: Props__)	{
		super(props)
		this.state = { count: props.count }

		this.incrementCount = this.incrementCount.bind(this)
		this.decrementCount = this.decrementCount.bind(this)
	}

	// also can add key, but both fixes seem very hacky to me
	componentDidUpdate(prevProps: Props__) {
		if(prevProps.count !== this.props.count) {
			this.setState({count: this.props.count});
		}
	}
	
	incrementCount() {
		this.props.onChange(this.state.count + 1)
		this.setState({ count: this.state.count + 1 })
	}

	decrementCount() {
		this.props.onChange(this.state.count - 1)
		this.setState({ count: this.state.count - 1 })
	}

	render = () => {
		console.log('render inner', this.props.count, this.state.count)
		return (
		<div className='item'>
			<div className='left'>
				<Link to={this.props.link} className='productName'>
					<p>{this.props.brand}</p>
					<p>{this.props.name}</p>
				</Link>
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
				{/* <img src={this.props.img} /> */}
				<Gallery gallery={this.props.gallery} />
				<button className='deleteCross' onClick={() => this.props.onRemove()}>x</button>
			</div>
		</div>
	)}
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
	return gql(query)
};

type State = {cart: CartProduct[]}

class Cart extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props)
		document.title = 'Cart'
		this.state = { cart: getCart() }
		this.localStorageUpdated = this.localStorageUpdated.bind(this)
	}

	componentDidMount() {
		document.addEventListener('storage', this.localStorageUpdated)
	}
	componentWillUnmount() {
		document.removeEventListener('storage', this.localStorageUpdated)
	}

	localStorageUpdated() {
		this.setState({ cart: getCart() })
	}

	render = () => {
		console.log('render outer', this.state.cart[0].count)
		return (
		<PageContainer>
			{({currencies, currencyIndex}) =>
				<div className='cartPage'>
					<div className='myBag'>
						<div>Cart</div>
						<div className='itemCounter'>{this.state.cart.length} items</div>
					</div>
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
						console.log('render', this.state.cart[0].count)
						return (
							<>
								<div className='items'>
									{products.map((product, index) => (<MiniCartProduct
										brand={product.brand}
										name={product.name}
										link={`/${product.category}/${this.state.cart[index].productRecord.id}`}
										price={currency +
											product.prices.find(price =>
												price.currency.symbol == currency
											)?.amount
										}
										attributes={product.attributes}
										selectedAttributes={this.state.cart[index].productRecord.selectedAttributes}
										// img={product.gallery[0]}
										gallery={product.gallery}
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
								<div className='bottom'>
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
									<div className='buttons'>
										<button
											className='clearCart'
											onClick={() => {
												this.setState({cart: []})
												setCart([])
											}}
										>
											Clear cart
										</button>
										<button className='checkout'>Check out</button>
									</div>
								</div>
							</>					
						)
					}}
					</Query>}
				</div>
			}
		</PageContainer>
	)}
}

export default Cart