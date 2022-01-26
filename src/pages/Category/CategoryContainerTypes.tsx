import { AttributeSet, Price } from '../../common/types'

export type Product = {
	id: string
	name: string
	inStock: boolean
	gallery: string[]
	description: string// unused?
	category: string
	attributes: AttributeSet[]
	prices: Price[]
	brand: string
}