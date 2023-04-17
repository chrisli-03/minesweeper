import {CellStatus} from "./enums";
import {CellType, CoordType} from "./types";

export const createBoard = (width: number, height: number): CellType[][] => {
	return Array(width).fill(0).map(() => Array(height).fill(0).map(() => ({ value: 0, status: CellStatus.Closed })))
}

const getRandomInt = (max: number) => {
	max = Math.floor(max);
	return Math.floor(Math.random() * (max + 1));
}

const increaseCellValue = (cell: CellType) => {
	if (cell.value !== -1) {
		cell.value += 1
	}
}

const setupBoardSimple = (board: CellType[][], mines: number, safePos: CoordType) => {
	const rows = board.length - 1
	const cols = board[0].length - 1
	for (let i = 0; i < mines; i += 1) {
		const x = getRandomInt(rows)
		const y = getRandomInt(cols)
		if (board[x][y].value === -1 || (x === safePos.x && y === safePos.y)) {
			i -= 1
			continue
		} else {
			board[x][y].value = -1
			board?.[x-1]?.[y-1] && increaseCellValue(board?.[x-1]?.[y-1])
			board?.[x-1]?.[y] && increaseCellValue(board?.[x-1]?.[y])
			board?.[x-1]?.[y+1] && increaseCellValue(board?.[x-1]?.[y+1])
			board?.[x]?.[y-1] && increaseCellValue(board?.[x]?.[y-1])
			board?.[x]?.[y+1] && increaseCellValue(board?.[x]?.[y+1])
			board?.[x+1]?.[y-1] && increaseCellValue(board?.[x+1]?.[y-1])
			board?.[x+1]?.[y] && increaseCellValue(board?.[x+1]?.[y])
			board?.[x+1]?.[y+1] && increaseCellValue(board?.[x+1]?.[y+1])
		}
	}
}

const shuffle = <T,>(array: T[]) => {
	let currentIndex = array.length, randomIndex

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]]
	}

	return array
}

const setupBoardComplex = (board: CellType[][], mines: number, safePos: CoordType) => {
	const rows = board.length
	const cols = board[0].length
	const availableCells = []
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (i === safePos.x && j === safePos.y) {
				continue
			}
			availableCells.push(`${i}_${j}`)
		}
	}
	shuffle<string>(availableCells)
	for (let i = 0; i < Math.min(mines, rows * cols); i += 1) {
		const item = availableCells.pop()
		if (typeof item === 'undefined') {
			break
		}
		const coords: string[] = item.split('_')
		const x = Number(coords[0])
		const y = Number(coords[1])
		board[x][y].value = -1
		board?.[x-1]?.[y-1] && increaseCellValue(board?.[x-1]?.[y-1])
		board?.[x-1]?.[y] && increaseCellValue(board?.[x-1]?.[y])
		board?.[x-1]?.[y+1] && increaseCellValue(board?.[x-1]?.[y+1])
		board?.[x]?.[y-1] && increaseCellValue(board?.[x]?.[y-1])
		board?.[x]?.[y+1] && increaseCellValue(board?.[x]?.[y+1])
		board?.[x+1]?.[y-1] && increaseCellValue(board?.[x+1]?.[y-1])
		board?.[x+1]?.[y] && increaseCellValue(board?.[x+1]?.[y])
		board?.[x+1]?.[y+1] && increaseCellValue(board?.[x+1]?.[y+1])
	}
}

export const setupBoard = (board: CellType[][], mines: number, safePos: CoordType = {x: -1, y: -1}) => {
	const rows = board.length - 1
	const cols = board[0].length - 1
	// avoid duplication when number of mines is high
	if (mines > rows * cols / 2) {
		setupBoardComplex(board, mines, safePos)
	} else {
		setupBoardSimple(board, mines, safePos)
	}
	return board
}

export const expandEmptySpaces = (board: CellType[][], x: number, y: number) => {
	let count = 0
	const queue = [{x, y}]
	const visitedCells = new Set()
	const pushCellToQueue = (x: number, y: number) => {
		if (
			!visitedCells.has(`${x}_${y}`)
			&& typeof board?.[x]?.[y] !== 'undefined'
		) {
			queue.push({x, y})
		}
		visitedCells.add(`${x}_${y}`)
	}
	while (queue.length > 0) {
		const {x, y} = queue.pop() as { x: number; y: number; }
		if (board[x][y].status === CellStatus.Closed) {
			board[x][y].status = CellStatus.Opened
			count += 1
		}
		if (board[x][y].value === 0) {
			pushCellToQueue(x-1, y-1)
			pushCellToQueue(x-1, y)
			pushCellToQueue(x-1, y+1)
			pushCellToQueue(x, y-1)
			pushCellToQueue(x, y+1)
			pushCellToQueue(x+1, y-1)
			pushCellToQueue(x+1, y)
			pushCellToQueue(x+1, y+1)
		}
	}
	return count
}