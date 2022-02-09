import React from 'react';
import { Link } from 'react-router-dom';
import { gql, QueryResult } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

import { AttributeSet } from '../common/types';
import { CartProduct, getCart, setCart } from '../util'
import { Product } from './Product/ProductContainerTypes';
import { Gallery, Counter, PageContainer, Loading, Error, Attribute } from '../components'
import './Cart.sass'

type State_ = { count: number }
type Props__ = {
	brand: string
	name: string
	price: string
	attributes: AttributeSet[]
	selectedAttributes: number[]
	gallery: string[]
	onChange: (count: number) => void
	onRemove: () => void
	link: string
	count: number
}

class MiniCartProduct extends React.Component<Props__, State_> {
	render = () => (
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
							id={attr.id}
							key={attr.id}
							name={attr.name}
							type={attr.type}
							items={attr.items}
							selectedIndex={this.props.selectedAttributes[attrIndex]}
						/>
					)}
				</div>
			</div>
			<div className='right'>
				<Counter onChange={this.props.onChange} initialCount={this.props.count} />
				<Gallery gallery={this.props.gallery}/>
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
		if (this.state.cart.length == 0) {
			return (
				<PageContainer>
				{ () =>
					// <svg height="240" viewBox="0 0 240 240" width="240" xmlns="http://www.w3.org/2000/svg">
					// 	<path d="m9.30006 136.5c-.6 12.8 8.70004 27.2 20.70004 31.7 18.1 6.8 30.3-10.2 41-21.9 8.2-9 18.5-17.2 30.4999-18.8 7-1 14 .3 21 1.3 17.7 2.6 35.8 4.2 53.2.3s34.2-13.5 43.4-28.8c2.3-3.9 4.1-8.1 4.8-12.5 1.8-9.7-1.3-19.7-6-28.2-6.6-12.1-16.5-22.4-28.5-29.4-11.1-6.4-24.3-10.1-37-7.6-18 3.6-31.3 18.6-42.9 33-11.3999 14.3-23.9999 29.6-41.7999 34.5-5.5 1.5-11.3 1.8-16.7 3.3-16.5 4.2-31.9 17-38.9 32.6-1.7 3.7-2.50004 7.2-2.80004 10.5z" fill="#f5f5f5"/>
					// 	<path d="m218.9 99.1c-2.8-13.7-6.5-27.2-7.3-30 0-.7-.2-1.3-.6-1.9-1-1.5-3-4.8-39.4-12.9-18.5-4.2-38.7-7.9-46-8.8-1.5-.2-3.3-.3-5.4-.4l-2.5-1.8c-4.9-6.8-13-10.8-21.4-10.3l-35.9 2c-4.5.2-8.3 2.8-10.3 6.9-1.9 4.1-1.5 8.7 1.2 12.3l5.4 7.4c1.3 9.2 6.6 26.6 14.6 51.5 1.3 4.1 2.4 7.4 2.9 9.1.4 1.5 1.7 2.8 3.8 3.9 2.2 9.2 12.5 52.6 17.6 61.1.6 1.1 1.7 2.1 3.1 3-2 1.3-3.3 3.8-3.3 6.6 0 4.2 3 7.7 6.8 7.7 3.7 0 6.8-3.4 6.8-7.7 0-1-.2-1.9-.5-2.8 9.3 2.5 23.1 4.3 40.2 6.3 9.7 1.1 18 2.1 22.5 3.2 1.3.3 2.7.5 4.1.7-.7 1.2-1.1 2.6-1.1 4.1 0 4.2 3 7.7 6.8 7.7 3.7 0 6.8-3.4 6.8-7.7 0-1.6-.4-3.1-1.2-4.4 5.6-.8 11-2.4 15.4-4.6-.3.8-.4 1.8-.4 2.7 0 4.2 3 7.7 6.8 7.7 3.7 0 6.8-3.4 6.8-7.7 0-3.9-2.5-7-5.8-7.6 1.4-1.4 2.5-2.8 3-4.2.5-1.2.3-2.4-.3-3.5-2.6-4.4-16.1-6.7-52.8-11-12.7-1.5-25.8-3-28.3-4.2-3.3-1.4-7.5-18.5-9.4-38 5.5.5 11.5 1 18.1 1.5 10.6.8 19.8 1.5 23.8 2.3 5.5 1 13.9 1.5 22.7 1.5 13.3 0 27.3-1.2 32.7-3.6 4-1.8 5.7-8.7 0-36.1zm-48.7 33.3-1.5-7c2.6 0 6.4-.3 10.7-.6l1.1 8.2c-3.7-.1-7.2-.3-10.3-.6zm-61.6-5.9-1.7-8.9c4.9.7 10.1 1.4 15.3 2.1l1.6 8.3c-5.2-.5-10.3-1-15.2-1.5zm-28.8-6.1c-.4-1.4-1.2-3.8-2.1-6.8 2.4.3 6.3.9 11.1 1.5l1.6 8.7c-8.4-1.6-10.2-3-10.6-3.4zm12.1 3.7-1.7-8.8c4.5.6 9.7 1.3 15.2 2.1l1.7 8.9c-2-.2-3.9-.5-5.8-.7-3.8-.5-6.9-1-9.4-1.5zm-25.6-47.4c3.4.6 8.9 1.6 15.7 2.8l3.1 16.5c-6-.8-10.8-1.5-13.6-1.9-1.8-5.7-3.6-11.8-5.2-17.4zm140.9-1.7c1 3.7 1.9 7.3 2.8 10.8-2.4.2-6.9.6-12.4 1.1l-1.6-11.5c4.9-.2 8.8-.3 11.2-.4zm-90 10.4c6.1 1 12.2 1.9 17.8 2.6l2.8 14.8c-5.8-.7-11.8-1.4-17.8-2.2zm1.4 15c-5.2-.7-10.3-1.3-15.3-2l-3-15.8c5 .8 10.2 1.7 15.3 2.5zm18-12.2c7.1.9 13.5 1.7 18.5 2l3.2 14.9c-5.5-.6-12-1.3-18.9-2.1zm24.5 2.3c3.7 0 8.5-.2 13.7-.5l2.1 16c-4 .1-8.2 0-12.5-.3zm15.1-.6c6.7-.4 13.9-1 20-1.5l2.1 15.8c-5.8.8-12.6 1.5-20 1.7zm21.5-1.6c5.7-.5 10.3-.9 12.6-1.1 1.2 5.1 2.3 9.9 3.2 14.3-2.8.7-7.6 1.7-13.7 2.6zm-3.2-12.9 1.5 11.6c-6.2.5-13.4 1.1-20 1.5l-1.6-12.4c7.1-.2 14.2-.5 20.1-.7zm-21.6.8 1.6 12.4c-5.3.3-10.1.5-13.8.5l-2.7-12.3c4.8-.3 9.9-.4 14.9-.6zm-21 .7h.3l2.6 11.9c-5-.4-11.4-1.1-18.4-2.1l-2.1-11.2c7 .9 13.2 1.4 17.6 1.4zm-19.2-1.6 2.1 11.2c-5.7-.8-11.7-1.7-17.8-2.6l-2.1-11.3c6.1 1 12.2 2 17.8 2.7zm-19.4-2.9 2.1 11.3c-5.2-.8-10.4-1.7-15.3-2.5l-2.2-11.4c5.1.8 10.3 1.7 15.4 2.6zm-16.9-3 2.2 11.5c-5.5-.9-10.7-1.8-15.3-2.6l-2.3-11.8c4.8 1 10 1.9 15.4 2.9zm-16.9-3.2 2.2 11.8c-7-1.2-12.6-2.3-15.8-2.9-1.3-4.7-2.4-8.9-3-12.2 3.8.8 9.7 2 16.6 3.3zm4 13.6c4.7.8 9.9 1.7 15.3 2.6l3 15.8c-5.5-.7-10.7-1.4-15.2-2.1zm18.6 19.9 3 16.2c-5.6-.8-10.8-1.5-15.2-2.1l-3-16.1c4.6.6 9.7 1.3 15.2 2zm4.6 16.4-3-16.2c4.9.7 10.1 1.3 15.3 2l3.1 16.2c-5.3-.6-10.5-1.3-15.4-2zm13.7-14c6 .8 12 1.5 17.8 2.2l3.1 16.4c-5.6-.7-11.6-1.6-17.8-2.4zm19.2 2.4c7 .8 13.5 1.6 19 2.1l3.7 16.9c-4.2-.5-11.2-1.4-19.5-2.5zm28.7 19.4-3.6-16.8c3.3.2 6.6.3 9.8.3h2.5l2.1 16c-4.4.3-8.2.5-10.8.5zm10.2-16.5c7.4-.2 14.2-.9 20-1.7l2.1 15.9c-6.5.6-13.8 1.2-20 1.7zm21.4-1.9c6.1-.9 10.9-1.9 13.8-2.6 1.4 6.9 2.2 12.7 2.7 17.2-3 .3-8.3.8-14.3 1.4zm4.2-36.2c-10.3.3-34.1 1.1-50.8 1.8-17 .7-75.6-11.1-90.6-14.2 5-3.3 35.6-6.9 55.6-6.1.7.3 1.4.3 2 .1 1.6.1 3.2.2 4.6.4 15 1.8 67.3 12.6 79.2 18zm-148.6-25c1-2.1 3-3.4 5.3-3.6l35.9-2c5.6-.3 11.1 2 14.9 6.2-7.5.1-16.3.5-24.4 1.2-8.2.8-24.2 2.3-29.2 7.2l-1.9-2.6c-1.4-1.9-1.6-4.3-.6-6.4zm16.4 51.3c3 .4 7.7 1.1 13.4 1.9l3 16.1c-5-.7-9-1.2-11.3-1.5-.1-.3-.2-.5-.3-.8-.9-3.6-2.8-9.3-4.8-15.7zm46.2 56.2c3.6 19.8 7.4 23.9 10.4 25.2.2.1.4.2.7.3-2 1.3-3.3 3.8-3.3 6.6 0 4.2 3 7.7 6.8 7.7 3.7 0 6.8-3.4 6.8-7.7 0-1.8-.6-3.5-1.5-4.8 5 .7 11.8 1.6 20.5 2.6 14.8 1.7 41.6 4.9 47.6 7.8-3.9 5-20.6 11.6-33.6 8.5-4.9-1.1-13.4-2.2-23.2-3.3-16-1.9-45.9-5.5-48.7-10.3-3.8-6.2-12-38.7-16-55.7 6.7 1.8 16.8 3.2 31 4.5.3 3.3 1.1 10.8 2.5 18.6zm7.2-23.7-1.5-8.2c6.2.8 12.2 1.6 17.8 2.4l1.4 7.3c-.9-.1-1.9-.1-2.8-.2-4.9-.5-9.9-.9-14.9-1.3zm19 1.5-1.3-7.2c8.5 1.1 15.6 2 19.6 2.5l1.4 6.6c-3.9-.6-10.8-1.2-19.7-1.9zm37.6 3.4-1.1-8.3c6.3-.5 13.5-1.1 20-1.7l1.2 9.4c-6.1.5-13.3.7-20.1.6zm34.2-2.9c-2.4 1-7 1.7-12.6 2.2l-1.2-9.4c6-.6 11.2-1.1 14.3-1.4.3 4.6.1 7.5-.5 8.6z" fill="#008363"/>
					// 	<path d="m62.7 182.7c-.6-17.1 6.4-22.5 12.5-22.5 5.5-.1 12.2.6 18.6-3.7.6-.4.6-1.3 0-1.7-4.3-2.3-9.8-4.4-14.6-3.8-5.9.8-10.5 5-13.2 7.7-.7.8-1.9-.1-1.4-1.1 2-4.7 5.3-6.4 8.2-9.1 3.5-3.2 9.2-5.2 13-8 5.8-4.5 9.4-10.8 12.8-17.4.4-.6-.1-1.4-.9-1.4-6.3.4-10.3 1.9-15.5 6.5-4.4 4-11.7 15.6-15.4 19.5-.7.7-1.9.1-1.5-.8 2.2-8 10.7-18.3 14.4-27.1 4.9-11.4 3.7-20.4.2-28.9-.3-.7-1.5-.8-1.7 0-2.4 11.1-10.8 13.3-13.7 40.5-.2 1.9-.6 6.4-1.2 6.9-.9.8-1.2 0-1.7-1.1-2.9-7.6-.6-47.2-22.1-60.2-.8-.4-1.7.2-1.4 1 6.4 23.1-9.2 26 21.6 67.8.1.2.4.6.5.8.8 2.1-.6 2.5-1.3 2.4-3.9-.5-18.9-27.6-48.90004-24.1-.8 0-1.1 1-.6 1.6 7.30004 8 15.00004 15.7 24.80004 19.8 6 2.6 14 3.1 19.6 6.6 5 3.1 7.7 9.6 6.1 15.2-.3.8-1.3 1.1-1.6.3-2.8-4.8-9.5-8.6-14.7-10.2-5.6-1.7-10.2-1.5-15.8-1.6-.8 0-1.2.9-.8 1.5 11.7 16.7 28.6 3.5 31 23.3 0 .3.3.7.6.8 3.3.9 6.5 1.8 6.4-1.7z" fill="#1c398e"/>
					// 	<path d="m76.8 180.1-33.1-1.1c-1.5-.1-1.4 1.2-1.2 2.6l6 30.5c.2 1.1 1.3 2 2.4 1.9l16.2.4c1-.1 1.7-.8 2-1.7l8.4-31.3c.3-.6-.1-1.2-.7-1.3z" fill="#da3404"/>
					// </svg>
					<div className='sadCart'>
						<div className='center'>
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
							<p>Your cart is Empty!</p>
						</div>
					</div>
				}
				</PageContainer>
			)
		}

		return (
		<PageContainer>
			{({ currency }) =>
				<div className='cartPage'>
					<div className='myBag'>
						<div>Cart</div>
						<div className='itemCounter'>{this.state.cart.length} items</div>
					</div>
					{this.state.cart.length != 0 && <Query
						query={products(this.state.cart.map(p => p.productRecord.id))}
					>
					{(result: QueryResult<any>) => {//TODO: typing?
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
										key={JSON.stringify(this.state.cart[index].productRecord.id)}
										brand={product.brand}
										name={product.name}
										link={`/${product.category}/${this.state.cart[index].productRecord.id}`}
										price={currency.symbol +
											product.prices.find(price =>
												price.currency.symbol == currency.symbol
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
										<div className='price'>{currency.symbol}{
											products.map(product =>
												product.prices.find(price =>
													price.currency.symbol == currency.symbol
												)?.amount ?? 0
											).reduce((a, b, index) => a + b * this.state.cart[index].count, 0).toFixed(2)
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