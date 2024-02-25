let lastUserId = 0;
const users = [];

const createUser = (data) => {
	const existingUser = users.find(user => user.name === data.name);
	if (existingUser) {
		return existingUser;
	}

	const user = {
		name: data.name,
		password: data.password,
		id: ++lastUserId,
		wins: 0
	};
	users.push(user);

	return user;
}

const getWins = () => {
	const userWins = users.map(user => {
		return {
			name: user.name,
			wins: user.wins
		}
	});

	return userWins;
}
export { createUser, getWins };