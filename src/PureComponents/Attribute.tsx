import React from 'react';
import { Attribute as AttributeT, AttributeType } from '../Types/ProductContainer'
import AttributeItem from './AttributeItem'

type Props = {
	name: string
	type: AttributeType
	items: AttributeT[]
	selectedIndex: number
	onChange: (index: number) => void
}

class Attribute extends React.Component<Props> {
	render = () => (
		<div className='attribute'>
			<div className='name'>{this.props.name}: </div>
			<div className='attributeItems'>
				{this.props.items.map((i, index) =>
					<AttributeItem
						type={this.props.type}
						selected={this.props.selectedIndex == index}
						value={i.displayValue}
						onSelected={() => this.props.onChange(index)}
					/>
				)}
			</div>
		</div>
	)
}

export default Attribute