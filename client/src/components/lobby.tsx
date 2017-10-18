import * as React from "react"

interface Props {
	joinGame: () => Promise<any>
}
interface State {
	request_in_progress: boolean
}

export default class Lobby extends React.Component<Props,State> {

	constructor(props: Props) {
		super(props)
		this.state = {
			request_in_progress: false
		}
	}

	async joinGame() {
		try {
			this.setState({ request_in_progress: true })
			await this.props.joinGame()
		} catch (err) {
			alert(err.message || err.msg || "Failed to join an existing game.")
		} finally {
			this.setState({ request_in_progress: false })
		}
	}

	render() {
		return (
			<div className="lobby">
				<button className="btn btn-play" disabled={ this.state.request_in_progress } onClick={ () => this.joinGame() }>Play Now</button>
			</div>
		)
	}
}