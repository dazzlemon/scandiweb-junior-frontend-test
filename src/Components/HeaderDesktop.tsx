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
	const { loading, error, data } = result;
	// with below it wont update
	// const status = loading ? 'loading'
	//              : error   ? 'error'
	//              : null;
	// if (status) {
	// 	return <>
	// 		<HeaderDesktopView status={status} />
	// 	</>;
	// }
	// but with this it does
	if (loading) {
		return <p>Loading...</p>;
	}
	if (error) {
		return <p>Error :(</p>;
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
type State = { status: 'loading' | 'error' }
					 | { status: 'OK', categoryNames: string[]}

class HeaderDesktop extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { status: 'loading' };
	}

	render() {
		if (this.state.status === 'OK') {
			return <HeaderDesktopView status='OK' categoryNames={this.state.categoryNames} />;
		}
		if (this.state.status === 'error') {
			return <HeaderDesktopView status={'error'} />;
		}
		return (
			<Query query={GET_CATEGORY_NAMES}>
				{categoryNamesQueryToView}
			</Query>
		);
	}
}

export default HeaderDesktop;