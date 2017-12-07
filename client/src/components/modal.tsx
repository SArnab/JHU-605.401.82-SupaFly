import * as React from "react"
import * as ReactDOM from "react-dom"

interface Props {
	close: () => void
}
interface State {}

export class Modal extends React.Component<Props,State> {

	render() {
		const child = React.cloneElement(React.Children.only(this.props.children), {
			close: this.props.close
		})

		return (
			<div className="modal">
				{ child }
			</div>
		)
	}

}

export function showModal(element: JSX.Element) {
	
	const wrapper = document.body.appendChild(document.createElement("div"))
	wrapper.classList.add("modal-wrapper")
	const cleanup = () => {
		ReactDOM.unmountComponentAtNode(wrapper)
		window.setTimeout(() => {
			wrapper.remove()
		})
	}

	ReactDOM.render(
		<Modal close={cleanup}>{ element }</Modal>, 
		wrapper
	)
}