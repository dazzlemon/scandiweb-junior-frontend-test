import { useState } from 'react';
import { ReactComponent as CartIcon } from '../Icons/Cart.svg';

const Cart = () => {
	const [showOverlay, setShowOverlay] = useState(false);

	return (
		<div className='cart'>
			<CartIcon className='cartIcon' onClick={() => setShowOverlay(!showOverlay)}/>
			{showOverlay && (
				<>
					<div className='bgEffect'/>
					<div className='cartOverlay'>
						<div>
							Items
						</div>
						<div>
							Total
						</div>
						<div>
							Buttons
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default Cart;