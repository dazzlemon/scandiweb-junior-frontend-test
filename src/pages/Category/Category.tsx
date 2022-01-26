import React from 'react'

import { ProductCard }  from './ProductCard'
import { Product }      from './CategoryContainerTypes'
import { AttributeSet } from '../../common/types'

type Props = {
	products: Product[]
	currencyLabel: string,
	onAddToCart: (id: string, attributes: AttributeSet[]) => void
}

class Category extends React.Component<Props> {
	render = () => (
		<div className='productCardsList'>
			{
				this.props.products.map(({ id, name, gallery, prices, attributes, inStock }) => {
					const priceIndex = prices.findIndex(
						price => price.currency.label == this.props.currencyLabel);// TODO: may return -1 so needs rework
					
					return <ProductCard
						id={id}
						name={name}
						gallery={gallery}
						price={prices[priceIndex].amount}
						currency={prices[priceIndex].currency.symbol}
						onCartClick={() => this.props.onAddToCart(id, attributes)}
						outOfStock={!inStock}
					/>
				})
			}
		</div>
		)
}

export default Category