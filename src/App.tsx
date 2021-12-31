import React from 'react';
import { render } from 'react-dom';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useQuery,
	gql
} from "@apollo/client";

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

const App = () => {
	// actually it should be able to get client from context, but it doesn't for some reason
  const { loading, error, data } = useQuery<{ categories: Category[] }>(CATEGORIES, {client});

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
}

render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root'),
);

export default App;
