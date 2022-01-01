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
			<Query
				query={GET_CATEGORY_NAMES}
				// it wasn't updating otherwise idk if it's intended
				onCompleted={(data: {
					categories: CategoryName[]
				}) => this.setState({
					status: 'OK',
					categoryNames: data!.categories.map((category: CategoryName) => category.name)
				})}
				onError={(_: ApolloError) => this.setState({
					status: 'error'
				})}
			>
				{(result: QueryResult) => null/* it's required */}
			</Query>
		);
	}
}

export default HeaderDesktop;