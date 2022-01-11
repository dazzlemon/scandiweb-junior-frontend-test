import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

const GET_CATEGORY_NAMES = gql`
	query GetCategoryNames {
		categories {
			name
		}
	}
`;

const HeaderDesktop = () => {
	const { category } = useParams<{ category: string }>();
	const { loading, error, data } = useQuery<{categories: {name: string}[]}>(GET_CATEGORY_NAMES);
	const status = loading ? 'loading'
	             : error   ? 'error'
	             : null;
	if (status) {
		return <HeaderDesktopView status={status}/>
	}

	const categoryNames = data!.categories.map(category => category.name);
	if (!category) {
		return <HeaderDesktopView status='OK' categoryNames={categoryNames} categoryIndex={0}/>
	}
	const categoryIndex = categoryNames.indexOf(category);
	if (categoryIndex == -1) {
		return <div>No such category</div>
	}
	return <HeaderDesktopView status='OK' categoryNames={categoryNames} categoryIndex={categoryIndex}/>
}

export default HeaderDesktop;