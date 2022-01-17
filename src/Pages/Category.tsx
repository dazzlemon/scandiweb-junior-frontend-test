import CategoryView from '../Components/CategoryView';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import React, { useEffect, useState } from 'react';

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
	const { loading, error, data } = useQuery<{ categories: {name: string}[] }>(QUERY);

	const status = loading ? 'loading'
	             : error   ? 'error'
							 : 'OK';

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	const categories = data!.categories.map(category => category.name);
	let categoryIndex = categories.indexOf(category!);// this page is routed with :category

	return (
		<>
	 		<HeaderDesktopView status='OK' categories={categories} categoryIndex={categoryIndex} />
	 		<CategoryView status='OK' category={categories[categoryIndex]} />
		</>
	);
}

export default Category;