import React from 'react'
import { Product as ProductType } from './ProductContainerTypes'
import { Attribute, Gallery }              from '../../components'

type State = { selected: number[] }
type Props = {
	product: ProductType
	price: string
	onAddToCart: (selectedAttributes: number[]) => void
	selected: number[]
	attributeChanged: (attrIndex: number, itemIndex: number) => void
}

class Product extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		// this.state = { selected: new Array(props.product.attributes.length).fill(0) }
		this.state = { selected: props.selected }
	}

	changeAttribute(attrIndex: number, index: number) {
		const selected = [...this.state.selected]
		selected[attrIndex] = index
		this.setState({selected})
		this.props.attributeChanged(attrIndex, index)
	}

	render = () => (
		<div className='productView'>
			<Gallery name={this.props.product.name} gallery={this.props.product.gallery} showPreviews/>
			<div className='right'>
				<div className='productName'>{this.props.product.name}</div>
				{this.props.product.attributes.map((attr, attrIndex) => 
					<Attribute
						// attr.name instead of attr.id, because their ids arent unique e.g. size,
						// and because of that apollo overrides these objects
						id={this.props.product.id + attr.name}
						key={this.props.product.id + attr.name}
						name={attr.name}
						type={attr.type}
						items={attr.items}
						selectedIndex={this.state.selected[attrIndex]}
						onChange={(index) => this.changeAttribute(attrIndex, index)}
					/>
				)}
				<div className='priceName'>Price:</div>
				<div className='price'>{this.props.price}</div>
				{
					this.props.product.inStock ?
						<button
							className='addToCart'
							onClick={() => this.props.onAddToCart(this.state.selected)}
						>
							Add to cart
						</button>
						: <div className='outOfStock'>Out of stock</div>
				}
				<div className='description' dangerouslySetInnerHTML={{__html: this.props.product.description}} />
			</div>
		</div>
	)
}

export default Product