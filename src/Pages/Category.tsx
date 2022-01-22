import CategoryContainer from '../Components/CategoryContainer';
import { useParams, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import React, { useState } from 'react';
import { equal, getCart, setCart }  from '../util'
import { AttributeSet }             from '../Types/CategoryContainer'

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

	const	addToCart = (id: string, attributes: AttributeSet[]) => {
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
				onAddToCart={addToCart}
			/>
		</>
	);
}

export default Category;