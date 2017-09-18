from autobahn.twisted.websocket import WebSocketServerProtocol
from twisted.python import log

class ClueServerProtocol(WebSocketServerProtocol):

	def onMessage(self, payload, isBinary):
		message = payload.decode("utf-8")
		log.msg("Received message [%s]" % message)