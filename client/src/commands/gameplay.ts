import Network from "../network"
import { prepareMessage } from "../util"

/**
 * Sends a message to the server to request joining a new game.
 */
export function joinGame(player_name: string) {
	Network.send(prepareMessage(ClueLess.Operation.JOIN_GAME, {
		"player_name": player_name
	}))
}

/**
 * Movement Commands
 */
export function move_up() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_UP))
}

export function move_down() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_DOWN))
}

export function move_left() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_LEFT))
}

export function move_right() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_RIGHT))
}

export function move_up_left() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_UP_LEFT))
}

export function move_up_right() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_UP_RIGHT))
}

export function move_down_left() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_DOWN_LEFT))
}

export function move_down_right() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_DOWN_RIGHT))
}

/**
 * Ends the current turn and starts a turn on another player.
 */
export function nextTurn() {
	Network.send(prepareMessage(ClueLess.Operation.NEXT_TURN))
}

/**
 * Makes a suggestion of who committed the crime.
 * @param {string} location 
 * @param {string} suspect
 * @param {string} weapon
 */
export function makeSuggestion(location: string, suspect: string, weapon: string) {
	Network.send(prepareMessage(ClueLess.Operation.MAKE_SUGGESTION, {
		location: location,
		weapon: weapon,
		suspect: suspect
	}))
}

/**
 * Makes an accusation of who committed the crime.
 * @param {string} location 
 * @param {string} suspect
 * @param {string} weapon
 */
export function makeAccusation(location: string, suspect: string, weapon: string) {
	Network.send(prepareMessage(ClueLess.Operation.MAKE_ACCUSATION, {
		location: location,
		weapon: weapon,
		suspect: suspect
	}))
}

export function passSuggestion() {
	Network.send(prepareMessage(ClueLess.Operation.PASS_SUGGESTION))
}

export function refuteSuggestion(card_name: ClueLess.CardName) {
	Network.send(prepareMessage(ClueLess.Operation.REFUTE_SUGGESTION, {
		card_name: card_name
	}))
}