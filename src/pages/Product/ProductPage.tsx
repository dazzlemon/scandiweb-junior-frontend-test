import ProductContainer from './ProductContainer'
import PageContainer    from '../../components/PageContainer'

const ProductPage = () => (
	<PageContainer>
		{({ currency }) =>
			<ProductContainer
				currency={currency.label}
			/>
		}
	</PageContainer>	
)

export default ProductPage