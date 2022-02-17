import React from 'react';

type Props = {
	initialCount?: number
	onChange: (count: number) => void
}

type State = { count: number }

class Counter extends React.Component<Props, State> {
	constructor(props: Props)	{
		super(props)
		this.state = { count: props.initialCount ?? 0 }
	}

	incrementCount = () => {
		this.props.onChange(this.state.count + 1)
		this.setState({ count: this.state.count + 1 })
	}

	decrementCount = () => {
		this.props.onChange(this.state.count - 1)
		this.setState({ count: this.state.count - 1 })
	}

	render = () => (
		<div className='counter'>
			<button onClick={this.incrementCount}>+</button>
			<p>{this.state.count}</p>
			<button
				onClick={this.decrementCount}
				disabled={this.state.count === 1}
			>
				-
			</button>
		</div>
	)
}

export default Counter