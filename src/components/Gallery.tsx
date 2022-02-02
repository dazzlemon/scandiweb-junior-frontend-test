import React from 'react'

type Props = { gallery: string[], showPreviews?: boolean }
type State = { index: number }
class Gallery extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { index: 0 }
	}

	render = () => (
		<>
			{this.props.showPreviews && <div className='productImagePreviews'>
				{this.props.gallery.map((i, index) =>
					<img
						src={i}
						onClick={() => this.setState({ index })}
					/>
				)}
			</div>}
			<div className='mainImageContainer'>
				<img src={this.props.gallery[this.state.index] } className='productImage' />
				{this.state.index > 0 && <button
					className='prev'
					onClick={() => this.setState({index: this.state.index > 0 ? this.state.index - 1 : 0})}
				>
					{`<`}
				</button>}
				{this.state.index < this.props.gallery.length - 1 && <button
					className='next'
					onClick={() =>
						this.setState({index:
							this.state.index + 1 < this.props.gallery.length ?
								this.state.index + 1 :
								this.props.gallery.length - 1})}
				>
					{`>`}
				</button>}
			</div>
		</>
	)
}

export default Gallery