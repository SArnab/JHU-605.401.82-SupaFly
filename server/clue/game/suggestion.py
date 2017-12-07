class Suggestion:

	def __init__(self, player, suspect, weapon, location):
		self.player = player
		self.suspect = suspect
		self.weapon = weapon
		self.location = location

	def to_dict(self):
		return {
			"player": str(self.player.id),
			"suspect": self.suspect,
			"weapon": self.weapon,
			"location": self.location
		}