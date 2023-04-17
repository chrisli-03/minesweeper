import React from 'react';

interface ConfigProps {
	setupConfig: (height: number, width: number, mines: number) => void
}

const Config:React.FC<ConfigProps> = ({ setupConfig }) => {
	const [height, setHeight] = React.useState(200)
	const [width, setWidth] = React.useState(300)
	const [mines, setMines] = React.useState(900)
	const handleUpdateHeight = (evt: React.FormEvent<HTMLInputElement>) => setHeight(Number(evt.currentTarget.value))
	const handleUpdateWidth = (evt: React.FormEvent<HTMLInputElement>) => setWidth(Number(evt.currentTarget.value))
	const handleUpdateMines = (evt: React.FormEvent<HTMLInputElement>) => setMines(Number(evt.currentTarget.value))
	const handleSubmit = (evt: React.SyntheticEvent) => {
		evt.preventDefault()
		setupConfig(height, width, mines)
	}

	return (
		<form onSubmit={handleSubmit}>
			<section>
				<label>
					height:&nbsp;
					<input type="number" value={height} onChange={handleUpdateHeight} />
				</label>
			</section>
			<section>
				<label>
					width:&nbsp;
					<input type="number" value={width} onChange={handleUpdateWidth} />
				</label>
			</section>
			<section>
				<label>
					mines:&nbsp;
					<input type="number" value={mines} onChange={handleUpdateMines} />
				</label>
			</section>
			<button type="submit">Create Game</button>
		</form>
	)
}

export default Config;