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

const Category = () => {
	const { category } = useParams<{ category: string }>();
	const { loading, error, data } = useQuery<{categories: {name: string}[]}>(GET_CATEGORY_NAMES);
	const categories = data?.categories.map(category => category.name);
	
	const status = loading ? 'loading'
	             : error   ? 'error'
							 : 'OK';

	let propsHeader: React.ComponentProps<typeof HeaderDesktopView> = { status: 'error' };
	let propsCategory: React.ComponentProps<typeof CategoryView> = { status: 'error' };
	if (status !== 'OK') {
		propsHeader = { status };
		propsCategory = { status };
	} else {
		let categoryIndex = category ? categories!.indexOf(category) : 0;
		
		if (categoryIndex == -1) {
			propsHeader = { status: 'error'};
			propsCategory = { status: 'error'};
		} else {
			propsHeader = {
				status: 'OK',
				categoryNames: categories!,
				categoryIndex
			};
			propsCategory = { status: 'OK', category: categories![categoryIndex] };
		}
	}

	return (
		<>
			<HeaderDesktopView {...propsHeader} />
			<CategoryView {...propsCategory} />
		</>
	);
}

export default Category;