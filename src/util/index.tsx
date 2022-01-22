export type ProductRecord = {
	id: string,
	selectedAttributes: number[]
}

export function equal<T>(a: T, b: T) {
	// TODO
	return JSON.stringify(a) == JSON.stringify(b)
} 

export function JsonParse<T>(jsonString: string): T {
	// TODO
	return JSON.parse(jsonString);
}

// localStorage might be empty
export const getCart = () => JsonParse<ProductRecord[]>(localStorage.getItem('cart') ?? '[]')
export const setCart = (products: ProductRecord[]) => localStorage.setItem('cart', JSON.stringify(products))