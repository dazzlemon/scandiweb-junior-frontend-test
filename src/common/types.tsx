export type Currency = {
	label: string
	symbol: string
}

export type Price = {
	currency: Currency
	amount: number
}

export type Attribute = {
	displayValue: string
	value: string
	id: string
}

export type AttributeType = 'swatch' | 'text'

export type AttributeSet = {
	id: string
	name: string
	type: AttributeType
	items: Attribute[]
}