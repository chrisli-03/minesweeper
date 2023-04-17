import React from 'react';
import {CellStatus} from "./enums";

export type CellValue = -1|0|1|2|3|4|5|6|7|8

export type CellType = {
	value: CellValue
	status: CellStatus
}

export type ConfigType = {
	width: number
	height: number
	mines: number
}

export type CoordType = {
	x: number
	y: number
}