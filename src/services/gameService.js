import crypto from 'crypto'

const games = [];
const playerIdUserId = new Map();

const createGame = (roomId) => {
	const gameId = crypto.randomBytes(16).toString('hex');
	const newGame = {
		gameId: gameId,
		roomId: roomId,
		players: [],
		playerShips: []
	}
	games.push(newGame);

	return newGame;
}

const addPlayer = (gameId, playerId, userId) => {
	const game = games.find(g => g.gameId === gameId);
	if (game) {
		game.players.push(playerId);
		playerIdUserId.set(playerId, userId);
	}
}

const addShips = (gameId, playerId, ships) => {
	const game = games.find(g => g.gameId === gameId);
	if (game) {
		game.playerShips.push({
			playerId: playerId,
			ships: ships
		});
	}
}

const canStartGame = (gameId) => {
	const game = games.find(g => g.gameId === gameId);
	if (game) {
		return game.playerShips.length > 1;
	}

	return false;
}

export { createGame, addPlayer,addShips, canStartGame };