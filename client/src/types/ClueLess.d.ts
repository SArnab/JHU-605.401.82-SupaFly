declare namespace ClueLess {

	const enum ConnectionState {
		DISCONNECTED,
		CONNECTING,
		CONNECTED
	}

	const enum Operation {
		JOIN_GAME = "join-game"
	}

	interface Game {
		readonly id: string
		readonly players: Player[]
		readonly active_turn: string
	}

	interface Player {
		readonly id: string
		readonly username: string
	}
}