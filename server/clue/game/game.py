from clue.game.character import Colonel, Scarlet, Professor, Green, White, Peacock
from clue.game.location import Study, Hall, Lounge, Library, BilliardRoom, DiningRoom, Conservatory, Ballroom, Kitchen, HallwayStudyToHall, HallwayHallToLounge, HallwayStudyToLibrary, HallwayHallToBilliardRoom, HallwayLoungeToDiningRoom, HallwayLibraryToBilliardRoom, HallwayBilliardRoomToDiningRoom, HallwayLibraryToConservatory, HallwayBilliardRoomToBallroom, HallwayDiningRoomToKitchen, HallwayConservatoryToBallroom, HallwayBallroomToKitchen
from clue.game.card import Weapon, Suspect, Room
from clue.game.casefile import CaseFile
from twisted.python import log
from random import randint, shuffle, choice

class Game:

	def __init__(self):
		self.players = {}
		self.in_progress = False
		self.num_turns = 0
		self.active_turn = None
		self.case_file = None

		self.grid = [
			[Study(), HallwayStudyToHall(), Hall(), HallwayHallToLounge(), Lounge()],
			[HallwayStudyToLibrary(), None, HallwayHallToBilliardRoom(), None, HallwayLoungeToDiningRoom()],
			[Library(), HallwayLibraryToBilliardRoom(), BilliardRoom(), HallwayBilliardRoomToDiningRoom(), DiningRoom()],
			[HallwayLibraryToConservatory(), None, HallwayBilliardRoomToBallroom(), None, HallwayDiningRoomToKitchen()],
			[Conservatory(), HallwayConservatoryToBallroom(), Ballroom(), HallwayBallroomToKitchen(), Kitchen()]
		]

	def is_in_progress(self):
		return self.in_progress

	def num_players(self):
		return len(self.players)

	def add_player(self, player):
		if player.id in self.players:
			raise Exception("Player is already part of this game.")

		# What character should this player be?
		characters = [Colonel, Scarlet, Professor, Green, White, Peacock]
		for option in characters:
			unique = True
			for playerId in self.players:
				if self.players[playerId].character.color == option.color:
					unique = False
					break

			if unique:
				player.character = option(player)
				break

		if player.character is None:
			raise Exception("Player has no character.")

		self.players[player.id] = player
		self.broadcast_game_state()
		
		# Start the game if we have enough players.
		if self.num_players() >= 6: self.start()

	def remove_player(self, player):
		try:
			del self.players[player.id]
			self.broadcast_game_state()
		except KeyError: pass

	def start(self):
		if self.in_progress:
			raise Exception("Game has already started.")

		# Build the case file
		# Select one random suspect, one random weapon, and one random room
		deck = self.build_deck()

		suspects = [card for card in deck if card.card_type == "suspect" ]
		rooms = [card for card in deck if card.card_type == "room" ]
		weapons = [card for card in deck if card.card_type == "weapon" ]
		
		self.case_file = CaseFile(choice(suspects), choice(weapons), choice(rooms))
		# Remove these cards from the deck
		deck.remove(self.case_file.suspect)
		deck.remove(self.case_file.weapon)
		deck.remove(self.case_file.room)

		# Shuffle and deal the remaining cards to each player
		shuffle(deck)
		while len(deck) > 0:
			for playerId in self.players:
				if len(deck) == 0: break
				self.players[playerId].give_card(deck.pop())

		# Place all the characters in a random room
		for playerId in self.players:
			player = self.players[playerId]
			while player.location is None:
				possible_location = self.grid[randint(0,4)][randint(0,4)]
				if possible_location is None: continue
				if possible_location.num_players() > 0: continue
				if not possible_location.loc_type == "room": continue 
				player.location = possible_location
			player.location.add_player(player)
		
		# Set the first turn (Mrs. Scarlet always goes first)
		self.active_turn = next(playerId for playerId in self.players if self.players[playerId].character.color == "red")

		# Mark the game as in progress
		self.in_progress = True

		# Broadcast the state
		self.broadcast_game_state()

	def move_player(self, player, direction):
		row = None
		col = None
		for i in range(0, len(self.grid)):
			for j in range(0, len(self.grid[i])):
				if player.location == self.grid[i][j]:
					row = i
					col = j
					break

		if row is None or col is None:
			return

		new_row = row
		new_col = col

		if direction == "up":
			new_row += -1

		elif direction == "down":
			new_row += 1

		elif direction == "left":
			new_col += -1

		elif direction == "right":
			new_col += 1

		elif direction == "up_left":
			new_row += -1
			new_col += -1

		elif direction == "up_right":
			new_row += -1
			new_col += 1

		elif direction == "down_left":
			new_row += 1
			new_col += -1

		elif direction == "down_right":
			new_row += 1
			new_col += 1

		log.msg("Moving player from [%d,%d] to [%d,%d]" % (row, col, new_row, new_col))

		# If new row/col is valid, move player to that position.
		if new_row >= 0 and new_row < len(self.grid):
			if new_col >= 0 and new_col < len(self.grid[new_row]):
				new_location = self.grid[new_row][new_col]
				if new_location is not None:
					player.location.remove_player(player)
					new_location.add_player(player)

		# Broadcast new game state
		self.broadcast_game_state()

	def next_turn(self):
		player_id_list = self.players.keys()
		idx = player_id_list.index(self.active_turn)
		# Wrap around to the front of the list if have reached the end
		if idx + 1 >= len(player_id_list):
			self.active_turn = player_id_list[0]
		else:
			self.active_turn = player_id_list[idx + 1]
		self.broadcast_game_state()

	def broadcast_game_state(self):
		state = self.to_dict()
		for playerId in self.players:
			self.players[playerId].send_player_data()
			self.players[playerId].connection.sendOperation("update_game_state", state)

	def build_deck(self):
		deck = [
			Weapon("Rope"),
			Weapon("Lead Pipe"),
			Weapon("Knife"),
			Weapon("Wrench"),
			Weapon("Candlestick"),
			Weapon("Revolver"),
			Room("Study"),
			Room("Hall"),
			Room("Lounge"),
			Room("Library"),
			Room("Billiard Room"),
			Room("Dining Room"),
			Room("Conservatory"),
			Room("Ballroom"),
			Room("Kitchen"),
			Suspect(Colonel.name),
			Suspect(Scarlet.name),
			Suspect(Professor.name),
			Suspect(Green.name),
			Suspect(White.name),
			Suspect(Peacock.name)
		]

		return deck

	def to_dict(self):
		return {
			"players": [self.players[player].to_dict() for player in self.players],
			"num_turns": self.num_turns,
			"in_progress": self.in_progress,
			"active_turn": str(self.active_turn),
			"locations": [ location.to_dict() for row in self.grid for location in row if location is not None ],
			"case_file": self.case_file.to_dict() if self.case_file is not None else None
		}