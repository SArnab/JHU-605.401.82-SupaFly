from autobahn.twisted.websocket import WebSocketServerProtocol
from twisted.python import log
from clue import errors
from uuid import uuid1
from txaio import create_future

class ClueServerProtocol(WebSocketServerProtocol):

    def __init__(self):
        self.id = uuid1()
        self.is_closed = create_future()

    def onConnect(self, request):
        pass

    def onOpen(self):
        log.msg("New Connection", self.id)

        # If we fail to track the connection, close it.
        try:
            self.factory.track_connection(self)
        except Exception:
            log.err("Failed to track connection")
            self.sendClose(errors.DUPLICATE_CONNECTION_ID)

    # Called when the server receives a message on
    # this connection
    def onMessage(self, payload, isBinary):
        message = payload.decode("utf-8")
        log.msg("Received message [%s]" % message)


    # Called when the connection is closed.
    def onClose(self, wasClean, code, reason):
        log.msg("Connection [%s] closed [wasClean: %d]" % (self.id, wasClean))
        self.factory.untrack_connection(self)