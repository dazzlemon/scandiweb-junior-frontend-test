import React from 'react';
import { AttributeType } from '../common/types'

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

export default AttributeItem