const rooms = [];
let lastRoomId = 0;

const createRoom = (userId, userName) => {
	const room = {
		roomId: ++lastRoomId,
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

export { createRoom, updateRoom };