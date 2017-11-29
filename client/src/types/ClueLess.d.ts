declare namespace ClueLess {

	const enum ConnectionState {
		DISCONNECTED,
		CONNECTING,
		CONNECTED,
		FAILED
	}

	const enum Operation {
		JOIN_GAME = "join_game",
		UPDATE_GAME_STATE = "update_game_state",
		MOVE_UP = "move_up",
		MOVE_DOWN = "move_down",
		MOVE_LEFT = "move_left",
		MOVE_RIGHT = "move_right",
		MOVE_UP_LEFT = "move_up_left",
		MOVE_UP_RIGHT = "move_up_right",
		MOVE_DOWN_LEFT = "move_down_left",
		MOVE_DOWN_RIGHT = "move_down_right",
		UPDATE_PLAYER = "update_player",
		NEXT_TURN = "next_turn"
	}

	interface Message {
		readonly timestamp: number
		readonly operation: Operation
		readonly data: { [index: string]: any }
	}

	interface OperationListener {
		(message: Message): void
	}

	interface Game {
		readonly id: string
		readonly players: Player[]
		readonly num_turns: number
		readonly in_progress: boolean
		readonly active_turn: string
		readonly locations: Location[]
	}

	interface Player {
		readonly id: string
		readonly name: string
		readonly character: "Colonel Mustard" | "Mrs. Peacock" | "Miss. Scarlet" | "Professor Plum" | "Mr. Green" | "Mrs. White"
		readonly color: "yellow" | "red" | "purple" | "green" | "white" | "blue"
		readonly location: Location
		readonly cards: Card[]
	}

	interface Location {
		readonly players: string[]
		readonly name: string
		readonly move_up: boolean
		readonly move_down: boolean
		readonly move_left: boolean
		readonly move_right: boolean
		readonly move_down_right: boolean
		readonly move_down_left: boolean
		readonly move_up_right: boolean
		readonly move_up_left: boolean
	}

	interface Card {
		readonly name: "Rope" | "Lead Pipe"| "Knife" | "Wrench" | "Candlestick" | "Revolver" | "Study" | "Hall" | "Lounge" | "Library" | "Billiard Room" | "Dining Room" | "Conservatory" | "Ballroom" | "Kitchen" | "Colonel Mustard" | "Mrs. Peacock" | "Miss. Scarlet" | "Professor Plum" | "Mr. Green" | "Mrs. White"
		readonly type: "suspect" | "weapon" | "room"
	}
}