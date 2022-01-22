import CategoryContainer from '../Components/CategoryContainer';
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

	const [currencyLabel, setCurrencyLabel] = useState(localStorage.getItem('currency'));

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>{error.message}</div>;
	}
	if (!currencyLabel) {
		setCurrencyLabel(data!.currencies[0].label);
	}

	const categories = data!.categories.map(category => category.name);
	const categoryIndex = categories.indexOf(category!);// this page is routed with :category

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
	 		<CategoryContainer
				category={categories[categoryIndex]}
				currencyLabel={data!.currencies[currencyIndex]?.label ?? 'USD'}
			/>
		</>
	);
}

export default Category;