import CategoryView from '../Components/CategoryView';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import React from 'react';

const GET_CATEGORY_NAMES = gql`
	query GetCategoryNames {
		categories {
			name
		}
	}
`;

const use = (
	category: string | undefined,
	loading: boolean,
	error: boolean,
	data: {categories: {name: string}[]} | undefined
): React.ComponentProps<typeof HeaderDesktopView> => {
	const status = loading ? 'loading'
	             : error   ? 'error'
	             : null;
	if (status) {
		return {status};
	}

	const categoryNames = data!.categories.map(category => category.name);
	if (!category) {
		return { status: 'OK', categoryNames, categoryIndex: 0 };
	}
	const categoryIndex = categoryNames.indexOf(category);
	if (categoryIndex == -1) {
		return { status: 'error' };// TODO
	}
	return { status: 'OK', categoryNames, categoryIndex };
}

const headerToCategoryProps = (
	props: React.ComponentProps<typeof HeaderDesktopView>
): React.ComponentProps<typeof CategoryView> => {
	if (props.status !== 'OK') {
		return props;
	}
	return { status: 'OK', category: props.categoryNames[props.categoryIndex] };
}

const Category = () => {
	const { category } = useParams<{ category: string }>();
	const { loading, error, data } = useQuery<{categories: {name: string}[]}>(GET_CATEGORY_NAMES);
	
	const propsHeader = use(category, loading, error !== undefined, data);
	const propsCategory = headerToCategoryProps(propsHeader);

	return (
		<>
			<HeaderDesktopView {...propsHeader} />
			<CategoryView {...propsCategory} />
		</>
	);
}

export default Category;