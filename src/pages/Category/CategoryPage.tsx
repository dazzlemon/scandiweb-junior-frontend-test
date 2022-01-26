import CategoryContainer from './CategoryContainer'
import { addToCart }     from '../../util'
import PageContainer     from '../../components/PageContainer'

const Category = () => (
	<PageContainer>
		{({categories, categoryIndex, currencyIndex, currencies}) =>
			<CategoryContainer
				category={categories[categoryIndex]}
				currencyLabel={currencies[currencyIndex]?.label ?? 'USD'}
				onAddToCart={addToCart}
			/>
		}
	</PageContainer>
)

export default Category