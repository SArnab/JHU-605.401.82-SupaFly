import * as React from "react"
import * as Commands from "../commands"
import Network from "../network"

interface Props {
	game: ClueLess.Game,
	player: ClueLess.Player
}

interface State {}

export default class Controls extends React.Component<Props,State> {
	
	isActiveTurn(): boolean {
		return this.props.game.active_turn == this.props.player.id
	}

	canMakeSuggestion(): boolean {
		return false
	}

	canMoveLeft(): boolean {
		return this.props.player.location.move_left
	}

	canMoveRight(): boolean {
		return this.props.player.location.move_right
	}

	canMoveUp(): boolean {
		return this.props.player.location.move_up
	}

	canMoveDown(): boolean {
		return this.props.player.location.move_down
	}

	canMoveUpLeft(): boolean {
		return this.props.player.location.move_up_left
	}

	canMoveUpRight(): boolean {
		return this.props.player.location.move_up_right
	}

	canMoveDownLeft(): boolean {
		return this.props.player.location.move_down_left
	}

	canMoveDownRight(): boolean {
		return this.props.player.location.move_down_right
	}

	renderActiveTurn() {
		return (
			<div>
				<h2>Your Turn</h2>
				<button>Make Suggestion</button>
				{ this.canMoveLeft() && <button onClick={ Commands.move_left }>Move Left</button> }
				{ this.canMoveRight() && <button onClick={ Commands.move_right }>Move Right</button> }
				{ this.canMoveUp() && <button onClick={ Commands.move_up }>Move Up</button> }
				{ this.canMoveDown() && <button onClick={ Commands.move_down }>Move Down</button> }
				{ this.canMoveUpRight() && <button onClick={ Commands.move_up_right }>Take Secret Passage</button> }
				{ this.canMoveUpLeft() && <button onClick={ Commands.move_up_left} >Take Secret Passage</button> }
				{ this.canMoveDownRight() && <button onClick={ Commands.move_down_right }>Take Secret Passage</button> }
				{ this.canMoveDownLeft() && <button onClick={ Commands.move_down_left }>Take Secret Passage</button> }
			</div>
		)
	}

	render() {
		return (
			<div className="controls">
				{ this.isActiveTurn() && this.renderActiveTurn() }
				{ !this.isActiveTurn() && <h2>Not Your Turn</h2> }
			</div>
		)
	}
}