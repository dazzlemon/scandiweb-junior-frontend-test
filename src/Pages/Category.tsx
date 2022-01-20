import CategoryView from '../Components/CategoryView';
import { useParams, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import React, { useState } from 'react';

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
`;

const Category: React.FC = () => {
	const { category } = useParams<{ category: string }>();
	const { loading, error, data } = useQuery<{
		categories: {name: string}[],
		currencies: {label: string, symbol: string}[]
	}>(QUERY);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>{error.message}</div>;
	}

	const categories = data!.categories.map(category => category.name);
	const categoryIndex = categories.indexOf(category!);// this page is routed with :category

	const [currencyLabel, setCurrencyLabel] = useState(localStorage.getItem('currency') ??
		data!.currencies[0].label);

	const changeCurrency = (index: number) => {
		localStorage.setItem('currency', data!.currencies[index].label);
		setCurrencyLabel(data!.currencies[index].label);
	}

	const currencyIndex = currencyLabel
		? data!.currencies.findIndex(currency => currency.label === currencyLabel)
		: 0;// TODO: may be -1?

	return (
		<>
	 		<HeaderDesktopView
				categories={categories}
				categoryIndex={categoryIndex}
				currencies={data!.currencies}
				onCurrencyChange={changeCurrency}
				currencyIndex={currencyIndex}
			/>
	 		<CategoryView
				category={categories[categoryIndex]}
				currencyLabel={data!.currencies[currencyIndex]?.label ?? 'USD'}
			/>
		</>
	);
}

export default Category;