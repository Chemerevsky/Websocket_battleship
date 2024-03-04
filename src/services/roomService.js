import crypto from 'crypto'

const rooms = [];

const createRoom = (userId, userName) => {
	const room = {
		roomId: crypto.randomBytes(16).toString('hex'),
		roomUsers: [{
			userId: userId,
			userName: userName
		}],
	};
	rooms.push(room);

	return room;
}

const updateRoom = () => {
	const availableRooms = rooms.filter(room => room.roomUsers.length === 1)
		.map(room => {
			return {
				roomId: room.roomId,
				roomUsers: room.roomUsers
			}
		});
	return availableRooms;
}

const addUserToRoom = (roomId, user) => {
	const roomToAdd = rooms.find(room => room.roomId === roomId);
	if (roomToAdd) {
		if (!roomToAdd.roomUsers.some(u => u.id === user.id)) {
			roomToAdd.roomUsers.push({
				userId: user.id,
				userName: user.name
			});
		}
	}
}

export { createRoom, updateRoom, addUserToRoom };