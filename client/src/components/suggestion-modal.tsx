import * as React from "react"
import * as Commands from "../commands"

const locations = [
	"Study",
	"Hall",
	"Lounge",
	"Library",
	"Billiard Room",
	"Dining Room",
	"Conservatory",
	"Ballroom",
	"Kitchen"
]

const characters = [
	"Colonel Mustard",
	"Mrs. Peacock",
	"Miss. Scarlet",
	"Professor Plum",
	"Mr. Green",
	"Mrs. White"
]

const weapons = [
	"Rope",
	"Lead Pipe",
	"Knife",
	"Wrench",
	"Candlestick",
	"Revolver"
]

interface Props {
	game: ClueLess.Game,
	player: ClueLess.Player,
	close?: () => void
}
interface State {
	location: string,
	character: string,
	weapon: string
}

export default class SuggestionModal extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props)
		this.state = {
			location: props.player.location.name,
			character: characters[0],
			weapon: weapons[0]
		}
	}

	didChangeLocation = (e: React.ChangeEvent<any>) => {
		this.setState({ location: e.target.value })
	}

	didChangeCharacter = (e: React.ChangeEvent<any>) => {
		this.setState({ character: e.target.value })
	}

	didChangeWeapon = (e: React.ChangeEvent<any>) => {
		this.setState({ weapon: e.target.value })
	}

	didClickMakeSuggestion = () => {
		
		// Fire off a network request with the suggestion params.
		Commands.makeSuggestion(this.state.location, this.state.character, this.state.weapon)
		this.props.close && this.props.close()
	}

	render() {
		return (
			<div className="suggestion-modal">
				<h1>Make A Suggestion</h1>

				<div>
					<label htmlFor="location">Location</label>
					<select disabled id="location" value={this.state.location} onChange={ this.didChangeLocation }>
						{ locations.map((location) => {
							return <option key={location} value={location}>{location}</option>
						})}
					</select>
				</div>
				<div>
					<label htmlFor="character">Character</label>
					<select id="character" value={this.state.character} onChange={ this.didChangeCharacter }>
						{ characters.map((character) => {
							return <option key={character} value={character}>{character}</option>
						})}
					</select>
				</div>
				<div>
					<label htmlFor="weapon">Weapon</label>
					<select id="weapon" value={this.state.weapon} onChange={ this.didChangeWeapon }>
						{ weapons.map((weapon) => {
							return <option key={weapon} value={weapon}>{weapon}</option>
						})}
					</select>
				</div>
				<div>
					<button onClick={ this.didClickMakeSuggestion }>Make Suggestion</button>
					<button onClick={ this.props.close }>Close</button>
				</div>
			</div>
		)
	}

}