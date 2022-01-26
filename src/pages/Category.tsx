import CategoryContainer from '../Components/CategoryContainer'
import { addToCart }     from '../util'
import PageContainer     from '../Components/PageContainer'

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