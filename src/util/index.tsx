export type ProductRecord = {
	id: string,
	selectedAttributes: number[]
}

export type CartProduct = {
	count: number
	productRecord: ProductRecord
}

export function equal<T>(a: T, b: T) {
	// TODO
	return JSON.stringify(a) === JSON.stringify(b)
} 

export function JsonParse<T>(jsonString: string): T {
	// TODO
	return JSON.parse(jsonString);
}

// localStorage might be empty
export const getCart = () => JsonParse<CartProduct[]>(localStorage.getItem('cart') ?? '[]')
export const setCart = (products: CartProduct[]) => {
	localStorage.setItem('cart', JSON.stringify(products))
	document.dispatchEvent(new CustomEvent('storage'))
}

export const	addToCart = (id: string, selectedAttributes: number[]) => {
	const cart = getCart()
	const newProduct = {
		id,
		selectedAttributes
	}

	const existingProduct = cart.find(p => equal(p.productRecord, newProduct))
	if (!existingProduct) {
		cart.unshift({ count: 1, productRecord: newProduct })
	} else {
		existingProduct.count++
	}
	setCart(cart)
}