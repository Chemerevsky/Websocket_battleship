import crypto from 'crypto'
import { convertShipsToMatrix } from './utils.js'

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
		const shipMatrix = convertShipsToMatrix(ships);
		game.playerShips.push({
			playerId: playerId,
			ships: ships,
			shipMatrix: shipMatrix
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

const attack = (gameId, x, y, playerId) => {
	const game = games.find(g => g.gameId === gameId);
	if (!game) {
		return;
	}

	let status = 'miss';
	const enemyShips = game.playerShips.find(p => p.playerId !== playerId);
	if (enemyShips.shipMatrix[y][x] === 1) {
		enemyShips.shipMatrix[y][x] = 0;
		if (wasKilled(enemyShips.shipMatrix, x, y)) {
			status = 'killed';
		} else {
			status = 'shot';
		}
	}

	return status;
}

const wasKilled = (matrix, x, y) => {
	if (matrix[y + 1] ? matrix[y + 1][x] : false ||
		matrix[y - 1] ? matrix[y - 1][x] : false ||
		matrix[y][x + 1] || matrix[y][x - 1]) {
			return false;
	}

	return true;
}

const hasEnemyShip = (gameId, playerId, ) => {
	const game = games.find(g => g.gameId === gameId);
	if (!game) {
		return false;
	}

	const enemyShips = game.playerShips.find(p => p.playerId !== playerId);
	return enemyShips.shipMatrix.some(rows => rows.some(cell => cell === 1));
}

const getUserIdByPlayerId = (playerId) => {
	const userId = playerIdUserId.get(playerId);
	return userId;
}

export { createGame, addPlayer,addShips, canStartGame, attack, hasEnemyShip, getUserIdByPlayerId };