import React, { ComponentType } from 'react';

type Props = { onClickOutside: (e: MouseEvent) => void }

function clickOutside<T>(Component: ComponentType<T>) {
	return class ClickOutside extends React.Component<Props> {
		private ref = React.createRef<HTMLDivElement>();
		constructor(props: Props & T) {
			super(props);
			this.handleClickOutside = this.handleClickOutside.bind(this);
		}

		componentDidMount() {
			document.addEventListener('click', this.handleClickOutside, true);
		}
	
		componentWillUnmount() {
			document.removeEventListener('click', this.handleClickOutside, true);
		}

		handleClickOutside(e: MouseEvent) {
			if (!this.ref.current?.contains(e.target as Node)) {
				this.props.onClickOutside(e);
			}
		}

		render() {
			return (
				<div ref={this.ref}>
					<Component {...this.props as Extract<T & Props, T>} />
				</div>
			);
		}
	}
}

export default clickOutside;