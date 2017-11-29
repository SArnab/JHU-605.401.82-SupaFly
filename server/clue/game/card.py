class Card:
	card_type = None

	def __init__(self, name):
		self.name = name

	def __eq__(self, other):
		return self.name == other.name

	def to_dict(self):
		return {
			"name": self.name,
			"type": self.card_type
		}

class Weapon(Card):
	card_type = "weapon"

class Suspect(Card):
	card_type = "suspect"

class Room(Card):
	card_type = "room"