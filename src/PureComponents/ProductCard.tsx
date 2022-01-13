type Props = {
	id: string,
	name: string,
	gallery: string[],
	price: number,
	currency: string,
	onClick?: React.MouseEventHandler<HTMLDivElement>
};

const ProductCard = (props: Props) => {
	return (
		<div 
			key={props.id}
			className='productCard'
			onClick={props.onClick}
		>
			<img className='productImage' src={props.gallery[0]} alt='product image'/>
			<div className='productName'>{props.name}</div>
			<div className='productPrice'>{props.currency}{props.price}</div>
		</div>
	);
}

export default ProductCard;