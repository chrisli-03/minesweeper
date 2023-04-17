import React from 'react';
import {CellType, ConfigType} from "../helpers/types";
import {CellStatus, GameStatus} from "../helpers/enums";
import Cell from "./Cell";
import {createBoard, expandEmptySpaces, setupBoard} from "../helpers/lib";

interface BoardProps {
	config: ConfigType
}
const Board:React.FC<BoardProps> = ({ config }) => {
	const [_, setTime] = React.useState(new Date().getTime())
	const isFirstClick = React.useRef(false)
	const [gameStatus, setGameStatus] = React.useState<GameStatus>(GameStatus.Playing)
	const board = React.useRef<CellType[][]>([])
	const cellsRemaining = React.useRef(0)

	React.useEffect(() => {
		board.current = createBoard(config.width, config.height)
		setupBoard(board.current, config.mines)
		setGameStatus(GameStatus.Playing)
		cellsRemaining.current = config.height * config.width - config.mines
		isFirstClick.current = true
		setTime(new Date().getTime())
	}, [config])

	React.useEffect(() => {
		if (gameStatus !== GameStatus.Playing) {
			board.current.forEach((row) => row.forEach((cell) => cell.status = CellStatus.Opened))
			setTime(new Date().getTime())
		}
	}, [gameStatus])

	const cellUpdate = (x: number, y: number, status: CellStatus) => {
		if (board.current[x][y].value === -1 && status === CellStatus.Opened) {
			if (isFirstClick.current) {
				board.current[x][y].value = 0
				setupBoard(board.current, config.mines, { x, y })
				cellUpdate(x, y, status)
			} else {
				setGameStatus(GameStatus.Lost)
				return
			}
		}
		isFirstClick.current = false
		board.current[x][y] = {
			value: board.current[x][y].value,
			status
		}
		if (status === CellStatus.Opened) {
			// setCellsRemaining(prev => prev - 1)
			cellsRemaining.current -= 1
			if (board.current[x][y].value === 0) {
				const removedWhiteSpaces = expandEmptySpaces(board.current, x, y)
				cellsRemaining.current -= removedWhiteSpaces
				// setCellsRemaining(prev => prev - removedWhiteSpaces)
			}
		}
		if (cellsRemaining.current === 0) {
			setGameStatus(GameStatus.Won)
		}
		setTime(new Date().getTime())
	}

	return (
		<div className="board">
			{
				board.current.map((row: CellType[], i) => (
					<div key={i} className="row">
						{
							row.map((cell: CellType, j) => (
								<Cell
									key={`${i}_${j}_${cell.status}`}
									value={cell.value}
									status={cell.status}
									update={(status: CellStatus) => cellUpdate(i, j, status)}
								/>
							))
						}
					</div>
				))
			}
			{gameStatus !== GameStatus.Playing && <div>You {gameStatus === GameStatus.Won ? 'Won!' : 'Lost!'}</div>}
		</div>
	)
}

export default Board;