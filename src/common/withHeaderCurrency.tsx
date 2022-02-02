import React, { ComponentType } from 'react';
import PageContainer from '../components/PageContainer'
import { Currency } from './types'

type Props = { currency:  Currency }

function withHeaderCurrency<T>(Component: ComponentType<T>) {
	return class HeaderCurrency extends React.Component<Props & T> {
		render() {
			return (
				<PageContainer>
					{({ currency }) =>
						<Component {...this.props} currency={currency}/>
					}
				</PageContainer>
			);
		}
	}
}

export default withHeaderCurrency;