import { QueryResult } from '@apollo/client'
import React from 'react'
import { Attribute, AttributeSet, Product } from '../Types/ProductContainer'
import { PRODUCT } from '../Queries/ProductContainer'
import './ProductView.sass'
import { Loading, Error } from '../PureComponents'
import { Query } from '@apollo/client/react/components'

// TODO add search params

type Props = { id: string, currency: string }
type State = { selected: number[] }

class ProductContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { selected: [] }
	}

	changeAttribute(attrIndex: number, index: number) {
		this.state.selected[attrIndex] = index
		this.setState({selected: [...this.state.selected]})
	}

	attributeItemProps(i: Attribute, attr: AttributeSet, attrIndex: number, index: number) {
		return {
			className: (attr.type == 'swatch' ? 'swatch' : 'text' ) + 
				(this.state.selected[attrIndex] == index ? ' selected' : ''),
			onClick: () => this.changeAttribute(attrIndex, index),
			style: attr.type == 'swatch' ? {backgroundColor: i.displayValue} : undefined,
			children: attr.type == 'text' ? i.displayValue : ''
		}
		return 
	}

	render() {
		return (
			<main>
				<Query
					query={PRODUCT}
					variables={{productId: this.props.id}}
					onCompleted={(data: { product: Product }) =>
						this.setState({
							selected: new Array<number>(data.product.attributes.length ?? 0).fill(0)
						})
					}
				>
				{(result: QueryResult<{ product: Product }>) => {
					const { loading, error, data } = result
					if (loading) return <Loading/>
					if (error) return <Error/>

					const price = data!.product.prices.find(price => price.currency.label == this.props.currency)
					return (
						<div className='productView'>
							<div className='productImagePreviews'>
								{data!.product.gallery.map(i => <img src={i}/> )}
							</div>
							<img src={data!.product.gallery[0] } className='productImage' />
							<div className='right'>
								<div className='productName'>{data!.product.name}</div>
								{data!.product.attributes.map((attr, attrIndex) => {
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
								<div className='price'>{price?.currency.symbol}{price?.amount}</div>
								<button className='addToCart'>Add to cart</button>
								<div className='description' dangerouslySetInnerHTML={{__html: data!.product.description}} />
							</div>
						</div>
					)
				}}
				</Query>
			</main>
		)
	}
}

export default ProductContainer