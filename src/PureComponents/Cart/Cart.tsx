import React                from 'react';
import { Link }             from 'react-router-dom';
import { Query }            from '@apollo/client/react/components';
import { QueryResult, gql, NetworkStatus, DocumentNode } from '@apollo/client';

import clickOutside                      from '../../HOCs/clickOutside';
import { Product }                       from '../../pages/Product/ProductContainerTypes'
import { AttributeSet }                  from '../../common/types'
import { Loading, Error }                from '..'
import { Attribute }                     from '../Attribute';
import { CartProduct, getCart, setCart } from '../../util';

import { ReactComponent as EmptyCart }   from './EmptyCart.svg'
import { ReactComponent as CartIcon }    from './Cart.svg';
import AttributeItem from '../Attribute/AttributeItem';

type Props = { currency: string, onRedirect: () => void }

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
	link: string
	brand: string
	name: string
	price: string
	attributes: AttributeSet[]
	selectedAttributes: number[]
	img: string
	count: number
	onChange: (count: number) => void
	onRemove: () => void
	onRedirect: () => void
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
				<Link to={this.props.link} className='productName' onClick={this.props.onRedirect}>
					<p>{this.props.brand}</p>
					<p>{this.props.name}</p>
				</Link>
				<div className='price'>{this.props.price}</div>
				<div className='attributes'>
					{this.props.attributes.map((attr, attrIndex) => {
						// console.log('attr.items.length', attr.items.length)
						// console.log(this.props.name)
						// console.log('this.props.selectedAttributes[attrIndex]', this.props.selectedAttributes[attrIndex])
						// console.log('this.props.selectedAttributes.length', this.props.selectedAttributes.length)
						// console.log('attrIndex', attrIndex)
						// // // console.log('this.props.attributes.length', this.props.attributes.length)
						// console.log()
						// if (this.props.selectedAttributes[attrIndex] === undefined) {
						// 	console.log(attr.items.map(i => i.displayValue), attrIndex, this.props.selectedAttributes)
						// }

						return <div className={'attributeContainer ' + attr.type}>
							<div className='attributeName'>{attr.name}</div>
							<AttributeItem
								type={attr.type}
								value={attr.items[this.props.selectedAttributes[attrIndex]].displayValue}
								onSelected={() => null}
							/>
						</div>
					}
					)}
				</div>
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
			<button className='deleteCross' onClick={() => this.props.onRemove()}>x</button>
		</div>
	)
}

const productsQuery = (ids: string[]) => {
	const query = `query GetProducts {
		${ids.map((i, index) => product('product'+index, i)).join('')}
	}`
	return gql(query)
};

type State__ = { cart: CartProduct[], query: DocumentNode }

class CartDropdown extends React.Component<Props, State__> {
	constructor(props: Props) {
		super(props)
		const cart = getCart()
		this.state = { cart, query: productsQuery(cart.map(p => p.productRecord.id)) }
	}

	render() {
		if (this.state.cart.length == 0) {
			return (
				<div className='cartOverlay empty'>
					<EmptyCart className='emptyCart' />
					Your cart is empty
				</div>
			)
		}

		return (
			<div className='cartOverlay'>
				<div className='myBag'>My Bag, <span className='itemCounter'>{this.state.cart.length} items</span> </div>
				{this.state.cart.length != 0 && <Query
					// query={products(this.state.cart.map(p => p.productRecord.id))}
					query={this.state.query}
					fetchPolicy={'no-cache'}
					nextFetchPolicy={'no-cache'}
				>
				{(result: QueryResult<any>) => {//TODO: typing?
					const { loading, error, data, refetch, networkStatus } = result
					if (loading || networkStatus === NetworkStatus.refetch || data[`product${this.state.cart.length}`]) return <Loading/>
					// if bad productId it doesnt return Error but product is undef
					if (error || !data?.product0) return <Error/>
	
					const products = new Array<Product>()
					for (let i = 0; i < this.state.cart.length; i++) {
						products[i] = data[`product${i}`]
					}
					// console.log('products', products.map((p, idx) => ({
					// 	name: p.name,
					// 	attrs: p.attributes.map(a => a.items.map(i => i.displayValue)),
					// 	selectedAttrs: this.state.cart[idx].productRecord.selectedAttributes
					// })))

					// console.log(this.state.query.loc?.source.body)
					// console.log('phantom', data[`product${this.state.cart.length}`])
					return (
						<>
							<div className='items'>
								{products.map((product, index) => {
									// console.log('id', this.state.cart[index].productRecord.id +
									// 	JSON.stringify(this.state.cart[index].productRecord.selectedAttributes))

									const attributesLengths = product.attributes.map(i => i.items.length)
									// if (attributesLengths.length != this.state.cart[index].productRecord.selectedAttributes.length) {
									// 	console.log(this.state.cart[index].productRecord.selectedAttributes)
									// 	console.log(attributesLengths)
									// 	console.log(product)
									// }
									// console.log()

									return (<MiniCartProduct
									key={this.state.cart[index].productRecord.id +
										JSON.stringify(this.state.cart[index].productRecord.selectedAttributes)}
									link={`/${product.category}/${this.state.cart[index].productRecord.id}`}
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
										this.setState({ cart: this.state.cart, query: productsQuery(this.state.cart.map(p => p.productRecord.id)) })
									}}
									onRemove={() => {
										console.log(this.state.cart.length)
										this.state.cart.splice(index, 1)
										setCart(this.state.cart)
										refetch()
										this.setState({ cart: this.state.cart, query: productsQuery(this.state.cart.map(p => p.productRecord.id)) })
									}}
									onRedirect={this.props.onRedirect}
								/>
								)})}
							</div>
							<div className='total'>
								<div>Total</div>
								<div className='price'>{this.props.currency}{
									products.map(product =>
										product.prices.find(price =>
											price.currency.symbol == this.props.currency
										)?.amount ?? 0
									).reduce((a, b, index) => a + b * this.state.cart[index].count, 0).toFixed(2)
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
						Clear cart
					</button>
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
							onRedirect={() => this.setState({ isVisible: false })}
						/>
					</>
				}
			</div>
		);
	}
}

export default Cart;