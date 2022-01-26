import React from 'react'
import { Product as ProductType } from '../pages/Product/ProductContainerTypes'
import { Attribute } from '../PureComponents'


type State = { selected: number[] }
type Props = { product: ProductType, price: string }

class Product extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { selected: new Array(props.product.attributes.length).fill(0) }
	}

	changeAttribute(attrIndex: number, index: number) {
		this.state.selected[attrIndex] = index
		this.setState({selected: [...this.state.selected]})
	}

	render = () => (
		<div className='productView'>
			<div className='productImagePreviews'>
				{this.props.product.gallery.map(i => <img src={i}/> )}
			</div>
			<img src={this.props.product.gallery[0] } className='productImage' />
			<div className='right'>
				<div className='productName'>{this.props.product.name}</div>
				{this.props.product.attributes.map((attr, attrIndex) => 
					<Attribute
						name={attr.name}
						type={attr.type}
						items={attr.items}
						selectedIndex={this.state.selected[attrIndex]}
						onChange={(index) => this.changeAttribute(attrIndex, index)}
					/>
				)}
				<div className='priceName'>Price:</div>
				<div className='price'>{this.props.price}</div>
				<button className='addToCart'>Add to cart</button>
				<div className='description' dangerouslySetInnerHTML={{__html: this.props.product.description}} />
			</div>
		</div>
	)
}

export default Product