import React           from 'react'
import { useParams }   from 'react-router'
import { Query }       from '@apollo/client/react/components'// TODO: migrate to urql
import { QueryResult } from '@apollo/client'

import Product from './Product'
import { Product as ProductType }  from './ProductContainerTypes'
import { PRODUCT }                 from './ProductContainerQueries'
import { Loading, Error } from '../../PureComponents'
import { addToCart }      from '../../util'
import './ProductContainer.sass'
import { useSearchParams } from 'react-router-dom'

// TODO add search params
type Props = { currency: string }

const ProductContainer: React.FC<Props> = (props) => {
	const { productId } = useParams();// should be routed with it

	const [searchParams, setSearchParams] = useSearchParams();
	return (
		<main>
			<Query
				query={PRODUCT}
				variables={{productId}}
			>
			{(result: QueryResult<{ product: ProductType }>) => {
				const { loading, error, data } = result
				if (loading) return <Loading/>
				// if bad productId it doesnt return Error but product is undef
				if (error || !data?.product) return <Error/>

				const price = data.product.prices.find(price =>
					price.currency.label == props.currency)// TODO: might be undef
				document.title = data.product.name// onComplete wasnt working as expected
				
				const selected = new Array(data.product.attributes.length).fill(0)
				data.product.attributes.forEach((attr, index) => {
					selected[index] = attr.items.findIndex(i => i.id == searchParams.get(attr.id))
					if (selected[index] == -1) {
						selected[index] = 0
					}
				});
				
				return <Product
					product={data.product}
					price={`${price?.currency.symbol}${price?.amount}`}
					onAddToCart={attributes => addToCart(productId!, attributes)}
					selected={selected}
					attributeChanged={(attrIndex, itemIndex) => {
						searchParams.set(
							data.product.attributes[attrIndex].id,
							data.product.attributes[attrIndex].items[itemIndex].id
						)
						setSearchParams(searchParams)
					}}
				/>
			}}
			</Query>
		</main>
	)
}

export default ProductContainer