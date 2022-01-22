import { Component }        from 'react'
import { Query }            from '@apollo/client/react/components'// TODO: migrate to urql
import { QueryResult }      from '@apollo/client'

import { AttributeSet }             from '../Types/CategoryContainer'
import { equal, getCart, setCart }  from '../util'
import { Result, CATEGORY }         from '../Queries/CategoryContainer' 
import { Category, Error, Loading } from '../PureComponents'
import './CategoryView.sass'

type Props = { category: string, currencyLabel: string }

class CategoryContainer extends Component<Props> {
	addToCart(id: string, attributes: AttributeSet[]) {
		const cart = getCart()
		const newProduct = {
			id,
			selectedAttributes: new Array<number>(attributes.length).fill(0)
		}
		if (!cart.find(p => equal(p, newProduct))) {
			cart.push(newProduct)
		}
		setCart(cart)
	}

	render = () => (
		<main>
			<div className='categoryTitle'>{this.props.category}</div>
			<Query
				query={CATEGORY}
				variables={{categoryName: this.props.category }}
			>
				{(result: QueryResult<Result>) => {
					const { loading, error, data } = result
					if (loading) return <Loading/>
					if (error) return <Error/>
					return <Category
						products={data!.category.products}
						currencyLabel={this.props.currencyLabel}
						onAddToCart={this.addToCart}
					/>
				}}
			</Query>
		</main>
	)
}

export default CategoryContainer