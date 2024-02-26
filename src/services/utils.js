// direction: true = vertical = to bottom; false = horizontal = to right
// starting point (0, 0) - top-left corner, x - num of column, y - num of row

const convertShipsToMatrix = (ships) => {
	const matrix = createMatrix(10, 10);
	ships.forEach(ship => {
		const x = ship.position.x;
		const y = ship.position.y;
		const direction = ship.direction;
		for (let i = 0; i < ship.length; i++) {
			if (direction) {
				matrix[y + i][x] = 1;
			} else {
				matrix[y][x + i] = 1;
			}
		}
	});

	return matrix;
}

const createMatrix = (numRows, numCol) => {
	const matrix = [];
	for (let i = 0; i < numRows; i++) {
		const row = [];
		for (let j = 0; j < numCol; j++) {
			row.push(0);
		}
		matrix.push(row);
	}

	return matrix;
}

export { convertShipsToMatrix }