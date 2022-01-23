import React           from 'react'
import { useParams }   from 'react-router'
import { Query }       from '@apollo/client/react/components'// TODO: migrate to urql
import { QueryResult } from '@apollo/client'

import { Product as ProductType }  from '../Types/ProductContainer'
import { PRODUCT }                 from '../Queries/ProductContainer'
import { Loading, Error, Product } from '../PureComponents'
import './ProductContainer.sass'

// TODO add search params
type Props = { currency: string }

const ProductContainer: React.FC<Props> = (props) => {
	const { productId } = useParams();// should be routed with it
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
				return <Product
					product={data.product}
					price={`${price?.currency.symbol}${price?.amount}`}
				/>
			}}
			</Query>
		</main>
	)
}

export default ProductContainer