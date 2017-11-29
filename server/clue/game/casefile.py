class CaseFile:

	def __init__(self, suspect, weapon, room):
		self.suspect = suspect
		self.weapon = weapon
		self.room = room

	def to_dict(self):
		return {
			"suspect": self.suspect.name,
			"weapon": self.weapon.name,
			"room": self.room.name
		}