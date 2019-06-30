import { writable } from 'svelte/store'
import { UUID } from '../utils'

export default function Bishop(player, gameStore) {
	if (player === undefined) {
		throw new Error(`missing player type for "Bishop"`)
	}
	else if (gameStore === undefined) {
		throw new Error(`missing game store`)
	}

	let chessStore;
	gameStore(v => chessStore = v)

	const { subscribe, update: updateStore } = writable({
		position: {
			row: 0, col: 0,
		},
	})

	let _isBeaten = false

	let _yPos = 0
	let _xPos = 0

	Object.defineProperties(this, {
		name: {
			value: 'Bishop'
		},
		id: {
			value: UUID()
		},
		player: {
			value: player
		},
		figure: {
			value: `bishop-${player.type}`
		},
		subscribe: {
			value: subscribe
		},
		getPosition: {
			value: () => {
				return {
					row: _yPos,
					col: _xPos,
				}
			}
		},
		setPosition: {
			value(row, col) {
				updateStore(store => {
					store.position = {
						row, col,
					}
					_yPos = row
					_xPos = col
					return store
				})
			}
		},
		beat: {
			value: () => _isBeaten = true
		},
		isBeaten: {
			value: () => _isBeaten
		},
		isMoveAllowed: {
			value(row, col, toRow, toCol) {
				let toField = chessStore.chessfield[toRow][toCol]

				let itrRow = 0
				let itrCol = 0
				let whileCase = () => false
				let doItrRow = () => 0
				let doItrCol = () => 0

				// Moving up
				if (row > toRow) {
					itrRow = row - 1
					whileCase = () => row > toRow
					doItrRow = () => {itrRow--}
				}
				// Moving down
				else {
					itrRow = row + 1
					whileCase = () => toRow > row
					doItrRow = () => {itrRow++}
				}

				// Moving left
				if (col > toCol) {
					itrCol = col - 1
					doItrCol = () => {itrCol--}
				}
				// Moving right
				else {
					itrCol = col + 1
					doItrCol = () => {itrCol++}
				}

				while (whileCase()) {
					const field = chessStore.chessfield[itrRow][itrCol]

					if (itrRow === toRow && itrCol === toCol) {
						if (field !== null && field.player === player) {
							return false
						}
						if (
							toField === null ||
							toField.player !== player
						) {
							return true
						}
					}
					else if (field !== null) {
						return false
					}

					// Moving down right or left
					doItrCol()
					doItrRow()
				}
				return false
			}
		},
	})
}
