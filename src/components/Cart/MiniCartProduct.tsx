import React    from 'react';
import { Link } from 'react-router-dom';

import AttributeItem    from '../Attribute/AttributeItem';
import { AttributeSet } from '../../common/types'
import Counter from '../Counter'

type Props = {
	link: string
	brand: string
	name: string
	price: string
	attributes: AttributeSet[]
	selectedAttributes: number[]
	img: string
	count: number
	onChange: (count: number) => void
	onRemove: () => void
	onRedirect: () => void
	id: string
}

class MiniCartProduct extends React.Component<Props> {
	render = () => (
		<div className='item'>
			<div className='left'>
				<Link to={this.props.link} className='productName' onClick={this.props.onRedirect}>
					<p>{this.props.brand}</p>
					<p>{this.props.name}</p>
				</Link>
				<div className='price'>{this.props.price}</div>
				<div className='attributes'>
					{this.props.attributes.map((attr, attrIndex) =>
						<div className={'attributeContainer ' + attr.type} key={this.props.id + attr.id}>
							<div className='attributeName'>{attr.name}</div>
							<AttributeItem
								key={this.props.id + attr.id}
								type={attr.type}
								value={attr.items[this.props.selectedAttributes[attrIndex]].displayValue}
							/>
						</div>
					)}
				</div>
			</div>
			<Counter
				initialCount={this.props.count}
				onChange={this.props.onChange}
			/>
			<img src={this.props.img} />
			<button className='deleteCross' onClick={this.props.onRemove}>x</button>
		</div>
	)
}

export default MiniCartProduct