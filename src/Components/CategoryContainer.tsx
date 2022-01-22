import { Component }        from 'react'
import { Query }            from '@apollo/client/react/components'// TODO: migrate to urql
import { QueryResult }      from '@apollo/client'

import { AttributeSet }             from '../Types/CategoryContainer'
import { Result, CATEGORY }         from '../Queries/CategoryContainer' 
import { Category, Error, Loading } from '../PureComponents'
import './CategoryView.sass'

type Props = {
	category: string,
	currencyLabel: string,
	onAddToCart: (id: string, attributes: AttributeSet[]) => void
}

class CategoryContainer extends Component<Props> {
	render = () => (
		<main>
			<div className='categoryTitle'>{this.props.category}</div>
			<Query
				query={CATEGORY}
				variables={{categoryName: this.props.category }}
			>
				{(result: QueryResult<Result>) => {
					const { loading, error, data } = result
					return loading ? <Loading/>
					     : error   ? <Error/>
							 : <Category
					        products={data!.category.products}
							    currencyLabel={this.props.currencyLabel}
					        onAddToCart={this.props.onAddToCart}
				         />
				}}
			</Query>
		</main>
	)
}

export default CategoryContainer