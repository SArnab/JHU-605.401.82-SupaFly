from autobahn.twisted.websocket import WebSocketServerFactory
from clue.protocol import ClueServerProtocol

class ClueServerFactory(WebSocketServerFactory):

    protocol = ClueServerProtocol

    def __init__(self, *args, **kwargs):
        super(WebSocketServerFactory, self).__init__(*args, **kwargs)
        # Tracks each connection
        self.connections = {}

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
