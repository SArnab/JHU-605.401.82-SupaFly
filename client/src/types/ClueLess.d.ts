declare namespace ClueLess {

	const enum ConnectionState {
		DISCONNECTED,
		CONNECTING,
		CONNECTED,
		FAILED
	}

	const enum Operation {
		MESSAGE = "message",
		ERROR = "error",
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
		NEXT_TURN = "next_turn",
		MAKE_SUGGESTION = "make_suggestion",
		PASS_SUGGESTION = "pass_suggestion",
		REFUTE_SUGGESTION = "refute_suggestion",
		SUGGESTION_WAS_REFUTED = "suggestion_was_refuted",
		MAKE_ACCUSATION = "make_accusation",
		ACCUSATION_DID_FAIL = "accusation_did_fail",
		ACCUSATION_DID_SUCCEED = "accusation_did_succeed",
		SEND_CHAT_MESSAGE = "send_chat_message",
		RECEIVE_CHAT_MESSAGE = "receive_chat_message"
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
		readonly active_turn_state: "waiting_to_move" | "waiting_to_suggest" | "suggesting" | "waiting_to_accuse" | "accusing"
		readonly active_suggestion: Suggestion|null
		readonly active_suggestion_turn: string|null
		readonly locations: Location[]
		readonly winner: string|null
		readonly case_file: CaseFile
		readonly game_over: boolean
		readonly creator: string|null
	}

	interface Player {
		readonly id: string
		readonly name: string
		readonly character: CharacterName
		readonly color: "yellow" | "red" | "purple" | "green" | "white" | "blue"
		readonly location: Location
		readonly cards: Card[]
		readonly did_fail_accusation: boolean
	}

	interface Location {
		readonly players: string[]
		readonly name: LocationName
		readonly type: "room" | "hallway"
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
		readonly name: CardName
		readonly type: "suspect" | "weapon" | "room"
	}

	interface CaseFile {
		readonly suspect: CharacterName
		readonly weapon: WeaponName
		readonly location: LocationName
	}

	interface Suggestion {
		readonly player: string
		readonly suspect: CharacterName
		readonly weapon: WeaponName
		readonly location: LocationName
	}

	interface Accusation {
		readonly player: string
		readonly suspect: CharacterName
		readonly weapon: WeaponName
		readonly location: LocationName
	}

	interface ChatMessage {
		readonly player: string
		readonly timestamp: number
		readonly message: string
	}

	type CardName = WeaponName | LocationName | CharacterName
	type WeaponName = "Rope" | "Lead Pipe"| "Knife" | "Wrench" | "Candlestick" | "Revolver"
	type LocationName = "Study" | "Hall" | "Lounge" | "Library" | "Billiard Room" | "Dining Room" | "Conservatory" | "Ballroom" | "Kitchen"
	type CharacterName = "Colonel Mustard" | "Mrs. Peacock" | "Miss. Scarlet" | "Professor Plum" | "Mr. Green" | "Mrs. White"

}