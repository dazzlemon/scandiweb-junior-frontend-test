import { gql } from '@apollo/client'

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
