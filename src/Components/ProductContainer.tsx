import { QueryResult, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Product } from '../Types/ProductContainer'
import { PRODUCT } from '../Queries/ProductContainer'
import './ProductView.sass'
import { Loading, Error } from '../PureComponents'
import { render } from '@testing-library/react'
import { Query } from '@apollo/client/react/components'

type Props = { id: string, currency: string }
type State = { selected: number[] }

class ProductContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { selected: [] }
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
												{ attr.type == 'text' ? attr.items.map((i, index) => {
													return (
														<div
															className={this.state.selected[attrIndex] == index ? 'selected' : undefined}
															onClick={_ => {
																this.state.selected[attrIndex] = index
																this.setState({selected: [...this.state.selected]})
															}}
														>
															{i.displayValue}
														</div>
													) 
												})
												: attr.type == 'swatch' ? attr.items.map(
													(i, index) => <div
														style={{backgroundColor: i.value}}
														className={this.state.selected[attrIndex] == index ? 'swatch selected' : 'swatch'}
														onClick={_ => {
															this.state.selected[attrIndex] = index
															this.setState({selected: [...this.state.selected]})
														}}
													/>)
												: null // idk what other types could be?
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