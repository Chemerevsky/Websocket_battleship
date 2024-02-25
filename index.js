import { httpServer } from "./src/http_server/index.js";
import WebSocket, { WebSocketServer } from 'ws';
import * as userService from './src/services/userService.js';
import * as roomService from './src/services/roomService.js';

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
				const newUser = userService.createUser(data);
				currentUser = newUser;
				const regInfo = {
					type: 'reg',
					data:
						JSON.stringify({
							name: newUser.name,
							index: newUser.id,
							error: false,
							errorText: ''
						}),
					id: 0,
				};
				ws.send(JSON.stringify(regInfo));
				wss.clients.forEach(client => {
					if (client.readyState === WebSocket.OPEN) {
						updateRoom(client);
						updateWinners(client);
					}
				});
				break;
			case 'create_room':
				roomService.createRoom(currentUser.id, currentUser.name);
				updateRoom(ws);
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