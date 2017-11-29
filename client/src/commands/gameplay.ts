import Network from "../network"
import { prepareMessage } from "../util"

/**
 * Sends a message to the server to request joining a new game.
 */
export function joinGame() {
	Network.send(prepareMessage(ClueLess.Operation.JOIN_GAME))
}

export function move_up() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_UP))
	nextTurn()
}

export function move_down() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_DOWN))
	nextTurn()
}

export function move_left() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_LEFT))
	nextTurn()
}

export function move_right() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_RIGHT))
	nextTurn()
}

export function move_up_left() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_UP_LEFT))
	nextTurn()
}

export function move_up_right() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_UP_RIGHT))
	nextTurn()
}

export function move_down_left() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_DOWN_LEFT))
	nextTurn()
}

export function move_down_right() {
	Network.send(prepareMessage(ClueLess.Operation.MOVE_DOWN_RIGHT))
	nextTurn()
}

export function nextTurn() {
	Network.send(prepareMessage(ClueLess.Operation.NEXT_TURN))
}
