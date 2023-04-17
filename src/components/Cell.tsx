import React from 'react';
import {CellValue} from "../helpers/types";
import {CellStatus} from "../helpers/enums";

interface CellProps {
	value: CellValue
	status: CellStatus
	update: (status: CellStatus) => void
}

const areEqual = (prevProps: CellProps, nextProps: CellProps) => {
	return prevProps.status === nextProps.status
}

const Cell:React.FC<CellProps> = ({ value, status, update }) => {
	console.log('cell rerender')
	let text: CellValue | '' | '!' = value;
	// if (
	// 	status === CellStatus.Closed
	// 	|| (value === 0 && status !== CellStatus.Flagged)
	// 	|| (value === -1 && status !== CellStatus.Flagged)) {
	// 	text = ''
	// } else if (status === CellStatus.Flagged) {
	// 	text = '!'
	// }
	const handleClick = (evt: React.MouseEvent<HTMLElement>) => {
		evt.stopPropagation()
		evt.preventDefault()
		if (status !== CellStatus.Closed) {
			return
		}
		update(CellStatus.Opened)
	}

	const handleContextMenu = (evt : React.MouseEvent<HTMLElement>) => {
		evt.stopPropagation()
		evt.preventDefault()
		if (status === CellStatus.Opened) {
			return
		}
		if (status === CellStatus.Flagged) {
			update(CellStatus.Closed)
		} else {
			update(CellStatus.Flagged)
		}
	}

	return (
		<div
			className="cell"
			onClick={handleClick}
			onContextMenu={handleContextMenu}
			data-status={status}
			data-mine={value === -1}
		>
			{text}
		</div>
	)
}

export default React.memo(Cell, areEqual)