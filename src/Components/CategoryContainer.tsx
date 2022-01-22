import { Component } from 'react';
import {
	gql,
	QueryResult
} from '@apollo/client';
import './CategoryView.sass';
import Category from '../PureComponents/Category';
import { Navigate } from 'react-router-dom';

// deprecated, but idk if any alternatives even exist,
// everything I found was for functional react
import { Query } from '@apollo/client/react/components';

import { AttributeSet, Product } from '../Types/CategoryContainer';

type Props = { category: string, currencyLabel: string }

const CATEGORY = gql`
  query GetCategories($categoryName: String!) {
		category(input: {
			title: $categoryName
		}) {
			products {
				id,
				name,
				inStock,
				gallery,
				description,
				category,
				attributes {
					id,
					name,
					type,
					items {
						displayValue,
						value,
						id
					}
				},
				prices {
					currency {
						label,
						symbol
					},
					amount
				},
				brand
			}
		}
  }
`;

type Result = {
	category: {
		products: Product[]
	}
}

type ProductRecord = {
	id: string,
	selectedAttributes: number[]
}

const Loading = () => <p>Loading...</p>
const Error = () =>	<p>Error</p>

class CategoryContainer extends Component<Props> {
	addToCart(id: string, attributes: AttributeSet[]) {
		// localStorage might be empty
		const cart: ProductRecord[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
		const newProduct: ProductRecord = {
			id: id,
			selectedAttributes: new Array<number>(attributes.length).fill(0)
		};
		if (!cart.find(p => p.id == newProduct.id
										 && JSON.stringify(p.selectedAttributes)
											 == JSON.stringify(newProduct.selectedAttributes))) { // TODO: add actual comparison
			cart.push(newProduct);
		}
		localStorage.setItem('cart', JSON.stringify(cart));
	}

	render() {
		return (
			<main>
				<div className='categoryTitle'>{this.props.category}</div>
				<Query
					query={CATEGORY}
					variables={{categoryName: this.props.category }}
				>
					{(result: QueryResult<Result>) => {
						const { loading, error, data } = result;
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
		);
	}
}

export default CategoryContainer;