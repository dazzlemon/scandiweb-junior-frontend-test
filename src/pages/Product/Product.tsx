import React from 'react'
import { Product as ProductType } from './ProductContainerTypes'
import { Attribute }              from '../../PureComponents'


type Props_ = { gallery: string[] }
type State_ = { index: number }
class Gallery extends React.Component<Props_, State_> {
	constructor(props: Props_) {
		super(props)
		this.state = { index: 0 }
	}

	render = () => (
		<>
			<div className='productImagePreviews'>
					{this.props.gallery.map((i, index) =>
						<img
							src={i}
							onClick={() => this.setState({ index })}
						/>
					)}
				</div>
			<img src={this.props.gallery[this.state.index] } className='productImage' />
		</>
	)
}

type State = { selected: number[] }
type Props = {
	product: ProductType
	price: string
	onAddToCart: (selectedAttributes: number[]) => void
}

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
			<Gallery gallery={this.props.product.gallery} />
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