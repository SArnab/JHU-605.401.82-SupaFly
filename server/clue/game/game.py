from clue.game.character import Colonel, Scarlet, Professor, Green, White, Peacock
from clue.game.location import Study, Hall, Lounge, Library, BilliardRoom, DiningRoom, Conservatory, Ballroom, Kitchen, HallwayStudyToHall, HallwayHallToLounge, HallwayStudyToLibrary, HallwayHallToBilliardRoom, HallwayLoungeToDiningRoom, HallwayLibraryToBilliardRoom, HallwayBilliardRoomToDiningRoom, HallwayLibraryToConservatory, HallwayBilliardRoomToBallroom, HallwayDiningRoomToKitchen, HallwayConservatoryToBallroom, HallwayBallroomToKitchen
from clue.game.card import Weapon, Suspect, Room
from clue.game.casefile import CaseFile
from clue.game.suggestion import Suggestion
from clue.game.error import GameError
from twisted.python import log
from random import randint, shuffle, choice

TURN_STATE_WAITING_TO_MOVE = "waiting_to_move"
TURN_STATE_WAITING_TO_SUGGEST = "waiting_to_suggest"
TURN_STATE_IS_SUGGESTING = "suggesting"
TURN_STATE_WAITING_TO_ACCUSE = "waiting_to_accuse"
TURN_STATE_IS_ACCUSING = "accusing"

class Game:

	def __init__(self):
		self.players = {}
		self.in_progress = False
		self.num_turns = 0
		self.active_turn = None
		self.active_turn_state = None
		self.case_file = None
		self.active_suggestion = None
		self.active_suggestion_turn = None
		self.winner = None
		self.game_over = False

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

		suspects = [card for card in deck if card.card_type == "suspect"]
		rooms = [card for card in deck if card.card_type == "room"]
		weapons = [card for card in deck if card.card_type == "weapon"]
		
		self.case_file = CaseFile(choice(suspects), choice(weapons), choice(rooms))

		log.msg("Generated CaseFile [%s,%s,%s]" % (self.case_file.suspect, self.case_file.weapon, self.case_file.location))

		# Remove these cards from the deck
		deck.remove(self.case_file.suspect)
		deck.remove(self.case_file.weapon)
		deck.remove(self.case_file.location)

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
		self.active_turn_state = TURN_STATE_WAITING_TO_MOVE

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
			new_row = 0
			new_col = 0

		elif direction == "up_right":
			new_row = 0
			new_col = len(self.grid[new_row]) - 1

		elif direction == "down_left":
			new_row = len(self.grid) - 1
			new_col = 0

		elif direction == "down_right":
			new_row = len(self.grid) - 1
			new_col = len(self.grid[new_row]) - 1

		log.msg("Moving player from [%d,%d] to [%d,%d]" % (row, col, new_row, new_col))

		# If new row/col is valid, move player to that position.
		if new_row >= 0 and new_row < len(self.grid):
			if new_col >= 0 and new_col < len(self.grid[new_row]):
				new_location = self.grid[new_row][new_col]
				if new_location is not None:

					# Is there room in the new location?
					if new_location.is_hallway() and new_location.num_players() == 1:
						raise GameError("Hallway is blocked by another player.")

					player.location.remove_player(player)
					new_location.add_player(player)

		# Broadcast the new game state
		self.broadcast_game_state()

	def next_turn(self):
		original_turn = self.active_turn
		player_id_list = self.players.keys()
		idx = player_id_list.index(self.active_turn)
		self.active_turn = None
		
		while self.active_turn is None:
			idx = idx + 1
			next_idx = idx % len(player_id_list)

			# Did we loop back around...
			if player_id_list[next_idx] == original_turn:
				self.game_over = True
				self.broadcast_game_state()
				raise GameError("No remaining active players. Game over.")

			# Is the next player out?
			if self.players[player_id_list[next_idx]].did_fail_accusation:
				continue

			# If we made it here, then we have the next turn
			self.active_turn = player_id_list[next_idx]
			

		# # Wrap around to the front of the list if have reached the end
		# while i < 6:
		# 	if idx + 1 >= len(player_id_list):
		# 		self.active_turn = player_id_list[0]
		# 	else:
		# 		self.active_turn = player_id_list[idx + 1]

		self.active_turn_state = TURN_STATE_WAITING_TO_MOVE
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

	def make_suggestion(self, player, suspect, weapon, location):
		if self.active_suggestion is not None:
			raise Exception("There is already an active suggestion.")
		
		# Move the suspect into the location
		did_move = False
		new_location = next(loc for row in self.grid for loc in row if loc is not None and loc.name == location)
		for playerId in self.players:
			suspect_player = self.players[playerId]
			if suspect_player.character.name == suspect:
				suspect_player.location.remove_player(suspect_player)
				new_location.add_player(suspect_player)
				did_move = True
				break

		if did_move is False:
			log.msg("Failed to move suspect %s into location %s" % (suspect, location))
			raise GameError("Unrecognized suspect and location.")

		# Store suggestion data
		self.active_suggestion = Suggestion(
			player,
			suspect,
			weapon,
			location
		)

		# Each subsequent player must now try to refuse the suggestion.
		self.active_turn_state = TURN_STATE_IS_SUGGESTING
		player_id_list = self.players.keys()
		idx = player_id_list.index(self.active_suggestion.player.id)
		next_idx = (idx + 1) % len(player_id_list)
		self.active_suggestion_turn = player_id_list[next_idx]

		self.broadcast_game_state()
	
	def pass_suggestion(self):
		if self.active_suggestion is None or self.active_suggestion_turn is None or not self.active_turn_state == TURN_STATE_IS_SUGGESTING:
			raise Exception("There is no active suggestion.")

		player_id_list = self.players.keys()
		idx = player_id_list.index(self.active_suggestion_turn)
		next_idx = (idx + 1) % len(player_id_list)
		
		# If we wrapped back around to the player, then the suggestion is 100% correct.
		if player_id_list[next_idx] == self.active_suggestion.player.id:
			self.end_suggestion()
		# Otherwise, pass the suggestion onto the next player.
		else:
			self.active_suggestion_turn = player_id_list[next_idx]

		self.broadcast_game_state()

	def refute_suggestion(self, player, card_name):
		if self.active_suggestion is None or not self.active_turn_state == TURN_STATE_IS_SUGGESTING:
			raise Exception("There is no active suggestion.")

		options = [ self.active_suggestion.suspect, self.active_suggestion.location, self.active_suggestion.weapon ]
		if card_name in options:
			# Show the refuted card to the author of the suggestion.
			suggestion_player = self.active_suggestion.player
			suggestion_player.connection.sendOperation("suggestion_was_refuted", {
				"card_name": card_name,
				"refuting_player": str(player.id),
				"suggestion": self.active_suggestion.to_dict()
			})

			# End the active suggestion
			self.end_suggestion()

	def end_suggestion(self):
		if self.active_suggestion is None or not self.active_turn_state == TURN_STATE_IS_SUGGESTING:
			raise Exception("There is no active suggestion.")

		self.active_turn_state = TURN_STATE_WAITING_TO_ACCUSE
		self.active_suggestion = None
		self.active_suggestion_turn = None

		self.broadcast_game_state()

	def make_accusation(self, player, suspect, weapon, location):
		if player.did_fail_accusation:
			raise GameError("Player already failed accusastion.")

		for playerId in self.players:
			if not playerId == player.id:
				self.players[playerId].send_message("%s accuses %s of committing the crime in %s with a %s" % (player.character.name, suspect, location, weapon))

		suspect_match = True if self.case_file.suspect.name == suspect else False
		weapon_match = True if self.case_file.weapon.name == weapon else False
		location_match = True if self.case_file.location.name == location else False

		if suspect_match and weapon_match and location_match:

			# Let everyone know
			for playerId in self.players:
				self.players[playerId].connection.sendOperation("accusation_did_succeed", {
					"case_file": self.case_file.to_dict(),
					"player": str(player.id)
				})

			# Player is correct!
			self.winner = player.id
			self.broadcast_game_state()

		else:
			# Player failed the accusation. He/she is out.
			player.did_fail_accusation = True

			# Move the player to a room
			while player.location.is_hallway():
				if player.location.move_up:
					self.move_player(player, "up")
					continue
				
				if player.location.move_down:
					self.move_player(player, "down")
					continue
				
				if player.location.move_left:
					self.move_player(player, "left")
					continue

				if player.location.move_right:
					self.move_player(player, "right")
					continue
				
				# Default to study
				self.player.location = self.grid[0][0]

			# Send the player a message
			player.connection.sendOperation("accusation_did_fail", {
				"case_file": self.case_file.to_dict()
			})

			# Let everyone else know
			for playerId in self.players:
				if not playerId == player.id:
					self.players[playerId].send_message("%s failed the accusation. He is out." % (player.character.name))

			# Update the game state for all clients
			self.next_turn()
			self.broadcast_game_state()

	def to_dict(self):
		return {
			"players": [self.players[player].to_dict() for player in self.players],
			"num_turns": self.num_turns,
			"in_progress": self.in_progress,
			"active_turn": str(self.active_turn),
			"active_turn_state": self.active_turn_state,
			"locations": [ location.to_dict() for row in self.grid for location in row if location is not None ],
			"case_file": self.case_file.to_dict() if self.case_file is not None else None,
			"active_suggestion": self.active_suggestion.to_dict() if self.active_suggestion is not None else None,
			"active_suggestion_turn": str(self.active_suggestion_turn) if self.active_suggestion_turn is not None else None,
			"winner": str(self.winner) if self.winner is not None else None,
			"game_over": self.game_over
		}