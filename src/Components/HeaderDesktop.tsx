import React, { Component } from 'react';
import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import {
	gql,
	QueryResult
} from '@apollo/client';

// deprecated, but idk if any alternatives even exist,
// everything I found was for functional react
import { Query } from '@apollo/client/react/components';

const categoryNamesQueryToView = (result: QueryResult<{
	categories: CategoryName[]
}>) => {
	const { loading, error, data } = result;
	const status = loading ? 'loading'
	             : error   ? 'error'
	             : null;
	if (status) {
		return <HeaderDesktopView status={status} />;
	}

	let categoryNames = data!.categories.map((category: CategoryName) => category.name);
	return <HeaderDesktopView status='OK' categoryNames={categoryNames} />;
}

const GET_CATEGORY_NAMES = gql`
	query GetCategoryNames {
		categories {
			name
		}
	}
`;

type CategoryName = {
	name: string
}

type Props = {}
type State = {}

class HeaderDesktop extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Query query={GET_CATEGORY_NAMES}>
				{categoryNamesQueryToView}
			</Query>
		);
	}
}

export default HeaderDesktop;