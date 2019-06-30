import { writable } from 'svelte/store'
import { UUID } from '../utils'

export default function Rook(player, gameStore) {
	if (player === undefined) {
		throw new Error(`missing player type for "Rook"`)
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
			value: 'Rook'
		},
		id: {
			value: UUID()
		},
		player: {
			value: player
		},
		figure: {
			value: `rook-${player.type}`
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

				if (col === toCol) {
					// Moving down from 0 to 7
					if (toRow > row) {
						for (let itr = row + 1; itr <= toRow - 1; itr++) {
							if (chessStore.chessfield[itr][col] !== null) {
								return false
							}
						}
					}
					// Moving up from 7 to 0
					else if (toRow < row) {
						for (let itr = row - 1; itr >= toRow + 1; itr--) {
							if (chessStore.chessfield[itr][col] !== null) {
								return false
							}
						}
					}
				}
				else if (row === toRow) {
					// Moving right from 0 to 7
					if (toCol > col) {
						for (let itr = col + 1; itr <= toCol - 1; itr++) {
							if (chessStore.chessfield[row][itr] !== null) {
								return false
							}
						}
					}
					// Moving left from 7 to 0
					else if (toCol < col) {
						for (let itr = col - 1; itr >= toCol + 1; itr--) {
							if (chessStore.chessfield[row][itr] !== null) {
								return false
							}
						}
					}
				}
				if (row === toRow || col === toCol) {
					if (toField === null || toField.player !== player) {
						return true
					}
				}
				return false
			}
		},
	})
}
