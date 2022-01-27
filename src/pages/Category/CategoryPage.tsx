import CategoryContainer from './CategoryContainer'
import { addToCart }     from '../../util'
import PageContainer     from '../../components/PageContainer'

const Category = () => (
	<PageContainer>
		{({categories, categoryIndex, currencyIndex, currencies}) =>
			<CategoryContainer
				category={categories[categoryIndex]}
				currencyLabel={currencies[currencyIndex]?.label ?? 'USD'}
				onAddToCart={
					(id, selectedAttributes) =>
						addToCart(id,
							new Array<number>(selectedAttributes.length).fill(0))
				}
			/>
		}
	</PageContainer>
)

export default Category