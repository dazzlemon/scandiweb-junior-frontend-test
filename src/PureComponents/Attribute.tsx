import React from 'react';
import { Attribute as AttributeT, AttributeSet, AttributeType, Product as ProductType } from '../Types/ProductContainer'

type Props_ = {
	name: string
	type: AttributeType
	items: AttributeT[]
	selectedIndex: number
	onChange: (index: number) => void
}

class Attribute extends React.Component<Props_> {
	attributeItemProps = (i: AttributeT, index: number) => {
		const swatch = this.props.type == 'swatch'
		const selected = this.props.selectedIndex == index

		const typeProps = swatch ? { style: {backgroundColor: i.displayValue} }
		                         : { children: i.displayValue }

		return {
			className: this.props.type + (selected ? ' selected' : ''),
			onClick: () => this.props.onChange(index),
			...typeProps
		}
	}

	render = () => (
		<div className='attribute'>
			<div className='name'>{this.props.name}: </div>
			<div className='attributeItems'>
				{this.props.items.map((i, index) => 
					<div {...this.attributeItemProps(i, index)}/>
				)}
			</div>
		</div>
	)
}

export default Attribute