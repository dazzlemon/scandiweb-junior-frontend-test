import CategoryView from '../Components/CategoryView';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import React, { useEffect, useState } from 'react';

const GET_CATEGORY_NAMES = gql`
	query GetCategoryNames {
		categories {
			name
		}
	}
`;

type useCategoriesReturn = { status: 'error' | 'loading' | 'BadCategory'}
                         | { status: 'OK', categories: string[], categoryIndex: number }

const useCategories = (): useCategoriesReturn => {
	const { category } = useParams<{ category: string }>();
	const { loading, error, data } = useQuery<{categories: {name: string}[]}>(GET_CATEGORY_NAMES);
	const categories = data?.categories.map(category => category.name);
	
	const status = loading ? 'loading'
	             : error   ? 'error'
							 : 'OK';

	if (status !== 'OK') {
		return {status};
	}

	let categoryIndex = category ? categories!.indexOf(category) : 0;
	if (categoryIndex == -1) {
		return { status: 'BadCategory' };
	}

	return { status: 'OK', categories: categories!, categoryIndex}
}

const categoriesToProps = (categoriesQuery: useCategoriesReturn): {
	header: React.ComponentProps<typeof HeaderDesktopView>,
	category: React.ComponentProps<typeof CategoryView>
} | undefined => {
	if (categoriesQuery.status === 'BadCategory') {
		return
	}
	if (categoriesQuery.status !== 'OK') {
		const p = { status: categoriesQuery.status };
		return { header: p, category: p};
	}
	const { categories, categoryIndex } = categoriesQuery;
	return { 
		header: {
			status: 'OK',
			categories,
			categoryIndex
		},
		category: {
			status: 'OK',
			category: categories[categoryIndex]
		}
	}
}

const Category = () => {
	const categoriesQuery = useCategories();
	const props = categoriesToProps(categoriesQuery);
	if (!props) {
		return <div>No such category!</div>;
	}

	return (
		<>
			<HeaderDesktopView {...props.header} />
			<CategoryView {...props.category} />
		</>
	);
}

export default Category;