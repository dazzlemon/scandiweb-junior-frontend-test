import React, { Component } from 'react';
import {
	gql,
	QueryResult
} from '@apollo/client';
import './CategoryView.sass';
import ProductCard from '../PureComponents/ProductCard';
import { Navigate } from 'react-router-dom';

// deprecated, but idk if any alternatives even exist,
// everything I found was for functional react
import { Query } from '@apollo/client/react/components';

type Currency = {
	label: string,
	symbol: string
}

type Price = {
	currency: Currency,
	amount: number
}

type Attribute = {
	displayValue: string,
	value: string,
	id: string
}

type AttributeSet = {
	id: string,
	name: string,
	type: string,
	items: [Attribute]
}

type Product = {
	id: string,
	name: string,
	inStock: boolean,
	gallery: [string],
	description: string,
	category: string,
	attributes: [AttributeSet]
	prices: [Price],
	brand: string
}

type Props = { status: 'error' | 'loading' } 
           | { status: 'OK', category: string }
type State = { productId?: string }

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

class CategoryView extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	goToProductPage(id: string) {
		this.setState({ productId: id });
	}

	render() {
		if (this.props.status !== 'OK') {
			return <div>{this.props.status}</div>;
		}
		if (this.state?.productId) {
			return <Navigate to={`${this.state.productId}`} />;
		}

		return (
			<main>
				<div className='categoryTitle'>{this.props.category}</div>
				<Query
					query={CATEGORY}
					variables={{categoryName: this.props.category }}
				>
					{(result: QueryResult<{ category: { products: Product[]} }>) => {
						const { loading, error, data } = result;
						if (loading) {
							return <p>Loading...</p>;
						}
						if (error) {
							return <p>Error :(</p>;
						}
					
						return (
							<div className='productCardsList'>
								{
									data!.category.products.map(({ id, name, gallery, prices }) => (
										<ProductCard
											id={id}
											name={name}
											gallery={gallery}
											price={prices[0].amount}
											currency={prices[0].currency.symbol}
											onClick={() => this.goToProductPage(id)}
										/>
									))
								}
							</div>
						);
					}}
				</Query>
			</main>
		);
	}
}

export default CategoryView;