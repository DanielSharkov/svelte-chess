import { writable } from 'svelte/store'
import { UUID } from '../utils'

export default function King(player, gameStore) {
	if (player === undefined) {
		throw new Error(`missing player type for "King"`)
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
			value: 'King'
		},
		id: {
			value: UUID()
		},
		player: {
			value: player
		},
		figure: {
			value: `king-${player.type}`
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

				// Reverse values
				if (player.type == 'white') {
					row = 7-row
					toRow = 7-toRow
				}

				if (
					(
						toRow === row - 1 ||
						toRow === row ||
						toRow === row + 1
					) && (
						toCol === col - 1 ||
						toCol === col ||
						toCol === col + 1
					)
				) {
					return true
				}

				return false
			}
		},
	})
}
