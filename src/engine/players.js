import { writable } from 'svelte/store'
import chessPieces from './chessPieces/'
import { UUID } from './utils'

export function Player(type, gameStore, key) {
	if (type === undefined) {
		throw new Error('missing player type')
	}

	const permissionKey = key

	const {
		subscribe,
		update: updateStore,
		set: setStore,
	} = writable({
		totalTurns: 0,
		turnsHistory: [],
		chessPieces: [],
		enemyPieces: [],
	})

	Object.defineProperties(this, {
		subscribe: {
			value: subscribe
		},
		id: {
			value: UUID()
		},
		type: {
			value: type
		},
		takeTurn: {
			value(row, col, toRow, toCol, field, toField) {
				let crashReason = null
				if (row === null) {
					crashReason = 'missing from row'
				}
				else if (col === null) {
					crashReason = 'missing from col'
				}
				else if (toRow === null) {
					crashReason = 'missing to row'
				}
				else if (toCol === null) {
					crashReason = 'missing to col'
				}
				if (crashReason !== null) {
					throw new Error(`game crash: ${crashReason}`)
				}

				updateStore(store => {
					let beatenPiece = null
					if (toField !== null) {
						if (
							!(
								toField instanceof (chessPieces.KING) ||
								toField instanceof (chessPieces.QUEEN) ||
								toField instanceof (chessPieces.ROOK) ||
								toField instanceof (chessPieces.BISHOP) ||
								toField instanceof (chessPieces.KNIGHT) ||
								toField instanceof (chessPieces.PAWN)
							)
						) {
							console.log(toField instanceof chessPieces.PAWN)
							throw new Error(
								`not a chess piece: ${toField} (${typeof toField})`
							)
						}
						beatenPiece = toField
						store.enemyPieces.unshift(toField)
						toField.beat()
					}
					store.totalTurns++
					store.turnsHistory.unshift({
						from: { row, col },
						to:   { row: toRow, col: toCol },
						beatenPiece,
						beatenBy: field,
						time: Date.now(),
					})
					return store
				})
			}
		},
		reset: {
			value(key) {
				if (key !== permissionKey) {
					throw new Error('reset player not permitted')
				}
				setStore({
					totalTurns: 0,
					turnsHistory: [],
					chessPieces: [
						new chessPieces.ROOK(this, gameStore),
						new chessPieces.KNIGHT(this, gameStore),
						new chessPieces.BISHOP(this, gameStore),
						new chessPieces.KING(this, gameStore),
						new chessPieces.QUEEN(this, gameStore),
						new chessPieces.BISHOP(this, gameStore),
						new chessPieces.KNIGHT(this, gameStore),
						new chessPieces.ROOK(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
						new chessPieces.PAWN(this, gameStore),
					],
					enemyPieces: [],
				})
			}
		},
	})

	updateStore(store => {
		store.chessPieces = [
			new chessPieces.ROOK(this, gameStore),
			new chessPieces.KNIGHT(this, gameStore),
			new chessPieces.BISHOP(this, gameStore),
			new chessPieces.KING(this, gameStore),
			new chessPieces.QUEEN(this, gameStore),
			new chessPieces.BISHOP(this, gameStore),
			new chessPieces.KNIGHT(this, gameStore),
			new chessPieces.ROOK(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
			new chessPieces.PAWN(this, gameStore),
		]
		return store
	})
}
