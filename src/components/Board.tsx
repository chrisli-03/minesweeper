import React from 'react';
import {CellType, ConfigType} from "../helpers/types";
import {CellStatus, GameStatus} from "../helpers/enums";
import Cell from "./Cell";
import {createBoard, expandEmptySpaces, setupBoard} from "../helpers/lib";

interface BoardProps {
	config: ConfigType
}
const Board:React.FC<BoardProps> = ({ config }) => {
	const [_, setTime] = React.useState(new Date().getTime()) // used to force rerender
	const [counter, setCounter] = React.useState(0) // seconds passed since start of game
	const [minesLeft, setMinesLeft] = React.useState(config.mines) // number of mines - flagged cells
	const [gameStatus, setGameStatus] = React.useState<GameStatus>(GameStatus.Playing) // playing, lost, or won

	const isFirstClick = React.useRef(false) // track if click is first click
	const board = React.useRef<CellType[][]>([]) // game board
	const cellsRemaining = React.useRef(0) // number of cells to open to win
	const cellRefs = React.useRef<Map<string, HTMLDivElement>>(null) // ref to cells, not used atm
	const counterInterval = React.useRef<NodeJS.Timer | null>(null) // interval for counter increment

	React.useEffect(() => {
		board.current = createBoard(config.width, config.height)
		setupBoard(board.current, config.mines)
		setGameStatus(GameStatus.Playing)
		setMinesLeft(config.mines)
		setTime(new Date().getTime())
		setCounter(0)

		cellsRemaining.current = Math.max(0, config.height * config.width - config.mines)
		isFirstClick.current = true
		counterInterval.current = setInterval(() => setCounter((prev) => prev += 1), 1000)

		return () => {
			if (counterInterval.current !== null) {
				clearInterval(counterInterval.current)
			}
		}
	}, [config])

	React.useEffect(() => {
		if (gameStatus !== GameStatus.Playing) {
			board.current.forEach((row) => row.forEach((cell) => cell.status = CellStatus.Opened))

			setTime(new Date().getTime())
			if (counterInterval.current !== null) { // game won, stop counter increment
				clearInterval(counterInterval.current)
			}
		}
	}, [gameStatus])

	const getMap = () => {
		if (!cellRefs.current) {
			// Initialize the Map on first usage.
			// cant figure out the cause of this typescript error
			// @ts-ignore
			cellRefs.current = new Map<string, HTMLDivElement>();
		}
		return cellRefs.current;
	}

	const cellUpdate = (x: number, y: number, status: CellStatus, changeMineCount = 0) => {
		if (board.current[x][y].value === -1 && status === CellStatus.Opened) { // clicked on mine
			if (isFirstClick.current) { // if first click is mine, repopulate board with the coord guaranteed not a mine
				board.current[x][y].value = 0
				setupBoard(board.current, config.mines, { x, y })
				cellUpdate(x, y, status)
			} else { // if not first click, game over
				setGameStatus(GameStatus.Lost)
			}
			return
		}
		isFirstClick.current = false
		board.current[x][y] = { // update coord status
			...board.current[x][y],
			status
		}
		if (status === CellStatus.Opened) {
			// setCellsRemaining(prev => prev - 1)
			cellsRemaining.current -= 1
			if (board.current[x][y].value === 0) { // if clicked on empty cell, expand
				const removedWhiteSpaces = expandEmptySpaces(board.current, x, y)
				cellsRemaining.current -= removedWhiteSpaces
				// setCellsRemaining(prev => prev - removedWhiteSpaces)
			}
		}
		if (cellsRemaining.current === 0) { // all non-mines opened, win
			setGameStatus(GameStatus.Won)
		}
		setMinesLeft((prev) => prev + changeMineCount)
		setTime(new Date().getTime()) // force rerender
	}

	return (
		<div className="board">
			<div>Mines left: {minesLeft}</div>
			<div>Time: {counter}</div>
			<div>
				{
					board.current.map((row: CellType[], i) => (
						<div key={i} className="row">
							{
								row.map((cell: CellType, j) => {
									return (
										<Cell
											key={`${i}_${j}_${cell.status}`}
											value={cell.value}
											status={cell.status}
											update={(status: CellStatus, changeMineCount = 0) => cellUpdate(i, j, status, changeMineCount)}
											ref={(node) => {
												const map = getMap();
												if (node) {
													map.set(`${i}_${j}`, node);
												} else {
													map.delete(`${i}_${j}`);
												}
											}}
										/>
									)
								})
							}
						</div>
					))
				}
			</div>
			{gameStatus !== GameStatus.Playing && <div>You {gameStatus === GameStatus.Won ? 'Won!' : 'Lost!'}</div>}
		</div>
	)
}

export default Board;