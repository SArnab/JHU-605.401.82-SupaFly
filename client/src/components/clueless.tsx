import * as React from "react"
import * as Commands from "../commands"
import Network from "../network"
import Game from "./game"

interface Props {
}

interface State {
	blocking_request_in_progress: boolean
	connection_state: ClueLess.ConnectionState
	game: undefined|ClueLess.Game,
	player: undefined|ClueLess.Player
}

export default class PlayClueLess extends React.Component<Props,State> {

	constructor(props: Props) {
		super(props)
		this.state = {
			blocking_request_in_progress: false,
			connection_state: ClueLess.ConnectionState.DISCONNECTED,
			game: undefined,
			player: undefined
		}
	}

	componentWillMount() {
		// If we are not connected, connect.
		if (!Network.isConnected()) {
			Network.connect()
			const socket = Network.getWebSocket()
			socket.onopen = () => {
				console.log("CONNECTED TO WEBSOCKET SERVER")
				this.setState({ connection_state: ClueLess.ConnectionState.CONNECTED})
			}
			socket.onerror = (e) => {
				console.error(e)
				alert("Failed to establish WebSocket connection.")
				this.setState({ connection_state: ClueLess.ConnectionState.FAILED })
			}
		}

		// Attach operation listeners
		Network.addOperationListener(ClueLess.Operation.UPDATE_GAME_STATE, (message) => {
			this.setState({ game: message.data as ClueLess.Game })
		})

		Network.addOperationListener(ClueLess.Operation.UPDATE_PLAYER, (message) => {
			this.setState({ player: message.data as ClueLess.Player })
		})
	}

	renderConnected()
	{
		if (this.state.game === undefined || this.state.player === undefined) {
			return (
				<button onClick={ () => {
					Commands.joinGame()
				}}>
					Play Now
				</button>
			)
		}

		if (!this.state.game.in_progress) {
			return <h1>Waiting for more players...</h1>
		}

		return <Game game={this.state.game} player={this.state.player} />
	}

	renderConnecting()
	{
		return <h1>Connecting...</h1>
	}

	renderFailed()
	{
		return <h1>Failed to connect to WebSocket server.</h1>
	}

	render() {
		return (
			<div className="clueless-game">
				{
					// CONNECTED
					this.state.connection_state === ClueLess.ConnectionState.CONNECTED &&
					this.renderConnected()
				}

				{
					// CONNECTING
					this.state.connection_state === ClueLess.ConnectionState.CONNECTING &&
					this.renderConnecting()
				}

				{
					// FAILED
					this.state.connection_state === ClueLess.ConnectionState.FAILED &&
					this.renderFailed()
				}
			</div>
		)
	}
}
