import React           from 'react'
import { Query }       from '@apollo/client/react/components'// TODO: migrate to urql
import { QueryResult } from '@apollo/client'

import { Product as ProductType }  from '../Types/ProductContainer'
import { PRODUCT }                 from '../Queries/ProductContainer'
import { Loading, Error, Product } from '../PureComponents'
import './ProductView.sass'

// TODO add search params
type Props = { id: string, currency: string }

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