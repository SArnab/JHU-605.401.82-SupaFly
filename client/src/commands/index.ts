import Network from "../network"
import { prepareMessage } from "../util"

export {
	joinGame,
	nextTurn,
	move_left,
	move_up,
	move_down,
	move_right,
	move_up_right,
	move_up_left,
	move_down_left,
	move_down_right,
	makeSuggestion,
	passSuggestion,
	refuteSuggestion,
	makeAccusation
} from "./gameplay"

export function sendChatMessage(message: string) {
	Network.send(prepareMessage(ClueLess.Operation.SEND_CHAT_MESSAGE, {
		message: message
	}))
}