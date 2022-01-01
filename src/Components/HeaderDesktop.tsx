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
type State = { queryCompleted: false }
					 | { queryCompleted: true, categoryNames: string[]}

class HeaderDesktop extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { queryCompleted: false };
	}
	render() {
		if (this.state.queryCompleted) {
			return <HeaderDesktopView status='OK' categoryNames={this.state.categoryNames} />;
		}
		return (
			<Query
				query={GET_CATEGORY_NAMES}
				onCompleted={(data: {
					categories: CategoryName[]
				}) => {
					this.setState({
						queryCompleted: true,
						categoryNames: data!.categories.map((category: CategoryName) => category.name)
					})
				}}
			>
				{categoryNamesQueryToView}
			</Query>
		);
	}
}

export default HeaderDesktop;