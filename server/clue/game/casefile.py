class CaseFile:

	def __init__(self, suspect, weapon, location):
		self.suspect = suspect
		self.weapon = weapon
		self.location = location

	def to_dict(self):
		return {
			"suspect": self.suspect.name,
			"weapon": self.weapon.name,
			"location": self.location.name
		}