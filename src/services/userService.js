import crypto from 'crypto'

const users = [];

const createUser = (data) => {
	const existingUser = users.find(user => user.name === data.name);
	if (existingUser) {
		if (existingUser.password !== data.password) {
			return {
				name: existingUser.name,
				index: existingUser.id,
				error: true,
				errorText: 'Wrong password'
			}
		}

		return existingUser;
	}

	const user = {
		name: data.name,
		password: data.password,
		id: crypto.randomBytes(16).toString('hex'),
		wins: 0
	};

	users.push(user);

	return {
		name: user.name,
		index: user.id,
		error: false,
		errorText: ''
	};
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