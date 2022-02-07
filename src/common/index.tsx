import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Currency } from './types'

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
	currencies: Currency[],
	changeCurrency: (index: number) => void,
	currencyIndex: number
	currency: Currency// just a shortcut for currencies[currencyIndex]
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

	let currencyIndex = currencies.findIndex(currency => currency.label === currencyLabel);
	if (currencyIndex == -1) {// just in case
		currencyIndex = 0;
	}

	return {
		state: 'complete',
		categories,
		categoryIndex,
		currencies,
		changeCurrency,
		currencyIndex,
		currency: currencies[currencyIndex]
	}
}