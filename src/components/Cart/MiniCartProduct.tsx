import React    from 'react';
import { Link } from 'react-router-dom';

import { AttributeSet } from '../../common/types'
import { Attribute }     from '../../components'
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
						<Attribute
							// attr.name instead of attr.id, because their ids arent unique e.g. size,
							// and because of that apollo overrides these objects
							id={this.props.id + attr.name}
							key={this.props.id + attr.name}
							name={attr.name}
							type={attr.type}
							items={attr.items}
							selectedIndex={this.props.selectedAttributes[attrIndex]}
						/>
						// <div className={'attributeContainer ' + attr.type} key={this.props.id + attr.name}>
						// 	<div className='attributeName'>{attr.name}</div>
						// 	<AttributeItem
						// 		key={this.props.id + attr.name}
						// 		type={attr.type}
						// 		value={attr.items[this.props.selectedAttributes[attrIndex]].displayValue}
						// 	/>
						// </div>
					)}
				</div>
			</div>
			<Counter
				initialCount={this.props.count}
				onChange={this.props.onChange}
			/>
			<img src={this.props.img} alt={this.props.name}/>
			<button className='deleteCross' onClick={this.props.onRemove}>x</button>
		</div>
	)
}

export default MiniCartProduct