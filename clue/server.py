import sys
from twisted.internet import reactor
from twisted.python import log
from clue.websocket.factory import ClueServerFactory
from autobahn.websocket.util import parse_url

def launch_server(uri):
	# Start logging to STDOUT
	log.startLogging(sys.stdout)

	# Initialize the factory.
    # The factory is responsible for creating the protocol
    # for each connection. It is the shared data-model
    # across all connections.
	factory = ClueServerFactory(uri)

	# Parse the uri
	isSecure, host, port, resource, path, params = parse_url(uri)

	# Start the Twisted reactor
	# Main thread is now blocked
	reactor.listenTCP(port, factory)
	reactor.run()