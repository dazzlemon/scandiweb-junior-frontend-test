import { gql } from '@apollo/client';

export const PRODUCT = gql`
  query GetProduct($productId: String!) {
		product(id: $productId) {
			name,
			inStock,
			gallery,
			description,
			category,
			attributes {
				id,
				name,
				type,
				items {
					displayValue,
					value,
					id
				}
			},
			prices {
				currency {
					label,
					symbol
				},
				amount
			},
			brand
		}
  }
`;