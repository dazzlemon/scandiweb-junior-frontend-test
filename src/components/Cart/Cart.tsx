import React                from 'react';
import { Link }             from 'react-router-dom';
import { Query }            from '@apollo/client/react/components';
import { QueryResult, gql, NetworkStatus, DocumentNode } from '@apollo/client';

import withClickOutside                  from '../../common/withClickOutside';
import { Product }                       from '../../pages/Product/ProductContainerTypes'
import { Loading, Error }                from '..'
import { CartProduct, getCart, setCart } from '../../util';
import { ReactComponent as CartIcon }    from './Cart.svg';
import MiniCartProduct                   from './MiniCartProduct'

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

const productsQuery = (ids: string[]) => {
	const query = `query GetProducts {
		${ids.map((i, index) => product('product'+index, i)).join('')}
	}`
	return gql(query)
};

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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						width="128px" height="129px" viewBox="0 0 128 129"
						version="1.1"
					>
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-5, 0)">
								<ellipse id="Oval" fill="#C1C8D0" fill-rule="nonzero" cx="100.5845" cy="118.465" rx="1.8135" ry="1.82410526"/>
								<ellipse id="Oval" fill="#C1C8D0" fill-rule="nonzero" cx="55.489" cy="118.465" rx="1.8135" ry="1.82410526"/>
								<path d="M104.66925,37.5445322 C103.6335,37.5445322 102.79425,38.3886901 102.79425,39.4304971 L102.79425,42.7950585 C102.79425,43.8368655 103.6335,44.6810234 104.66925,44.6810234 C105.70475,44.6810234 106.54425,43.8368655 106.54425,42.7950585 L106.54425,39.4304971 C106.54425,38.3889415 105.705,37.5445322 104.66925,37.5445322 Z" id="Shape" fill="#C1C8D0" fill-rule="nonzero"/>
								<path d="M64.3685,37.5445322 C63.333,37.5445322 62.4935,38.3886901 62.4935,39.4304971 L62.4935,42.7950585 C62.4935,43.8368655 63.333,44.6810234 64.3685,44.6810234 C65.404,44.6810234 66.2435,43.8368655 66.2435,42.7950585 L66.2435,39.4304971 C66.2435,38.3889415 65.404,37.5445322 64.3685,37.5445322 Z" id="Shape" fill="#C1C8D0" fill-rule="nonzero"/>
								<path d="M131.27025,27.9404444 C129.939,26.3305848 127.98275,25.3456082 125.9035,25.2379825 L36.53325,20.6178713 L35.56275,15.6766433 C35.362,14.6549532 34.37525,13.9895848 33.35975,14.1922632 C32.344,14.3941871 31.683,15.3859532 31.88375,16.4078947 L41.446,65.0894269 C41.446,65.0894269 41.446,65.0894269 41.446,65.0896784 L44.8135,82.232848 C45.28125,84.6131871 43.736,86.9324211 41.37,87.4029064 C41.0865,87.4592339 40.79875,87.4876491 40.5145,87.4876491 C40.25675,87.4876491 40.00325,87.4645146 39.75625,87.4202573 C39.727,87.4137193 39.69775,87.405924 39.6685,87.4011462 C37.9625,87.0596608 36.57675,85.7095614 36.229,83.9385146 L23.299,18.1133099 C22.8385,15.7694327 20.95475,13.9335088 18.61125,13.5444971 L12.415,12.5167719 C10.03475,12.1222281 8.4175,9.85303509 8.81,7.4588655 C9.00025,6.29861988 9.62825,5.28221053 10.57775,4.59722807 C11.5275,3.91224561 12.68525,3.64066667 13.83925,3.83278363 L20.03525,4.86050877 C23.23025,5.39008772 26.20225,7.02635088 28.40325,9.46804678 C29.09875,10.2397836 30.2845,10.2983743 31.05175,9.59830409 C31.81875,8.89873684 31.87675,7.70605263 31.18125,6.93431579 C28.4135,3.86497076 24.672,1.80675439 20.64525,1.13912281 L14.45025,0.111649123 C12.30825,-0.245175439 10.157,0.260011696 8.39275,1.53240936 C6.629,2.80430409 5.46325,4.69127485 5.11025,6.84554971 C4.38125,11.292152 7.38475,15.5059006 11.80525,16.2389123 L18.00125,17.2666374 C18.81075,17.4006667 19.46125,18.0351053 19.62025,18.8448129 L32.55025,84.6697661 C33.03625,87.1444035 34.61475,89.1782281 36.717,90.3040234 L33.537,96.5490819 C31.736,100.086146 31.89125,104.221439 33.9515,107.610895 C36.012,111.001105 39.6005,113.025123 43.55075,113.025123 L46.82325,113.025123 C45.82575,114.632216 45.26525,116.509129 45.26525,118.465503 C45.26525,124.135971 49.85175,128.749041 55.48925,128.749041 C61.12675,128.749041 65.713,124.135971 65.713,118.465503 C65.713,116.509129 65.1525,114.632216 64.155,113.025123 L91.919,113.025123 C90.9215,114.632216 90.361,116.509129 90.361,118.465503 C90.361,124.135971 94.9475,128.749041 100.585,128.749041 C106.22225,128.749041 110.80875,124.135971 110.80875,118.465503 C110.80875,116.509129 110.24825,114.632216 109.25075,113.025123 L118.54075,113.025123 C123.02125,113.025123 126.66625,109.358807 126.66625,104.852357 C126.66625,100.345655 123.02125,96.6793392 118.54075,96.6793392 L113.04025,96.6793392 C112.0045,96.6793392 111.16525,97.5234971 111.16525,98.5653041 C111.16525,99.6071111 112.0045,100.451269 113.04025,100.451269 L118.54075,100.451269 C120.95325,100.451269 122.91625,102.425749 122.91625,104.852357 C122.91625,107.278965 120.95325,109.253193 118.54075,109.253193 L43.55075,109.253193 C40.917,109.253193 38.52475,107.903848 37.15075,105.643456 C35.777,103.383819 35.67375,100.626789 36.8745,98.2685789 L40.44425,91.2583216 C40.46775,91.2585731 40.491,91.2598304 40.51475,91.2598304 C41.04175,91.2598304 41.57375,91.2072749 42.0965,91.1036725 C45.45775,90.435538 47.92425,87.7584737 48.5115,84.5588713 L53.82825,84.2822632 L46.993,97.705807 C46.69525,98.2904561 46.72125,98.9890175 47.062,99.5492749 C47.4025,100.109532 48.00875,100.45152 48.66175,100.45152 L104.3235,100.45152 C105.35925,100.45152 106.1985,99.6073626 106.1985,98.5655556 C106.1985,97.5237485 105.35925,96.6795906 104.3235,96.6795906 L51.7285,96.6795906 L58.156,84.0572047 L120.56,80.8108304 C124.15875,80.6237427 127.1145,77.8800409 127.58825,74.2869006 L132.9345,33.7406667 C133.208,31.664345 132.6015,29.5503041 131.27025,27.9404444 Z M97.03,113.024871 L104.13925,113.024871 C105.95025,114.224848 107.05825,116.268982 107.05825,118.465251 C107.05825,122.055626 104.15425,124.97686 100.5845,124.97686 C97.01475,124.97686 94.1105,122.055877 94.1105,118.465251 C94.11075,116.268982 95.21875,114.224848 97.03,113.024871 Z M51.9345,113.024871 L59.04375,113.024871 C60.855,114.224848 61.963,116.268982 61.963,118.465251 C61.963,122.055626 59.05875,124.97686 55.48925,124.97686 C51.9195,124.97686 49.01525,122.055877 49.01525,118.465251 C49.01525,116.268982 50.12325,114.224848 51.9345,113.024871 Z M123.8705,73.7907661 C123.63425,75.5824327 122.16025,76.950386 120.366,77.0439298 L48.3525,80.7902105 L45.557,66.5577135 L124.92675,65.7811988 L123.8705,73.7907661 Z M129.21675,33.2445322 L125.42475,62.0039883 L44.8175,62.7925731 L37.28275,24.4335556 L125.711,29.004883 C126.763,29.0591988 127.71325,29.537731 128.38675,30.3522164 C129.0605,31.1669532 129.355,32.1941754 129.21675,33.2445322 Z" id="Shape" fill="#C1C8D0" fill-rule="nonzero"/>
								<path d="M90.7323482,45.2244676 C89.9518482,44.5399881 88.7673482,44.6219647 88.0868482,45.4072805 C87.1025982,46.5433858 85.6813482,47.1946723 84.1875982,47.1946723 C82.6938482,47.1946723 81.2728482,46.5431343 80.2885982,45.4072805 C79.6078482,44.6222162 78.4235982,44.540491 77.6430982,45.2244676 C76.8625982,45.9089472 76.7810982,47.1001226 77.4613482,47.8854384 C79.1580982,49.8435729 81.6095982,50.9666021 84.1873482,50.9666021 C86.7655982,50.9666021 89.2168482,49.8435729 90.9135982,47.8854384 C91.5945982,47.1001226 91.5130982,45.9086957 90.7323482,45.2244676 Z" id="Shape" fill="#C1C8D0" fill-rule="nonzero" transform="translate(84.187776, 47.863418) scale(-1, 1) rotate(-180.000000) translate(-84.187776, -47.863418) "/>
						</g>
					</svg>
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

const Overlay = withClickOutside(CartDropdown);

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