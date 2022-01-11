type Props = { id: string, name: string, gallery: string[] };

const ProductCard = (props: Props) => {
	return (
		<div 
			key={props.id}
			className='productCard'
		>
			<img className='productImage' src={props.gallery[0]} alt='product image'/>
			{props.name}
		</div>
	);
}

export default ProductCard;