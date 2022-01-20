import { Component } from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from '@apollo/client';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import Category from './Pages/Category';
import ProductPage from './Pages/ProductPage';
import './App.sass';

const client = new ApolloClient({
	// uri: 'http://localhost:4000',
	uri: 'https://fierce-tundra-22133.herokuapp.com',
	cache: new InMemoryCache(),
	connectToDevTools: true,
	headers: {
		'Access-Control-Allow-Origin': 'https://cryptic-waters-16902.herokuapp.com'
	}
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
							<Route path=':category'>
								<Route index element={<Category/>} />
								<Route path=':productId' element={<ProductPage/>} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</ApolloProvider>
		);
	}
}

export default App;