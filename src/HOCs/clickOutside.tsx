import React from 'react';

type Props_ = { onClickOutside: (e: MouseEvent) => void }

function clickOutside(Component: any) {// todo typing
	return class ClickOutside extends React.Component<Props_> {
		private ref = React.createRef<HTMLDivElement>();// TODO: typing
		constructor(props: Props_) {
			super(props);
		}

		componentDidMount() {
			document.addEventListener('click', this.handleClickOutside, true);
		}
	
		componentWillUnmount() {
			document.removeEventListener('click', this.handleClickOutside, true);
		}

		handleClickOutside(e: MouseEvent) {
			if (this.ref.current && !this.ref.current.contains(e.target as HTMLElement)) {// TODO: typing
				this.props.onClickOutside(e);
			}
		}

		render() {
			return (
				<div ref={this.ref}>
					<Component {...this.props} />
				</div>
			);
		}
	}
}

export default clickOutside;