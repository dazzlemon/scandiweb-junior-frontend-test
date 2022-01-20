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
	uri: process.env.STG == 'production' ? 'https://fierce-tundra-22133.herokuapp.com' : 'http://localhost:4000',
	cache: new InMemoryCache(),
	connectToDevTools: true,
	headers: process.env.STG == 'production' ? {
		'Access-Control-Allow-Origin': 'https://cryptic-waters-16902.herokuapp.com'
	} : undefined
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