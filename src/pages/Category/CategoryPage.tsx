import CategoryContainer from './CategoryContainer'
import { addToCart }     from '../../util'
import PageContainer     from '../../components/PageContainer'
import React from 'react'

class Category extends React.Component {
	render = () => (
		<PageContainer>
			{({ categories, categoryIndex, currency }) =>
				<CategoryContainer
					category={categories[categoryIndex]}
					currencyLabel={currency.label}
					onAddToCart={
						(id, selectedAttributes) =>
							addToCart(id,
								new Array<number>(selectedAttributes.length).fill(0))
					}
				/>
			}
		</PageContainer>
	)
}

export default Category