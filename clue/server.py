import sys
from twisted.internet import reactor
from twisted.python import log
from autobahn.twisted.websocket import WebSocketServerFactory
from clue.protocol import ClueServerProtocol

def launch_server(port):
	# Start logging to STDOUT
	log.startLogging(sys.stdout)

	# Initialize the factory.
	# This will create the ClueServerProtocol for
	# each connection
	factory = WebSocketServerFactory()
	factory.protocol = ClueServerProtocol

	# Start the Twisted reactor
	# Main thread is now blocked
	reactor.listenTCP(port, factory)
	reactor.run()

if __name__ == "__main__":

	import argparse

	parser = argparse.ArgumentParser(description="SupaFly Clue Server")
	parser.add_argument("--port", type=int, default=9000, help="The port on which the server should listen.")
	options = parser.parse_args()

	# Launch a master
	launch_server(port=options.port)