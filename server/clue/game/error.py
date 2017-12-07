class GameError(Exception):
	
	def __init__(self, msg, code=None):
		self.msg = msg
		self.code = code

	def to_dict(self):
		return {
			"message": self.msg,
			"code": self.code
		}