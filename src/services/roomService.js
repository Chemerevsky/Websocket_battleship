const rooms = [];
let lasttRoomId = 0;

const createRoom = (userId, userName) => {
	const room = {
		roomId: ++lasttRoomId,
		roomUserIds: [{
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
				roomUsers: roomUsers
			}
		});
	return availableRooms;
}

export { createRoom, updateRoom };