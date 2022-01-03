import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import { gql } from '@apollo/client';

// deprecated, but idk if any (not deprecated) alternatives even exist
// (besides hooks which are prohibited)
import { graphql, OptionProps } from '@apollo/client/react/hoc';

const GET_CATEGORY_NAMES = gql`
	query GetCategoryNames {
		categories {
			name
		}
	}
`;

type CategoryName = { name: string }
type Response     = { categories: CategoryName[] }
type Props        = React.ComponentProps<typeof HeaderDesktopView>

const queryResultToProps = (props: OptionProps<{}, Response>): Props => {
	const { loading, error, categories } = props.data!;
	const status = loading ? 'loading'
	             : error   ? 'error'
	             : null;
	if (status) {
		return { status };
	}
	const categoryNames = categories!.map(category => category.name);
	return { status: 'OK', categoryNames, categoryIndex: 0};
}

const withCategoryNames = graphql(GET_CATEGORY_NAMES, { props: queryResultToProps });
/** 
 * Fetches category names and represents them with HeaderDesktopView 
 * @see HeaderDesktopView
*/
export default withCategoryNames(HeaderDesktopView);