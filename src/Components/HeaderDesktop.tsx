import React, { Component } from 'react';
import HeaderDesktopView from '../PureComponents/HeaderDesktopView';
import {
	ApolloError,
	gql,
	QueryResult
} from '@apollo/client';

// deprecated, but idk if any alternatives even exist,
// everything I found was for functional react
import { Query } from '@apollo/client/react/components';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const categoryNamesQueryToView = (result: QueryResult<{
	categories: CategoryName[]
}>) => {
	console.log('render');
	const { loading, error, data } = result;
	const status = loading ? 'loading'
	             : error   ? 'error'
	             : null;
	// with below it wont update
	if (status) {
		return <HeaderDesktopView status={status} />;
	}
	if (loading) {// but with this it does
		// return <HeaderDesktopView status='loading' />;// doesnt update
		return <p>Loading...</p>;// updates
	}
	if (error) {
		return <HeaderDesktopView status='error' />
	}
	console.log('query completed');
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