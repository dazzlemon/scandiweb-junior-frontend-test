import React                from 'react';
import { Link }             from 'react-router-dom';
import { Query }            from '@apollo/client/react/components';
import { QueryResult, gql, NetworkStatus, DocumentNode } from '@apollo/client';

import withClickOutside                  from '../../common/withClickOutside';
import { Product }                       from '../../pages/Product/ProductContainerTypes'
import { Loading, Error }                from '..'
import { CartProduct, getCart, setCart } from '../../util';
import { ReactComponent as CartIcon }    from './Cart.svg';
import { ReactComponent as EmptyCart }   from '../../EmptyCart.svg';
import MiniCartProduct                   from './MiniCartProduct'

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

const productsQuery = (ids: string[]) => {
	const query = `query GetProducts {
		${ids.map((i, index) => product('product'+index, i)).join('')}
	}`
	return gql(query)
};

type Props = { currency: string, onRedirect: () => void }
type State__ = { cart: CartProduct[], query?: DocumentNode }

class CartDropdown extends React.Component<Props, State__> {
	constructor(props: Props) {
		super(props)
		const cart = getCart()
		this.state = { cart, query: cart.length > 0 ?
			productsQuery(
				cart.map(p => p.productRecord.id)
			) : undefined
		}
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

		return (
			<div className='cartOverlay'>
				<div className='myBag'>My Bag, <span className='itemCounter'>{this.state.cart.length} items</span> </div>
				{this.state.cart.length != 0 && <Query
					// query={products(this.state.cart.map(p => p.productRecord.id))}
					query={this.state.query!}
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
					return (
						<>
							<div className='items'>
								{products.map((product, index) => {
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

export default CartDropdown