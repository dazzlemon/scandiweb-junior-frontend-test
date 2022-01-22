import ProductCard from './ProductCard';
import { AttributeSet, Product } from '../Types/CategoryContainer';

type Props = {
	products: Product[]
	currencyLabel: string,
	onAddToCart: (id: string, attributes: AttributeSet[]) => void
}

const Category = (props: Props) => (
	<div className='productCardsList'>
		{
			props.products.map(({ id, name, gallery, prices, attributes }) => {
				const priceIndex = prices.findIndex(
					price => price.currency.label == props.currencyLabel);// TODO: may return -1 so needs rework

				return <ProductCard
					id={id}
					name={name}
					gallery={gallery}
					price={prices[priceIndex].amount}
					currency={prices[priceIndex].currency.symbol}
					onCartClick={() => props.onAddToCart(id, attributes)}
				/>
			})
		}
	</div>
)

export default Category;