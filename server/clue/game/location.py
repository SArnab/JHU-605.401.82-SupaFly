class Location:
	name = None
	loc_type = None
	move_up = False
	move_down = False
	move_left = False
	move_right = False
	move_down_right = False
	move_down_left = False
	move_up_right = False
	move_up_left = False

	def __init__(self):
		self.players = {}

	def add_player(self, player):
		self.players[player.id] = player
		player.location = self

	def remove_player(self, player):
		del self.players[player.id]

	def has_player(self, player):
		return player.id in self.players

	def num_players(self):
		return len(self.players)

	def is_room(self):
		return self.loc_type == "room"

	def is_hallway(self):
		return self.loc_type == "hallway"

	def to_dict(self):
		return {
			"name": self.name,
			"type": self.loc_type,
			"players": [str(playerId) for playerId in self.players],
			"move_up": self.move_up,
			"move_down": self.move_down,
			"move_left": self.move_left,
			"move_right": self.move_right,
			"move_up_right": self.move_up_right,
			"move_up_left": self.move_up_left,
			"move_down_left": self.move_down_left,
			"move_down_right": self.move_down_right
		}

class Study(Location):
	name = "Study"
	loc_type = "room"
	move_right = True
	move_down = True
	move_down_right = True

class Hall(Location):
	name = "Hall"
	loc_type = "room"
	move_right = True
	move_left = True
	move_down = True

class Lounge(Location):
	name = "Lounge"
	loc_type = "room"
	move_left = True
	move_down = True
	move_down_left = True

class Library(Location):
	name = "Library"
	loc_type = "room"
	move_up = True
	move_down = True
	move_right = True

class BilliardRoom(Location):
	name = "Billiard Room"
	loc_type = "room"
	move_up = True
	move_down = True
	move_left = True
	move_right = True

class DiningRoom(Location):
	name = "Dining Room"
	loc_type = "room"
	move_left = True
	move_up = True
	move_down = True

class Conservatory(Location):
	name = "Conservatory"
	loc_type = "room"
	move_up = True
	move_right = True
	move_up_right = True

class Ballroom(Location):
	name = "Ballroom"
	loc_type = "room"
	move_up = True
	move_left = True
	move_right = True

class Kitchen(Location):
	name = "Kitchen"
	loc_type = "room"
	move_up = True
	move_left = True
	move_up_left = True

class HallwayStudyToHall(Location):
	name = "HallwayStudyToHall"
	loc_type = "hallway"
	move_left = True
	move_right = True

class HallwayHallToLounge(Location):
	name = "HallwayHallToLounge"
	loc_type = "hallway"
	move_left = True
	move_right = True

class HallwayStudyToLibrary(Location):
	name = "HallwayStudyToLibrary"
	loc_type = "hallway"
	move_up = True
	move_down = True

class HallwayHallToBilliardRoom(Location):
	name = "HallwayHallToBilliardRoom"
	loc_type = "hallway"
	move_up = True
	move_down = True

class HallwayLoungeToDiningRoom(Location):
	name = "HallwayLoungeToDiningRoom"
	loc_type = "hallway"
	move_up = True
	move_down = True

class HallwayLibraryToBilliardRoom(Location):
	name = "HallwayLibraryToBilliardRoom"
	loc_type = "hallway"
	move_left = True
	move_right = True

class HallwayBilliardRoomToDiningRoom(Location):
	name = "HallwayBilliardRoomToDiningRoom"
	loc_type = "hallway"
	move_left = True
	move_right = True

class HallwayLibraryToConservatory(Location):
	name = "HallwayLibraryToConservatory"
	loc_type = "hallway"
	move_up = True
	move_down = True

class HallwayBilliardRoomToBallroom(Location):
	name = "HallwayBilliardRoomToBallroom"
	loc_type = "hallway"
	move_up = True
	move_down = True

class HallwayDiningRoomToKitchen(Location):
	name = "HallwayDiningRoomToKitchen"
	loc_type = "hallway"
	move_up = True
	move_down = True

class HallwayConservatoryToBallroom(Location):
	name = "HallwayConservatoryToBallroom"
	loc_type = "hallway"
	move_left = True
	move_right = True

class HallwayBallroomToKitchen(Location):
	name = "HallwayBallroomToKitchen"
	loc_type = "hallway"
	move_left = True
	move_right = True