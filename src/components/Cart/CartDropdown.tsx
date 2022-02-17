import React                from 'react';
import { Link }             from 'react-router-dom';
import { Query }            from '@apollo/client/react/components';
import { QueryResult, gql } from '@apollo/client';

import { Product }                       from '../../pages/Product/ProductContainerTypes'
import { Loading, Error }                from '..'
import { CartProduct, getCart, setCart } from '../../util';
import { ReactComponent as EmptyCart }   from '../../EmptyCart.svg';
import MiniCartProduct                   from './MiniCartProduct'

const PRODUCT = gql`
	query GetMiniCartProduct($productId: String!) {
		product(id: $productId) {
			id
			name
			inStock
			gallery
			category
			attributes {
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
			price.currency.symbol === this.props.currency
		)?.amount

	onCountChange = (index: number) => (count: number) => {
		const cart = [...this.state.cart]
		cart[index].count = count
		setCart(cart)
		this.setState({cart})
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
		if (this.state.cart.length === 0) {
			return (
				<div className='cartOverlay empty'>
					<EmptyCart />
					<p>Your cart is empty</p>
				</div>
			)
		}
		return (
			<div className='cartOverlay'>
				<div className='myBag'>My Bag, <span className='itemCounter'>{this.state.cart.length} items</span> </div>
				<div className='items'>
					{this.state.cart.map((prod, index) => {
						const key = JSON.stringify(prod.productRecord)
						const selectedAttributes = prod.productRecord.selectedAttributes

						return <Query query={PRODUCT} variables={{productId: prod.productRecord.id}}
							key={key}
							onCompleted={(data: { product: Product }) => {
								const price = data.product.prices.find(p =>
									p.currency.symbol === this.props.currency
								)?.amount ?? 0
								if (price !== this.state.prices[index]) {
									const prices = this.state.prices 
									prices[index] = price
									this.setState({ prices })
								}
							}}
							fetchPolicy='network-only'
						>
						{(result: QueryResult<any>) => {
							const { loading, error, data } = result
							if (loading) return <Loading/>
							// if bad productId it doesnt return Error but product is undef
							if (error || !data?.product) return <Error/>

							const product: Product = data.product

							return <MiniCartProduct
								key={key}
								id={key}
								link={`/${product.category}/${prod.productRecord.id}`}
								brand={product.brand}
								name={product.name}
								price={this.price(product)}
								attributes={product.attributes}
								selectedAttributes={selectedAttributes}
								img={product.gallery[0]}
								count={prod.count}
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