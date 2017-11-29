class Player:
	
	def __init__(self, connection):
		self.name = "Player"
		self.connection = connection
		self.id = connection.id
		self.character = None
		self.location = None
		self.cards = []

	def __eq__(self, other):
		self.id == other.id

	def to_dict(self):
		return {
			"id": str(self.id),
			"name": self.name,
			"character": self.character.name if self.character is not None else None,
			"color": self.character.color if self.character is not None else None,
			"location": self.location.to_dict() if self.location is not None else None,
			"cards": [ card.to_dict() for card in self.cards ]
		}

	def set_name(self, name):
		self.name = name

	def give_card(self, card):
		self.cards.append(card)

	def send_player_data(self):
		self.connection.sendOperation("update_player", self.to_dict())