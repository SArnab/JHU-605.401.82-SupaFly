import { prepareMessage } from "../util"

export function joinGame(ws: WebSocket) {
	ws.send(prepareMessage(ClueLess.Operation.JOIN_GAME))
}