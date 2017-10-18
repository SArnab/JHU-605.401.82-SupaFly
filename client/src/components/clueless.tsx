import * as React from "react"
import * as Commands from "../commands"
import Lobby from "./lobby"

interface Props {
	connection_uri: string
}

interface State {
	connection_state: ClueLess.ConnectionState
	game: undefined|ClueLess.Game
}

export default class PlayClueLess extends React.Component<Props,State> {

	protected wsConnection: WebSocket

	constructor(props: Props) {
		super(props)
		this.state = {
			connection_state: ClueLess.ConnectionState.DISCONNECTED,
			game: undefined
		}
	}

	initWSConnection(): void {
		this.wsConnection = new WebSocket(this.props.connection_uri)
		this.setState({ connection_state: ClueLess.ConnectionState.CONNECTING })

		this.wsConnection.onopen = () => {
			this.setState({ connection_state: ClueLess.ConnectionState.CONNECTED })
		}

		this.wsConnection.onerror = () => {
			this.setState({ connection_state: ClueLess.ConnectionState.DISCONNECTED })
		}

		this.wsConnection.onclose = () => {
			this.setState({ connection_state: ClueLess.ConnectionState.DISCONNECTED })
		}

		this.wsConnection.addEventListener("message", this.handleWSMessage.bind(this))
	}

	/**
	 * @return boolean Whether or not the connection is ready for use.
	 */
	isConnected(): boolean {
		return (
			this.state.connection_state === ClueLess.ConnectionState.CONNECTED &&
			this.wsConnection &&
			this.wsConnection.readyState === 1
		)
	}

	/**
	 * @return boolean Whether or not the user is currently part of a game.
	 */
	inActiveGame(): boolean {
		return !(this.state.game === undefined)
	}

	/**
	 * Called when a new message is received on the connection.
	 * @param  e MessageEvent The MessageEvent dispatched to the socket.
	 * @return void
	 */
	handleWSMessage(e: MessageEvent): void {
		console.log("Received Message", e.data)
	}

	componentDidMount() {
		if (!this.wsConnection) {
			this.initWSConnection()
		}
	}

	render() {
		if (!this.isConnected()) {
			return <h1>Connecting...</h1>
		}

		return (
			<div className="clueless-game">
				{ !this.inActiveGame() && 
					<Lobby
					joinGame={ () => {
						Commands.joinGame(this.wsConnection)
						return new Promise((resolve, reject) => {
							// Resolve by checking to see every n seconds
							// if a game was joined
							const interval = window.setInterval(() => {
								if (this.inActiveGame()) {
									window.clearInterval(interval)
									resolve()
								}
							}, 100)

							// If it fails to join a game within 1s, reject
							window.setTimeout(() => {
								if (!this.inActiveGame()) {
									reject(new Error("Failed to join game."))
								}
							}, 1000)
						})
					}} />
				}
			</div>
		)
	}
}
