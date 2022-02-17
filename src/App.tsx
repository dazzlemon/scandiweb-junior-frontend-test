import { Component } from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from '@apollo/client';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import { Category, Product, Cart } from './pages';
import './App.sass';

const production = process.env.REACT_APP_ENV === 'production';

const client = new ApolloClient({
	uri: production ? 'https://fierce-tundra-22133.herokuapp.com' : 'http://localhost:4000',
	cache: new InMemoryCache(),
	connectToDevTools: true,
	headers: production ? {
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
		console.log(process.env.REACT_APP_ENV)
		return (
			<ApolloProvider client={client}>
				<BrowserRouter>
					<Routes>
						<Route path='/'>
							<Route index element={<Navigate to='/all' />} />
							<Route path='cart' element={<Cart/>} />
							<Route path=':category'>
								<Route index element={<Category/>} />
								<Route path=':productId' element={<Product/>} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</ApolloProvider>
		);
	}
}

export default App;