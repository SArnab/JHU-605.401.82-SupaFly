from autobahn.twisted.websocket import WebSocketServerProtocol
from twisted.python import log
from clue import errors
from uuid import uuid1
from txaio import create_future

class ClueServerProtocol(WebSocketServerProtocol):

    def __init__(self):
        self.id = uuid1()
        self.is_closed = create_future()

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
        except Exception:
            log.err("Failed to track connection")
            self.sendClose(errors.DUPLICATE_CONNECTION_ID)

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
            self.sendMessage(u"PONG", False)
        else:
            # Echo
            self.sendMessage(payload, isBinary)

    '''
    Called when this connection is closed.
    '''
    def onClose(self, wasClean, code, reason):
        log.msg("Connection [%s] closed [wasClean: %d]" % (self.id, wasClean))
        self.factory.untrack_connection(self)