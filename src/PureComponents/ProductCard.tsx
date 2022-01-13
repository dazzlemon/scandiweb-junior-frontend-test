import { ReactComponent as ProductCart } from '../Icons/ProductCart.svg';
import { ReactComponent as Heart } from '../Icons/Heart.svg';

type Props = {
	id: string,
	name: string,
	gallery: string[],
	price: number,
	currency: string,
	onClick?: React.MouseEventHandler<HTMLDivElement>
	showHeart?: boolean
};

const ProductCard = (props: Props) => {
	return (
		<div 
			key={props.id}
			className='productCard'
			onClick={props.onClick}
		>
			<div className='productImageContainer'>
				<img className='productImage' src={props.gallery[0]} alt='product image'/>
				{props.showHeart && <Heart className='productHeart' />}
				<ProductCart className='productCart' />
			</div>
			<div className='productName'>{props.name}</div>
			<div className='productPrice'>{props.currency}{props.price}</div>
		</div>
	);
}

export default ProductCard;