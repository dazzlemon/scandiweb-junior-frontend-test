import React, { Component } from 'react';
import { render } from 'react-dom';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useQuery,
	gql,
	QueryResult
} from '@apollo/client';

// deprecated, but idk if any alternatives even exist,
// everything I found was for functional react
import { Query } from '@apollo/client/react/components';

type Currency = {
	label: string,
	symbol: string
}

type Price = {
	currency: Currency,
	amount: number
}

type Attribute = {
	displayValue: string,
	value: string,
	id: string
}

type AttributeSet = {
	id: string,
	name: string,
	type: string,
	items: [Attribute]
}

type Product = {
	id: string,
	name: string,
	inStock: boolean,
	gallery: [string],
	description: string,
	category: string,
	attributes: [AttributeSet]
	prices: [Price],
	brand: string
}

type Category = {
	name: string,
	products: [Product]
}

type TestProps = {}

const client = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache()
});

const CATEGORIES = gql`
  query GetCategories {
		categories {
			name,
			products {
				id,
				name
			}
		}
  }
`;

class Test extends Component {
	constructor(props: TestProps) {
		super(props);
		this.state = {  };
	}

	render() {
		return (
			<Query query={CATEGORIES}>
				{(result: QueryResult<{ categories: Category[] }>) => {
					const { loading, error, data } = result;
					if (loading) {
						return <p>Loading...</p>;
					}
					if (error) {
						return <p>Error :(</p>;
					}
				
					return (
						<>
							{
								data!.categories.map(({ name, products }) => (
									<div key={name}>
										{name}
										<div>
											{
												products.map(({ id, name }) => (
													<div 
														key={id}
														style={{marginLeft: 25}}
													>
														{`${id} - ${name}`}
													</div>
												))
											}
										</div>
									</div>
								))
							}
						</>
					);
				}}
			</Query>
		);
	}
}

type AppProps = {}

class App extends Component {
	constructor(props: AppProps) {
		super(props);
		this.state = {  };
	}
	render() {
		return (
			<ApolloProvider client={client}>
				<Test />
			</ApolloProvider>
		);
	}
}

export default App;
