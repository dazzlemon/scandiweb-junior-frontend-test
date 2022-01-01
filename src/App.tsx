import React, { Component } from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from '@apollo/client';

import CategoryView from './Components/CategoryView';
import HeaderDesktop from './Components/HeaderDesktop';
// deprecated, but idk if any alternatives even exist,
// everything I found was for functional react

const client = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache()
});

type Props = {}


class App extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this.state = {  };
	}
	render() {
		return (
			<ApolloProvider client={client}>
				<HeaderDesktop />
				<CategoryView />
			</ApolloProvider>
		);
	}
}

export default App;
