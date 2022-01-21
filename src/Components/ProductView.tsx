import {
	gql,
	QueryResult,
	useQuery
} from '@apollo/client';
import './ProductView.sass';

type Currency = {
	label: string,
	symbol: string
}

type Price = {
	currency: Currency,
	amount: number
}

type Attribute = {
	displayValue: string,
	value: string,
	id: string
}

type AttributeSet = {
	id: string,
	name: string,
	type: string,
	items: [Attribute]
}

type Product = {
	id: string,
	name: string,
	inStock: boolean,
	gallery: [string],
	description: string,
	category: string,
	attributes: [AttributeSet]
	prices: [Price],
	brand: string
}

// TODO: types are direct copypaste from categoryView

const PRODUCT = gql`
  query GetProduct($productId: String!) {
		product(id: $productId) {
			name,
			inStock,
			gallery,
			description,
			category,
			attributes {
				id,
				name,
				type,
				items {
					displayValue,
					value,
					id
				}
			},
			prices {
				currency {
					label,
					symbol
				},
				amount
			},
			brand
		}
  }
`;

type Props = { id: string, currency: string }

const Product = (props: Props) => {
	const { loading, error, data } = useQuery<{ product: Product }>(PRODUCT, {
		variables: { productId: props.id }
	});
	if (loading) {
		return <p>Loading...</p>;
	}
	if (error) {
		return <p>{error.message}</p>;
	}
	const price = data!.product.prices.find(price => price.currency.label == props.currency);

	return (
		<div className='productView'>
			<div className='productImagePreviews'>
				{data!.product.gallery.map(i => <img src={i}/> )}
			</div>
			<img src={data!.product.gallery[0] } className='productImage' />
			<div className='right'>
				<div className='productName'>{data!.product.name}</div>
				{data!.product.attributes.map(attr => {
					return (
						<div className='attribute'>
							<div className='name'>{attr.name}: </div>
							<div className='attributeItems'>
								{ attr.type == 'text'   ? attr.items.map(i => <div>{i.displayValue}</div> )
								: attr.type == 'swatch' ? attr.items.map(
									i => <div className='swatch' style={{backgroundColor: i.value}} />)
								: null // idk what other types could be?
								}
							</div>
						</div>
					);
				})}
				<div className='priceName'>Price:</div>
				<div className='price'>{price?.currency.symbol}{price?.amount}</div>
				<button className='addToCart'>Add to cart</button>
				<div className='description' dangerouslySetInnerHTML={{__html: data!.product.description}} />
			</div>
		</div>
	);
}

export default Product;