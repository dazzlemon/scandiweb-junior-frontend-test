import ProductContainer from './ProductContainer'
import PageContainer    from '../../components/PageContainer'

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