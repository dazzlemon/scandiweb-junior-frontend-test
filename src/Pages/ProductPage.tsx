import { useParams } from 'react-router-dom';
import Header from '../PureComponents/HeaderDesktopView';
import { gql, useQuery } from '@apollo/client';
import ProductView from '../Components/ProductView';

const QUERY = gql`
	query GetCategoryNamesAndCurrencies {
		categories {
			name
		},
		currencies {
			label,
			symbol
		}
	}
`;

const ProductPage = () => {
	const { category, productId } = useParams();
	const { loading, error, data } = useQuery<{
		categories: {name: string}[],
		currencies: {label: string, symbol: string}[]
	}>(QUERY);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>{error.message}</div>;
	}

	const categories = data!.categories.map(category => category.name);
	const categoryIndex = categories.indexOf(category!);// this page is routed with :category

	const changeCurrency = (index: number) => {
		localStorage.setItem('currency', data!.currencies[index].label);
	}

	const currencyLabel = localStorage.getItem('currency') ?? data!.currencies[0];
	const currencyIndex = currencyLabel
		? data!.currencies.findIndex(currency => currency.label === currencyLabel)
		: 0;// TODO: may be -1?
	// TODO: above is copypaste from category page

	return (
		<>
			<Header
				categories={categories}
				categoryIndex={categoryIndex}
				currencies={data!.currencies}
				onCurrencyChange={changeCurrency}
				currencyIndex={currencyIndex}
			/>
			<ProductView id={productId! /* this page is routed with :productId */} currency={data!.currencies[currencyIndex].label} />
		</>
	);
}

export default ProductPage;