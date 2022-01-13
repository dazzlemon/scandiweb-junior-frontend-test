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
			<div className='pageContainer'>
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
			</div>
		);
	}
}

export default App;