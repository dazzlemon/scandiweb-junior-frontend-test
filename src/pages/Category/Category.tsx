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
					const price = prices.find(
						p => p.currency.label === this.props.currencyLabel) ?? prices[0];

					return <ProductCard
						key={id}
						id={id}
						name={name}
						gallery={gallery}
						price={price.amount}
						currency={price.currency.symbol}
						onCartClick={() => this.props.onAddToCart(id, attributes)}
						outOfStock={!inStock}
					/>
				})
			}
		</div>
		)
}

export default Category