import React, { Component } from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from '@apollo/client';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import CategoryView from './Components/CategoryView';
import HeaderDesktop from './Components/HeaderDesktop';

const client = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache(),
	connectToDevTools: true,
});

type Props = {}

class App extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this.state = {  };
	}
	render() {
		const categoryNames = ['all', 'clothes', 'tech']

		return (
			<ApolloProvider client={client}>
				<BrowserRouter>
					<Routes>
						<Route path='/'>
							<Route index element={<Navigate to='/all' />} />
							<Route path=':category' element={<>
								{/* <HeaderDesktop /> */}
								<HeaderDesktop/>
								<CategoryView />
							</> }/>
						</Route>
					</Routes>
				</BrowserRouter>
			</ApolloProvider>
		);
	}
}

export default App;