import React from 'react'
import { Attribute as AttributeT, AttributeSet, AttributeType, Product as ProductType } from '../Types/ProductContainer'

type Props_ = {
	name: string
	type: AttributeType
	items: AttributeT[]
	selectedIndex: number
	onChange: (index: number) => void
}

class Attribute extends React.Component<Props_> {
	attributeItemProps = (i: AttributeT, index: number) => {
		const swatch = this.props.type == 'swatch'
		const selected = this.props.selectedIndex == index

		const typeProps = swatch ? { style: {backgroundColor: i.displayValue} }
		                         : { children: i.displayValue }

		return {
			className: this.props.type + (selected ? ' selected' : ''),
			onClick: () => this.props.onChange(index),
			...typeProps
		}
	}

	render = () => (
		<div className='attribute'>
			<div className='name'>{this.props.name}: </div>
			<div className='attributeItems'>
				{this.props.items.map((i, index) => 
					<div {...this.attributeItemProps(i, index)}/>
				)}
			</div>
		</div>
	)
}

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

	attributeItemProps = (i: AttributeT, attr: AttributeSet, attrIndex: number, index: number) => {
		return {
			className: (attr.type == 'swatch' ? 'swatch' : 'text' ) + 
				(this.state.selected[attrIndex] == index ? ' selected' : ''),
			onClick: () => this.changeAttribute(attrIndex, index),
			style: attr.type == 'swatch' ? {backgroundColor: i.displayValue} : undefined,
			children: attr.type == 'text' ? i.displayValue : ''
		}
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