import * as React from "react"
import * as Commands from "../commands"
import Network from "../network"

interface Props {
	game: ClueLess.Game,
	player: ClueLess.Player
}
interface State {
	messages: ClueLess.ChatMessage[],
	new_message: string
}

export default class Chat extends React.Component<Props,State> {

	constructor(props: Props) {
		super(props)
		this.state = {
			messages: [],
			new_message: ""
		}
	}

	componentDidMount() {
		Network.addOperationListener(ClueLess.Operation.RECEIVE_CHAT_MESSAGE, (message) => {
			this.state.messages.push({ ...message.data as ClueLess.ChatMessage })
			this.setState({ messages: this.state.messages.slice() })
		})
	}

	findPlayer(id: string): ClueLess.Player {
		return this.props.game.players.find(p => p.id == id) as ClueLess.Player
	}

	render() {
		return (
			<div className="chat">
				<ul className="messages">
					{ this.state.messages.map((message, idx) => {
						return <li key={idx}>{ this.findPlayer(message.player).name } says: { message.message }</li>
					})}
				</ul>
				<div className="entry">
					<textarea
					value={ this.state.new_message}
					onChange={ (e) => {
						this.setState({ new_message: e.target.value })
					}} />
					<button onClick={() => {
						Commands.sendChatMessage(this.state.new_message)
						this.setState({ new_message: "" })
					}}>
						Send
					</button>
				</div>
			</div>
		)
	}

}