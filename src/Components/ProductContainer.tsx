import { QueryResult } from '@apollo/client'
import React from 'react'
import { Attribute, AttributeSet, Product as ProductType } from '../Types/ProductContainer'
import { PRODUCT } from '../Queries/ProductContainer'
import './ProductView.sass'
import { Loading, Error } from '../PureComponents'
import { Query } from '@apollo/client/react/components'

// TODO add search params

type Props = { id: string, currency: string }
type State = { selected: number[] }

type Props_ = { product: ProductType, price: string }
class Product extends React.Component<Props_, State> {
	constructor(props: Props_) {
		super(props)
		this.state = { selected: new Array(props.product.attributes.length).fill(0) }
	}

	changeAttribute(attrIndex: number, index: number) {
		this.state.selected[attrIndex] = index
		this.setState({selected: [...this.state.selected]})
	}

	attributeItemProps = (i: Attribute, attr: AttributeSet, attrIndex: number, index: number) => {
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
				{this.props.product.attributes.map((attr, attrIndex) => {
					return (
						<div className='attribute'>
							<div className='name'>{attr.name}: </div>
							<div className='attributeItems'>
								{
									attr.items.map((i, index) => (
										<div {...this.attributeItemProps(i, attr, attrIndex, index)}/>
									))
								}
							</div>
						</div>
					)
				})}
				<div className='priceName'>Price:</div>
				<div className='price'>{this.props.price}</div>
				<button className='addToCart'>Add to cart</button>
				<div className='description' dangerouslySetInnerHTML={{__html: this.props.product.description}} />
			</div>
		</div>
	)
}

class ProductContainer extends React.Component<Props> {
	render = () => (
		<main>
			<Query
				query={PRODUCT}
				variables={{productId: this.props.id}}
			>
			{(result: QueryResult<{ product: ProductType }>) => {
				const { loading, error, data } = result
				if (loading) return <Loading/>
				if (error) return <Error/>

				const price = data!.product.prices.find(price => price.currency.label == this.props.currency)
				return <Product product={data!.product} price={`${price?.currency.symbol}${price?.amount}`} />
			}}
			</Query>
		</main>
	)
}

export default ProductContainer