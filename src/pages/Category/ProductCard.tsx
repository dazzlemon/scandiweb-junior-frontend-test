import { ReactComponent as ProductCart } from './ProductCart.svg';
import { ReactComponent as Heart }       from './Heart.svg';
import { Link } from 'react-router-dom';

type Props = {
	id: string,
	name: string,
	gallery: string[],
	price: number,
	currency: string,
	showHeart?: boolean
	onCartClick?: React.MouseEventHandler<SVGSVGElement>
};

const ProductCard = (props: Props) => {
	return (
		<Link to={props.id}
			className='productCard'
		>
			<div className='productImageContainer'>
				<img className='productImage' src={props.gallery[0]} alt='product image'/>
				{props.showHeart && <Heart className='productHeart' />}
				<ProductCart className='productCart' onClick={e => {
					e.preventDefault();// don't trigger parent's onClick
					props.onCartClick?.(e);
				}} />
			</div>
			<div className='productName'>{props.name}</div>
			<div className='productPrice'>{props.currency}{props.price}</div>
		</Link>
	);
}

export default ProductCard;