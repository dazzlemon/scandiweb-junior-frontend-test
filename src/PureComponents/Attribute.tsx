import React from 'react';
import { Attribute as AttributeT, AttributeType } from '../Types/ProductContainer'

type Props_ = {
	type: AttributeType
	selected: boolean
	value: string
	onSelected: React.MouseEventHandler<HTMLDivElement>
}

class AttributeItem extends React.Component<Props_> {
	render = () => {
		const typeProps = this.props.type == 'swatch' ? { style: {backgroundColor: this.props.value} }
		                                              : { children: this.props.value }
		const props = {
			className: this.props.type + (this.props.selected ? ' selected' : ''),
			onClick: this.props.onSelected,
			...typeProps
		}

		return <div {...props}/>
	}
}

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