import { gql } from '@apollo/client'
import { Product } from '../pages/Category/CategoryContainerTypes';
import { AttributeSet, Price } from './types'

export type CategoryNamesAndCurrencies = {
	categories: {name: string}[],
	currencies: {label: string, symbol: string}[]
}
export const CATEGORY_NAMES_AND_CURRENCIES = gql`
	query GetCategoryNamesAndCurrencies {
		categories {
			name
		},
		currencies {
			label,
			symbol
		}
	}
`

export type CartProduct = {
	id: string
	name: string
	inStock: boolean
	gallery: string[]
	category: string
	attributes: AttributeSet[]
	prices: Price[]
	brand: string
}
export const MINICART_PRODUCT = gql`
	query GetMiniCartProduct($productId: String!) {
		product(id: $productId) {
			id
			name
			inStock
			gallery
			category
			attributes {
				name
				type
				items {
					displayValue
					value
					id
				}
			}
			prices {
				currency {
					label
					symbol
				}
				amount
			}
			brand
		}
	}
`
export const cartProduct = (name: string, id: string) => `
	${name}: product(id: "${id}") {
		id
		name
		inStock
		gallery
		category
		attributes {
			name
			type
			items {
				displayValue
				value
				id
			}
		}
		prices {
			currency {
				label
				symbol
			}
			amount
		}
		brand
	}
`
export const cartProducts = (ids: string[]) => {
	const query = `query GetProducts {
		${ids.map((i, index) => cartProduct('product'+index, i)).join('')}
	}`
	return gql(query)
};

export type Category = {
	category: {
		products: Product[]
	}
}
export const CATEGORY = gql`
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


export type ProductPageProduct = {
	id: string
	name: string
	inStock: boolean
	gallery: string[]
	description: string
	category: string
	attributes: AttributeSet[]
	prices: Price[]
	brand: string
}
export const PRODUCTPAGE_PRODUCT = gql`
  query GetProduct($productId: String!) {
		product(id: $productId) {
			id
			name,
			inStock,
			gallery,
			description,
			category,
			attributes {
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
`;