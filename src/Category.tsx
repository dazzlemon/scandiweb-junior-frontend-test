import React, { PureComponent } from 'react';
import HeaderDesktop from './HeaderDesktop';
// import CategoryTitle from './CategoryTitle';
import ProductCardsList from './ProductCardsList';

type Props = {}

class Category extends PureComponent {
	constructor(props: Props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<>
				{/* <HeaderDesktop/> */}
				{/* <CategoryTitle/> */}
				<ProductCardsList/>
			</>
		);
	}
}

export default Category;