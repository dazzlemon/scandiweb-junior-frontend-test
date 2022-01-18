import { ReactComponent as CartIcon } from '../Icons/Cart.svg';
import React from 'react';

type Props = {}
type State = { isVisible: boolean }

// TODO: extract HOC + better typing
class Cart extends React.Component<Props, State> {
	private ref = React.createRef<HTMLDivElement>();
	constructor(props: Props) {
		super(props);
		this.setState({ isVisible: false });
	} 

	handleClickOutside(e: MouseEvent) {
    if (this.ref.current && !this.ref.current.contains(e.target as HTMLElement)) {
      this.setState({ isVisible: false });
    }
  };

	componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside, true);
	}

	render() {
		return (
			<div className='cart'>
				<CartIcon className='cartIcon' onClick={() => this.setState({ isVisible: !this.state.isVisible })}/>
				{this.state.isVisible && (
					<>
						<div className='bgEffect'/>
						{/* <div className='cartOverlay'> */}
						<div className='cartOverlay' ref={this.ref}>
							<div>
								Items
							</div>
							<div>
								Total
							</div>
							<div>
								Buttons
							</div>
						</div>
					</>
				)}
			</div>
		);
	}
}

export default Cart;