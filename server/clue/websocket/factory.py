from autobahn.twisted.websocket import WebSocketServerFactory
from clue.websocket.protocol import ClueServerProtocol
from clue.game.game import Game

class ClueServerFactory(WebSocketServerFactory):

    protocol = ClueServerProtocol

    def __init__(self, *args, **kwargs):
        super(WebSocketServerFactory, self).__init__(*args, **kwargs)
        
        # Tracks each connection
        self.connections = {}

        # Tracks on-going games
        self.games = []

        # Track all players by their connection ID
        self.players = {}

    def track_connection(self, connection):
        if connection.id in self.connections:
            raise RuntimeError("Connection ID [%s] is already being tracked." % connection.id)
        self.connections[connection.id] = connection

    def untrack_connection(self, connection):
        # On the off-chance there is a key error, suppress it.
        # We want the connection gone either way.
        # An if-statement could work, but those are non-atomic.
        try: del self.connections[connection.id]
        except KeyError: pass

    '''
    Tracks a new player
    '''
    def track_player(self, player):
        self.players[player.id] = player

    '''
    Removes a player from the global list
    '''
    def untrack_player(self, player):
        try:
            del self.players[player.id]
        except KeyError:
            pass

    '''
    Attempts to find a game that needs players,
    and if it fails, creates a new game.
    '''
    def find_or_create_game(self):
        for game in self.games:
            # If it already started, skip it.
            if game.is_in_progress(): continue
            # If it is full, skip it.
            if game.num_players() >= 6: continue

            return game

        # If we made it down to here, create a new game.
        game = Game()
        self.games.append(game)
        return game