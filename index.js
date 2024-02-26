import { httpServer } from "./src/http_server/index.js";
import WebSocket, { WebSocketServer } from 'ws';
import * as userService from './src/services/userService.js';
import * as roomService from './src/services/roomService.js';
import * as gameService from './src/services/gameService.js';
import crypto from 'crypto'

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', ws => {
	console.log('Start new connection');
	let currentUser;
	ws.on('message', (message) => {
		const response = JSON.parse(message.toString());
		const data = response.data ? JSON.parse(response.data) : response.data;
		console.log(response);
		switch (response.type) {
			case 'reg':
				const userResult = userService.createUser(data);
				const regInfo = {
					type: 'reg',
					data: JSON.stringify(userResult),
					id: 0,
				};

				ws.send(JSON.stringify(regInfo));
				wss.clients.forEach(client => {
					if (client.readyState === WebSocket.OPEN) {
						updateRoom(client);
						updateWinners(client);
					}
				});

				if (!userResult.error) {
					currentUser = {
						name: userResult.name,
						id: userResult.index
					}
				}
				break;
			case 'create_room':
				roomService.createRoom(currentUser.id, currentUser.name);
				updateRoom(ws);
				break;
			case 'add_user_to_room':
				roomService.addUserToRoom(data.indexRoom, currentUser);
				const game = gameService.createGame(data.indexRoom);
				wss.clients.forEach(client => {
					if (client.readyState === WebSocket.OPEN) {
						updateRoom(client);
						sendCreateGame(client, game.gameId, currentUser.id);
					}
				});
				break;
			case 'add_ships':
				gameService.addShips(data.gameId, data.indexPlayer, data.ships);
				if (gameService.canStartGame(data.gameId)) {
					wss.clients.forEach(client => {
						if (client.readyState === WebSocket.OPEN) {
							startGame(client, data.indexPlayer, data.ships);
						}
					});
				}
				break;
		}
	});

	ws.on('error', error => {
		console.log(error);
	});
	ws.on('close', function () {
		console.log('Connection was closed');
	});
});

const updateRoom = (ws) => {
	const availableRooms = roomService.updateRoom();
	const roomsInfo = {
		type: 'update_room',
		data: JSON.stringify(availableRooms),
		id: 0,
	}
	ws.send(JSON.stringify(roomsInfo));
}

const updateWinners = (ws) => {
	const userWins = userService.getWins();
	const winsInfo = {
		type: 'update_winners',
		data: JSON.stringify(userWins),
		id: 0,
	}
	ws.send(JSON.stringify(winsInfo));
}

const sendCreateGame = (ws, gameId, userId) => {
	const playerId = crypto.randomBytes(16).toString('hex');
	gameService.addPlayer(gameId, playerId, userId);

	const createGameInfo = {
		type: 'create_game',
		data: JSON.stringify({
			idGame: gameId,
			idPlayer: playerId
		}),
		id: 0,
	}

	ws.send(JSON.stringify(createGameInfo));
}

const startGame = (ws, ships, playerId) => {
	const startGameInfo = {
		type: 'start_game',
		data: JSON.stringify({
			ships: ships,
			currentPlayerIndex: playerId
		}),
		id: 0,
	}

	ws.send(JSON.stringify(startGameInfo));
}