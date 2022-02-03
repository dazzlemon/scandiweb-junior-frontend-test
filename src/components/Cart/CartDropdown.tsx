import React                from 'react';
import { Link }             from 'react-router-dom';
import { Query }            from '@apollo/client/react/components';
import { QueryResult, gql, DocumentNode } from '@apollo/client';

import { Product }                       from '../../pages/Product/ProductContainerTypes'
import { Loading, Error }                from '..'
import { CartProduct, getCart, setCart } from '../../util';
import { ReactComponent as EmptyCart }   from '../../EmptyCart.svg';
import MiniCartProduct                   from './MiniCartProduct'

const PRODUCT = gql`
	query GetProduct($productId: String!) {
		product(id: $productId) {
			id
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
	}
`

type Props = { currency: string, onRedirect: () => void }
type State = { cart: CartProduct[], prices: number[] }

class CartDropdown extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		const cart = getCart()
		this.state = { cart, prices: []	}
	}

	price = (product: Product) => this.props.currency +
		product.prices.find(price =>
			price.currency.symbol == this.props.currency
		)?.amount

	onCountChange = (index: number) => (count: number) => {
		this.state.cart[index].count = count
		setCart(this.state.cart)
		this.setState({ cart: this.state.cart })
	}

	onRemove = (index: number) => () => {
		this.state.cart.splice(index, 1)
		setCart(this.state.cart)
		this.setState({ cart: this.state.cart })
	}

	clearCart = () => {
		this.setState({cart: []})
		setCart([])
	}

	render() {
		if (this.state.cart.length == 0) {
			return (
				<div className='cartOverlay empty'>
					<EmptyCart />
					<p>Your cart is empty</p>
				</div>
			)
		}
		console.log()
		return (
			<div className='cartOverlay'>
				<div className='myBag'>My Bag, <span className='itemCounter'>{this.state.cart.length} items</span> </div>
				<div className='items'>
					{this.state.cart.map((p, index) => {
						const key = JSON.stringify(p.productRecord)
						const selectedAttributes = p.productRecord.selectedAttributes
						// console.log(key)

						return <Query query={PRODUCT} variables={{productId: p.productRecord.id}}>
						{(result: QueryResult<any>) => {
							const { loading, error, data } = result
							if (loading) return <Loading/>
							// if bad productId it doesnt return Error but product is undef
							if (error || !data?.product) return <Error/>

							// it would use old data otherwise idk how to fix it properly
							if (data.product.id != p.productRecord.id) return <div>test</div>

							const product: Product = data.product

							const price = product.prices.find(price =>
								price.currency.symbol == this.props.currency
							)?.amount ?? 0
							if (price !== this.state.prices[index]) {
								this.state.prices[index] = price
								this.setState({ prices: this.state.prices })
							}
							return <MiniCartProduct
								key={key}
								id={key}
								link={`/${product.category}/${p.productRecord.id}`}
								brand={product.brand}
								name={product.name}
								price={this.price(product)}
								attributes={product.attributes}
								selectedAttributes={selectedAttributes}
								img={product.gallery[0]}
								count={p.count}
								onChange={this.onCountChange(index)}
								onRemove={this.onRemove(index)}
								onRedirect={this.props.onRedirect}
							/>
						}}
						</Query>
					})}
				</div>
				<div className='total'>
					<div>Total</div>
					<div className='price'>{this.props.currency}{
						this.state.prices.slice(0, this.state.cart.length)
							.reduce((a, b, index) => a + b * this.state.cart[index].count, 0).toFixed(2)
					}</div>
				</div>
				<div className='buttons'>
					<button
						className='clearCart'
						onClick={this.clearCart}
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

export default CartDropdown