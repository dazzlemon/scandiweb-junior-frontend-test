import { Component }        from 'react'
import { Query }            from '@apollo/client/react/components'// TODO: migrate to urql
import { QueryResult }      from '@apollo/client'

import { AttributeSet }     from '../../common/types'
import { Result, CATEGORY } from './CategoryContainerQuery' 
import { Error, Loading }   from '../../PureComponents'
import Category             from './Category'

import './CategoryContainer.sass'

type Props = {
	category: string,
	currencyLabel: string,
	onAddToCart: (id: string, attributes: AttributeSet[]) => void
}

class CategoryContainer extends Component<Props> {
	render = () => (
		<>
			<div className='categoryTitle'>{this.props.category}</div>
			<Query
				query={CATEGORY}
				variables={{categoryName: this.props.category}}
				onCompleted={() =>
					document.title = this.props.category.replace(/^\w/, c => c.toUpperCase())}
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
		</>
	)
}

export default CategoryContainer