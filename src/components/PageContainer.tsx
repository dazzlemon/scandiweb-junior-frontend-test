import { useParams } from 'react-router-dom'

import { Error, Loading, HeaderDesktopView as Header } from '.'
import { useCategoriesCurrencies } from '../common'
import { CompleteQuery } from '../common'

type Props = {
	children: (query: CompleteQuery) => JSX.Element
}

const PageContainer = (props: Props) => {
	const { category } = useParams()
	const query = useCategoriesCurrencies(category!)

	switch (query.state) {
		case 'error':
			return <Error />
		case 'loading':
			return <Loading />
		case 'complete':
			const {
				categories,
				categoryIndex,
				currencies,
				changeCurrency,
				currencyIndex
			} = query
			return (
				<>
					<Header
						categories={categories}
						categoryIndex={categoryIndex}
						currencies={currencies}
						onCurrencyChange={changeCurrency}
						currencyIndex={currencyIndex}
					/>
					<main>{props.children(query)}</main>
				</>
			)
	}
}

export default PageContainer