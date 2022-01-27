import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
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

export type CompleteQuery = {
	state: 'complete',
	categories: string[],
	categoryIndex: number,
	currencies: {
    label: string;
    symbol: string;
	}[],
	changeCurrency: (index: number) => void,
	currencyIndex: number
}

type QueryResult = CompleteQuery | { state: 'error' | 'loading' }

export const useCategoriesCurrencies = (category: string): QueryResult => {
	const { loading, error, data } = useQuery<{
		categories: {name: string}[],
		currencies: {label: string, symbol: string}[]
	}>(QUERY)
	const [currencyLabel, setCurrencyLabel] = useState(localStorage.getItem('currency'))

	if (loading) return { state: 'loading' }
	if (error) return { state: 'error' }

	const currencies = data!.currencies
	const changeCurrency = (index: number) => {
		localStorage.setItem('currency', currencies[index].label)
		setCurrencyLabel(currencies[index].label)
	}
	if (!currencyLabel) {
		changeCurrency(0)
	}

	const categories = data!.categories.map(category => category.name)
	const categoryIndex = categories.indexOf(category!)// this page is routed with :category
	const currencyIndex = currencyLabel
		? currencies.findIndex(currency => currency.label === currencyLabel)
		: 0// TODO: may be -1?
	return {
		state: 'complete',
		categories,
		categoryIndex,
		currencies,
		changeCurrency,
		currencyIndex
	}
}