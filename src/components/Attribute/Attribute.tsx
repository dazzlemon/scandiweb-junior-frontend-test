import React from 'react';
import { Attribute, AttributeType } from '../../common/types'
import AttributeItem from './AttributeItem'

type Props = {
	name: string
	type: AttributeType
	items: Attribute[]
	selectedIndex: number
	onChange?: (index: number) => void
}

class AttributeView extends React.PureComponent<Props> {
	render = () => (
		<div className='attribute'>
			<div className='name'>{this.props.name}: </div>
			<div className='attributeItems'>
				{this.props.items.map((i, index) =>
					<AttributeItem
						type={this.props.type}
						selected={this.props.selectedIndex === index}
						value={i.displayValue}
						onSelected={() => this.props.onChange?.(index)}
					/>
				)}
			</div>
		</div>
	)
}

export default AttributeView