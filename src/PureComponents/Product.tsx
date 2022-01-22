// different styling for single image(gallery still can contain single image)
type Images = { type: 'image', value: string }
            | { type: 'gallery', value: string[] }

type Attribute = {
	type: 'text' | 'swatch',
	values: string[]
}

type Props = {
	name: string,
	images: Images,
	price: string,
	attributes: Attribute[]
	selectedAttributes: number[] // attributes[n].values[selectedAttributes[n]]
	isAvailable: boolean
}

const Product = () => {

}

export default Product;