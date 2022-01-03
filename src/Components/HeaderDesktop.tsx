import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import { gql } from '@apollo/client';

// deprecated, but idk if any (not deprecated) alternatives even exist
// (besides hooks which are prohibited)
import { ChildDataProps, graphql } from '@apollo/client/react/hoc';

const GET_CATEGORY_NAMES = gql`
	query GetCategoryNames {
		categories {
			name
		}
	}
`;

type CategoryName = { name: string }
type InputProps   = {}
type Response     = { categories: CategoryName[] }
type Variables    = {}
type ChildProps   = ChildDataProps<InputProps, Response, Variables>

const withCategoryNames = graphql<InputProps, Response, Variables, ChildProps>(GET_CATEGORY_NAMES);
export default withCategoryNames(({ data: { loading, error, categories } }) => {
	const status = loading ? 'loading'
	             : error   ? 'error'
	             : null;
	if (status) {
		return <HeaderDesktopView status={status}/>;
	}

	let categoryNames = categories!.map(category => category.name);
	return <HeaderDesktopView status='OK' categoryNames={categoryNames} />;
});