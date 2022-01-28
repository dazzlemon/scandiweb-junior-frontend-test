import PageContainer from '../components/PageContainer'
import { Cart as CartContainer } from '../PureComponents/Cart'

const Cart = () => {
	document.title = 'Cart'
	return (
		<PageContainer>
			{({currencies, currencyIndex}) =>
				<div>Cart page</div>
			}
		</PageContainer>
	)
}

export default Cart