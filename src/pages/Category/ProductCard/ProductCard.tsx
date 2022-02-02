import { ReactComponent as ProductCart } from './ProductCart.svg';
import { ReactComponent as Heart }       from './Heart.svg';
import { Link } from 'react-router-dom';
import React from 'react';

type Props = {
	id: string,
	name: string,
	gallery: string[],
	price: number,
	currency: string,
	showHeart?: boolean
	outOfStock?: boolean
	onCartClick?: React.MouseEventHandler<SVGSVGElement>
};

class ProductCard extends React.Component<Props> {
	render = () => (
		<Link to={this.props.id}
			className={'productCard' + (this.props.outOfStock ? ' outOfStock' : '')}
		>
			<div className='productImageContainer'>
				<img className='productImage' src={this.props.gallery[0]} alt='product image'/>
				{this.props.outOfStock && <p className='outOfStock'>Out of stock</p>}
				{this.props.showHeart && <Heart className='productHeart' />}
				<ProductCart className='productCart' onClick={e => {
					e.preventDefault();// don't trigger parent's onClick
					this.props.onCartClick?.(e);
				}} />
			</div>
			<div className='productName'>{this.props.name}</div>
			<div className='productPrice'>{this.props.currency}{this.props.price}</div>
		</Link>
	)
}

export default ProductCard;