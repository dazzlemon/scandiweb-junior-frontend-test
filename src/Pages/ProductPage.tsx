import ProductContainer from '../Components/ProductContainer'
import PageContainer     from '../Components/PageContainer'

const ProductPage = () => (
	<PageContainer>
		{({currencyIndex, currencies}) =>
			<ProductContainer
				currency={currencies[currencyIndex].label}
			/>
		}
	</PageContainer>	
)

export default ProductPage