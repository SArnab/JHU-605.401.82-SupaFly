from autobahn.twisted.websocket import WebSocketServerProtocol
from twisted.python import log
from clue import errors
from uuid import uuid1
from txaio import create_future
from time import time
from clue.game.game import Game
from clue.game.player import Player
from clue.game.error import GameError
import json

#####################################
# Operation Constant Strings
#####################################
OP_JOIN_GAME = "join_game"
OP_UPDATE_GAME_STATE = "update_game_state"

#####################################
# Protocol Class
#####################################
class ClueServerProtocol(WebSocketServerProtocol):

    def __init__(self):
        self.id = uuid1()
        self.is_closed = create_future()
        self.game = None

    '''
    Called when a connection is being established between the client
    and server. Each instance of this class is a new connection.
    '''
    def onConnect(self, request):
        pass

    '''
    Called when a connection is opened between the client
    and server. This means the handshake has completed.
    '''
    def onOpen(self):
        log.msg("New Connection", self.id)

        # If we fail to track the connection, close it.
        try:
            self.factory.track_connection(self)
        except Exception as e:
            self.sendClose(errors.DUPLICATE_CONNECTION_ID)
            raise e

    '''
    Called when a message has been received on this connection.
    '''
    def onMessage(self, payload, isBinary):
        # Drop binary messages
        if isBinary: return
        
        # Decode to a utf8 string
        message = payload.decode("utf-8")
        log.msg("Received message [%s]" % message)

        if (message == "PING"):
            # PING/PONG
            self.sendMessage("PONG".encode("utf-8"), False)
        else:
            # Parse the message as a JSON object
            json_message = json.loads(message)
            
            # What is the operation we are trying to execute?
            operation = json_message["operation"]
            try:
                method = getattr(self, operation)
                if method is not None: method(json_message)
            except GameError as e:
                self.sendOperation("error", e.to_dict())

    '''
    Called when this connection is closed.
    '''
    def onClose(self, wasClean, code, reason):
        log.msg("Connection [%s] closed [wasClean: %d]" % (self.id, wasClean))
        self.factory.untrack_connection(self)
        if self.game is not None and self.player is not None:
            self.game.remove_player(self.player)


    '''
    Helps format a message
    '''
    def sendOperation(self, operation, data):
        payload = {
            "timestamp": int(round(time() * 1000)),
            "operation": operation,
            "data": data
        }

        message = json.dumps(payload).encode("utf-8")
        # log.msg("Sending message [%s]" % message)
        self.sendMessage(message, False)

    #####################################
    # Operations
    #####################################
    def join_game(self, json_message):
        if self.game is not None:
            raise Exception("Player is already part of a game.")

        self.player = Player(self)
        self.game = self.factory.find_or_create_game()
        self.game.add_player(self.player)

    def move(self, direction):
        self.game.move_player(self.player, direction)
        
        # If in a room, then the player may make a suggestion
        if self.player.location.is_room():
            self.active_turn_state = "waiting_to_suggest"

        self.game.broadcast_game_state()

    def move_up(self, json_message):
        self.move("up")

    def move_down(self, json_message):
        self.move("down")

    def move_left(self, json_message):
        self.move("left")

    def move_right(self, json_message):
        self.move("right")

    def move_up_left(self, json_message):
        self.move("up_left")

    def move_up_right(self, json_message):
        self.move("up_right")

    def move_down_left(self, json_message):
        self.move("down_left")

    def move_down_right(self, json_message):
        self.move("down_right")

    def next_turn(self, json_message):
        self.game.next_turn()

    def make_suggestion(self, json_message):
        self.game.make_suggestion(self.player, json_message["data"]["suspect"], json_message["data"]["weapon"], json_message["data"]["location"])

    def pass_suggestion(self, json_message):
        self.game.pass_suggestion()

    def refute_suggestion(self, json_message):
        self.game.refute_suggestion(self.player, json_message["data"]["card_name"])

    def make_accusation(self, json_message):
        self.game.make_accusation(self.player, json_message["data"]["suspect"], json_message["data"]["weapon"], json_message["data"]["location"])
