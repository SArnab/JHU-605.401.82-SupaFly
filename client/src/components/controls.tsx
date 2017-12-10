import * as React from "react"
import * as Commands from "../commands"
import Network from "../network"
import { showModal } from "./modal"
import SuggestionModal from "./suggestion-modal"
import AccusationModal from "./accusation-modal"

interface Props {
	game: ClueLess.Game,
	player: ClueLess.Player
}

interface State {
	did_just_move: boolean
	selected_refute_suggestion_card_name: ClueLess.CardName | null
}

export default class Controls extends React.Component<Props,State> {

	constructor(props: Props) {
		super(props)
		this.state = {
			did_just_move: false,
			selected_refute_suggestion_card_name: null
		}
	}

	componentWillMount() {
		// Listeners
		Network.addOperationListener(ClueLess.Operation.ERROR, (message) => {
			// Did a move command fail?
			if (message.data.message.indexOf("Hallway is blocked") > -1 && this.state.did_just_move) {
				this.setState({ did_just_move: false })
			}
		})
	}

	componentWillReceiveProps(nextProps: Props) {
		if (!this.isActiveTurn() && nextProps.game.active_turn == this.props.player.id) {
			// Reset state, we are entering a new turn.
			this.setState({ did_just_move: false })
		}
	}
	
	isActiveTurn(): boolean {
		return this.props.game.active_turn == this.props.player.id
	}

	isActiveSuggestionTurn(): boolean {
		return (
			this.props.game.active_suggestion != null &&
			this.props.game.active_suggestion_turn == this.props.player.id
		)
	}

	suggestionInProgress(): boolean {
		return this.props.game.active_turn_state == "suggesting"
	}

	canMakeSuggestion(): boolean {
		return this.isActiveTurn() &&
		!this.didFailAccusation() &&
		this.props.player.location.type === "room" &&
		(
			this.props.game.active_turn_state === "waiting_to_move" || 
			this.props.game.active_turn_state === "waiting_to_suggest"
		)
	}

	canMakeAccusation(): boolean {
		return this.isActiveTurn() && !this.didFailAccusation()
	}

	didFailAccusation(): boolean {
		return this.props.player.did_fail_accusation
	}

	canMove(): boolean {
		return (!this.state.did_just_move) &&
		!this.didFailAccusation() &&
		this.isActiveTurn() &&
		this.props.game.active_turn_state === "waiting_to_move"
	}

	canMoveLeft(): boolean {
		return this.canMove() && this.props.player.location.move_left
	}

	canMoveRight(): boolean {
		return this.canMove() && this.props.player.location.move_right
	}

	canMoveUp(): boolean {
		return this.canMove() && this.props.player.location.move_up
	}

	canMoveDown(): boolean {
		return this.canMove() && this.props.player.location.move_down
	}

	canMoveUpLeft(): boolean {
		return this.canMove() && this.props.player.location.move_up_left
	}

	canMoveUpRight(): boolean {
		return this.canMove() && this.props.player.location.move_up_right
	}

	canMoveDownLeft(): boolean {
		return this.canMove() && this.props.player.location.move_down_left
	}

	canMoveDownRight(): boolean {
		return this.canMove() && this.props.player.location.move_down_right
	}

	didClickMakeSuggestion(): void {
		showModal(<SuggestionModal game={this.props.game} player={this.props.player} />)
	}

	didClickMakeAccusation(): void {
		showModal(<AccusationModal game={this.props.game} player={this.props.player} />)
	}

	didClickMoveButton = (direction: "up" | "down" | "left" | "right" | "up_left" | "up_right" | "down_left" | "down_right"): void => {
		this.setState({ did_just_move: true })
		switch (direction) {
			case "up":
				Commands.move_up()
				break
			case "up_left":
				Commands.move_up_left()
				break
			case "up_right":
				Commands.move_up_right()
				break
			case "down":
				Commands.move_down()
				break
			case "down_left":
				Commands.move_down_left()
				break
			case "down_right":
				Commands.move_down_right()
				break
			case "left":
				Commands.move_left()
				break
			case "right":
				Commands.move_right()
				break
		}
	}

	renderActiveTurn() {
		return (
			<div>
				<h2>Your Turn</h2>
				{ this.canMakeSuggestion() && <button onClick={ () => { this.didClickMakeSuggestion() }}>Make Suggestion</button> }
				{ this.canMoveLeft() && <button onClick={() => { this.didClickMoveButton("left") }}>Move Left</button> }
				{ this.canMoveRight() && <button onClick={() => { this.didClickMoveButton("right") }}>Move Right</button> }
				{ this.canMoveUp() && <button onClick={() => { this.didClickMoveButton("up") }}>Move Up</button> }
				{ this.canMoveDown() && <button onClick={() => { this.didClickMoveButton("down") }}>Move Down</button> }
				{ this.canMoveUpRight() && <button onClick={() => { this.didClickMoveButton("up_right") }}>Take Secret Passage</button> }
				{ this.canMoveUpLeft() && <button onClick={() => { this.didClickMoveButton("up_left") }} >Take Secret Passage</button> }
				{ this.canMoveDownRight() && <button onClick={() => { this.didClickMoveButton("down_right") }}>Take Secret Passage</button> }
				{ this.canMoveDownLeft() && <button onClick={() => { this.didClickMoveButton("down_left") }}>Take Secret Passage</button> }
				{ this.canMakeAccusation() && <button onClick={ () => { this.didClickMakeAccusation() }}>Make Accusation</button> }
				<button onClick={ Commands.nextTurn }>End Turn</button>
			</div>
		)
	}

	renderRefuteSuggestionChoices() {
		const suggestion = this.props.game.active_suggestion as ClueLess.Suggestion
		const suggesting_player = this.props.game.players.find(p => p.id == suggestion.player) as ClueLess.Player
		
		// What cards are applicable to refuting this suggestion?
		const matchingCards = this.props.player.cards.filter((card) => {
			return card.name == suggestion.weapon || card.name == suggestion.location || card.name == suggestion.suspect
		})

		return (
			<div>
				<h2>Refute Suggestion</h2>

				{ matchingCards.length == 0 && 
					<p>
						<b>No Matching Cards</b>
						<button onClick={ Commands.passSuggestion }>Pass</button>
					</p>
				}

				{ matchingCards.length > 0 && 
					<p>
						<b>Select a card to show</b>
						<br />
						<select
						name="refute_suggestion"
						value={ this.state.selected_refute_suggestion_card_name || matchingCards[0].name }
						onChange={ (e) => {
							this.setState({ selected_refute_suggestion_card_name: e.target.value as ClueLess.CardName })
						}}>
							{ matchingCards.map((card) => {
								return <option key={card.name} value={card.name}>{card.name}</option>
							})}
						</select>
						<button onClick={() => {
							Commands.refuteSuggestion(this.state.selected_refute_suggestion_card_name || matchingCards[0].name)
						}}>
							Show To { suggesting_player.character }
						</button>
					</p>
				}
			</div>
		)
	}

	renderSuggestionInProgress() {
		if (!this.props.game.active_suggestion) {
			return
		}

		const suggesting_player = this.props.game.players.find(p => p.id == (this.props.game.active_suggestion as ClueLess.Suggestion).player) as ClueLess.Player

		return (
			<div>
				<h2>Suggestion Made By { suggesting_player.character }</h2>
				<ul>
					<li key="suspect">Suspect: { this.props.game.active_suggestion.suspect }</li>
					<li key="location">Location: { this.props.game.active_suggestion.location }</li>
					<li key="weapon">Weapon: { this.props.game.active_suggestion.weapon }</li>
				</ul>
				{ this.isActiveSuggestionTurn() && this.renderRefuteSuggestionChoices() }
			</div>
		)
	}

	render() {
		return (
			<div className="controls">
				{ !this.suggestionInProgress() && this.isActiveTurn() && this.renderActiveTurn() }
				{ !this.suggestionInProgress() && !this.isActiveTurn() && !this.didFailAccusation() && <h2>Not Your Turn</h2> }
				{ this.didFailAccusation() && <h2>Accusation Failed - You Are Out</h2> }
				{ this.suggestionInProgress() && this.renderSuggestionInProgress() }
			</div>
		)
	}
}