import React, { PureComponent } from 'react';
import ProductCardDesktop from './ProductCardDesktop';

type Props = {}

class ProductCardsList extends PureComponent {
	constructor(props: Props) {
		super(props);
		this.state = {  };
	}
	render() {
		return (
			<div>
				{
					(
						<ProductCardDesktop/>
					)
				}
			</div>
		);
	}
}

export default ProductCardsList;