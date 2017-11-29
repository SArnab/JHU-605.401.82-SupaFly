class Character:

	color = None
	name = None

	def __init__(self, player):
		self.player = player

class Colonel(Character):

	name = "Colonel Mustard"
	color = "yellow"

class Scarlet(Character):

	name = "Miss. Scarlet"
	color = "red"

class Professor(Character):

	name = "Professor Plum"
	color = "purple"

class Green(Character):

	name = "Mr. Green"
	color = "green"

class White(Character):

	name = "Mrs. White"
	color = "white"

class Peacock(Character):
	
	name = "Mrs. Peacock"
	color = "blue"
	