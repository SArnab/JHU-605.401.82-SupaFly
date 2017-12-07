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

		// Update player property
		Network.addOperationListener(ClueLess.Operation.UPDATE_PLAYER, (message) => {
			this.setState({ player: message.data as ClueLess.Player })
		})

		// Show an alert when the suggestion is refuted.
		Network.addOperationListener(ClueLess.Operation.SUGGESTION_WAS_REFUTED, (message) => {
			// Were you the person making the suggestion?
			if (this.state.game && this.state.player && message.data.suggestion.player == this.state.player.id) {
				const refuting_player = this.state.game.players.find(p => p.id == message.data.refuting_player) as ClueLess.Player
				alert("Your suggestion was refuted by " + refuting_player.character + " with the card: " + message.data.card_name)
			}
		})

		// Accusation failed.
		Network.addOperationListener(ClueLess.Operation.ACCUSATION_DID_FAIL, (message) => {
			if (!this.state.game || !this.state.player) {
				return
			}

			const caseFile = message.data.case_file
			alert("Sorry, your accusation was incorrect. You are out. The crime was committed by " + caseFile.suspect + " in " + caseFile.location + " with a " + caseFile.weapon)
		})

		// Accusation succeeded! Some player won the game.
		Network.addOperationListener(ClueLess.Operation.ACCUSATION_DID_SUCCEED, (message) => {
			if (!this.state.game || !this.state.player) {
				return
			}

			// Are you the player who won?
			const winning_player = this.state.game.players.find(p => p.id == message.data.player) as ClueLess.Player
			if (winning_player.id == this.state.player.id) {
				alert("Congratulations! Your accusation is correct. You won the game.")
			} else {
				alert(winning_player.character + " won the game!")
			}
		})

		// Display message
		Network.addOperationListener(ClueLess.Operation.MESSAGE, (message) => {
			message.data && message.data.message && alert(message.data.message)
		})

		// Display error
		Network.addOperationListener(ClueLess.Operation.ERROR, (message) => {
			alert(message.data.message)
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
