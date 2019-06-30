import { Player } from './players'
import { writable, get as getStore, derived } from 'svelte/store'
import { UUID } from './utils'

function Engine() {
	let currentBgURL = ''
	const locStor = {
		currentBgId: '',
		chessFancy: true,
		backgrounds: {
			'3f92043752ba4579b942783cbf786e05': 'https://wallpapertag.com/wallpaper/full/0/7/7/980537-full-size-greek-mythology-wallpapers-1920x1080-720p.jpg',
			'a405f36825f44fbbaf36798933b0acb7': 'https://newevolutiondesigns.com/images/freebies/retro-wallpaper-17.jpg',
			'c3385988c98b42a1a516d4b25d8dc095': 'https://natewren.com/themes/wallpaper2/radpack/radpack_15.jpg',
			'3faf4ebf32a34be8a53fdb9d873c0639': 'https://freewallpap.files.wordpress.com/2012/01/the-best-top-desktop-space-wallpapers-0r-hd-space-wallpaper-planets.jpg',
			'a3a528d343244a8aab6812792a3fca22': 'https://wallpapershome.com/images/pages/pic_hs/6289.jpg',
			'bfb52661e9004eb980eb6c6ef09e9386': 'https://www.pixelstalk.net/wp-content/uploads/2016/10/Anime-Landscape-Wallpaper-HD.jpg',
			'6e590dd631ed41fabc9a3493c5c7cff7': 'https://onehdwallpaper.com/wp-content/uploads/2016/07/Fantasy-Landscape-Desktop-Background.jpg',
		},
	}

	if (localStorage !== undefined) {
		if (localStorage.getItem('isInitialized')) {
			locStor.currentBgId = localStorage.getItem('currentBgId')
			locStor.chessFancy = localStorage.getItem('chessFancy') === 'true'
			locStor.backgrounds = JSON.parse(localStorage.getItem('backgrounds'))
			currentBgURL = locStor.backgrounds[locStor.currentBgId]
		}
		else {
			localStorage.setItem('isInitialized', true)
			localStorage.setItem('chessFancy', locStor.chessFancy)
			localStorage.setItem('backgrounds',
				JSON.stringify(locStor.backgrounds),
			)
			const currentBgId = Object.keys(locStor.backgrounds)[0]
			localStorage.setItem('currentBgId', currentBgId)
			currentBgURL = locStor.backgrounds[currentBgId]
		}
	}

	const {
		subscribe,
		update: updateStore,
	} = writable({
		chessfield: [
		//	 A    B    C    D    E    F    G    H
			[null,null,null,null,null,null,null,null], // 1
			[null,null,null,null,null,null,null,null], // 2
			[null,null,null,null,null,null,null,null], // 3
			[null,null,null,null,null,null,null,null], // 4
			[null,null,null,null,null,null,null,null], // 5
			[null,null,null,null,null,null,null,null], // 6
			[null,null,null,null,null,null,null,null], // 7
			[null,null,null,null,null,null,null,null], // 8
		],
		selectedField: {
			id: null,
			row: null,
			col: null,
			value: null,
		},
		hoveringMove: {
			hovering: false,
			from: {
				row: null,
				col: null,
			},
			to: {
				row: null,
				col: null,
			},
		},
		hoveringTarget: {
			hovering: false,
			id: null,
			row: null,
			col: null,
		},
		inProcess: false,
		currentPlayerTurn: {},
		modal: {
			name: null,
			component: null,
			data: null,
			state: false,
		},
		modals: {},
		currentBgId: locStor.currentBgId,
		currentBgURL,
		fancyGraphics: locStor.chessFancy,
		backgrounds: locStor.backgrounds,
	})

	const playerWhitePermKey = UUID()
	const playerBlackPermKey = UUID()

	Object.defineProperties(this, {
		subscribe: {
			value: subscribe
		},
		start: {
			value() {
				let err = null
				updateStore(store => {
					if (store.inProcess) {
						err = new Error('game is already in process')
					}
					else {
						store.inProcess = true

						store.currentPlayerTurn = this.playerWhite

						const whitePieces = getStore(this.playerWhite).chessPieces
						for (let row = 0; row < 2; row++) {
							for (let col = 0; col < 8; col++) {
								store.chessfield[row][col] = whitePieces[8 * row + col]
								whitePieces[8 * row + col].setPosition(row, col)
							}
						}

						const blackPieces = getStore(this.playerBlack).chessPieces
						for (let row = 1; row >= 0; row--) {
							for (let col = 7; col >= 0; col--) {
								store.chessfield[7-row][7-col] = blackPieces[8 * row + col]
								blackPieces[8 * row + col].setPosition(7-row, 7-col)
							}
						}
					}
					return store
				})
				return err
			}
		},
		exit: {
			value: () => {
				if (!getStore(this).inProcess) {
					return new Error('game not started')
				}

				const pW = this.playerWhite.reset(playerWhitePermKey)
				if (pW instanceof Error) {
					throw pW
				}
				const pB = this.playerBlack.reset(playerBlackPermKey)
				if (pB instanceof Error) {
					throw pB
				}

				updateStore(store => {
					store.inProcess = false
					store.selectedField = {
						id: null,
						row: null,
						col: null,
						value: null,
					}
					store.chessfield = [
						[null,null,null,null,null,null,null,null],
						[null,null,null,null,null,null,null,null],
						[null,null,null,null,null,null,null,null],
						[null,null,null,null,null,null,null,null],
						[null,null,null,null,null,null,null,null],
						[null,null,null,null,null,null,null,null],
						[null,null,null,null,null,null,null,null],
						[null,null,null,null,null,null,null,null],
					]
					store.currentPlayerTurn = {}
					return store
				})
			}
		},
		playerWhite: {
			value: new Player('white', subscribe, playerWhitePermKey)
		},
		playerBlack: {
			value: new Player('black', subscribe, playerBlackPermKey)
		},
		selectField: {
			value(row, col) {
				if (!getStore(this).inProcess) {
					return new Error('game not started')
				}
				
				let err = null
				updateStore(store => {
					const slcField = store.selectedField
					const toField = store.chessfield[row][col]
					// Unselect same clicked field
					if (`${row}${col}` == slcField.id) {
						store.selectedField = {
							id: null,
							row: null,
							col: null,
							value: null,
						}
					}
					// Select field
					else if (
						toField !== null &&
						slcField.id != `${row}${col}` &&
						toField.player === store.currentPlayerTurn
					) {
						store.selectedField = {
							id: `${row}${col}`,
							col,
							row,
							value: toField,
						}
					}
					// Move
					else if (
						store.selectedField.id !== null &&
						(
							toField === null ||
							toField.player !== store.currentPlayerTurn
						)
					) {
						if (
							store.chessfield[slcField.row][slcField.col].isMoveAllowed(
								slcField.row, slcField.col, row, col,
							)
						) {
							store.currentPlayerTurn.takeTurn(
								slcField.row, slcField.col, row, col,
								store.chessfield[slcField.row][slcField.col],
								store.chessfield[row][col],
							)
							store.chessfield[row][col] = slcField.value
							slcField.value.setPosition(row, col)
							store.chessfield[slcField.row][slcField.col] = null
							store.selectedField = {
								id: null,
								row: null,
								col: null,
								value: null,
							}
							switch (store.currentPlayerTurn) {
								case this.playerBlack:
									store.currentPlayerTurn = this.playerWhite
									break
								case this.playerWhite:
									store.currentPlayerTurn = this.playerBlack
									break
							}
						}
					}
					return store
				})
				return err
			}
		},
		hoverTarget: {
			value(piece) {
				updateStore(store => {
					if (piece === null || piece === undefined) {
						store.hoveringTarget = {
							hovering: false,
							id: null,
							row: null,
							col: null,
						}
					}
					else if (!piece.isBeaten()) {
						let pieceStore = getStore(piece)
						store.hoveringTarget = {
							hovering: true,
							id: piece.id,
							row: pieceStore.position.row,
							col: pieceStore.position.col,
						}
					}
					return store
				})
			}
		},
		hoverMove: {
			value(from, to) {
				updateStore(store => {
					if (from === null || from === undefined) {
						store.hoveringMove = {
							hovering: false,
							from: {
								row: null,
								col: null,
							},
							to: {
								row: null,
								col: null,
							},
						}
					}
					else {
						store.hoveringMove = {
							hovering: true,
							from, to,
						}
					}
					return store
				})
			}
		},
		newBG: {
			value(url) {
				updateStore(store => {
					for (const id in store.backgrounds) {
						if (url === store.backgrounds[id]) {
							return store
						}
					}
					store.backgrounds[UUID()] = url
					if (localStorage) {
						localStorage.setItem(
							'backgrounds',
							JSON.stringify(store.backgrounds),
						)
					}
				})
			}
		},
		changeBG: {
			value(id) {
				updateStore(store => {
					if (id === undefined && typeof id !== 'string') {
						throw new Error('providen background id not a string')
					}
					store.currentBgId = id
					store.currentBgURL = store.backgrounds[id]
					if (localStorage) {
						localStorage.setItem('currentBgId', id)
					}
					return store
				})
			}
		},
		removeBG: {
			value(id) {
				updateStore(store => {
					if (id === undefined && typeof id !== 'string') {
						throw new Error('providen background id not a string')
					}
					delete store.backgrounds[id]
					localStorage.setItem(
						'backgrounds',
						JSON.stringify(store.backgrounds),
					)
					if (id === store.currentBgId) {
						const bgIDs = Object.keys(store.backgrounds)
						if (bgIDs.length > 0) {
							this.changeBG(
								store.backgrounds[bgIDs[bgIDs.length - 1]]
							)
						}
						else {
							this.changeBG('')
						}
					}
					return store
				})
			}
		},
		toggleGraphics: {
			value() {
				updateStore(store => {
					store.fancyGraphics = !store.fancyGraphics
					if (localStorage !== undefined) {
						localStorage.setItem('chessFancy', store.fancyGraphics)
					}
					return store
				})
			}
		},
		newModal: {
			value(name, component) {
				updateStore(store => {
					if (store.modals[name] !== undefined) {
						throw new Error('cannot register modals with same name')
					}
					else {
						store.modals[name] = {
							component,
						}
					}
					return store
				})
			}
		},
		openModal: {
			value(name, data) {
				updateStore(store => {
					if (typeof name !== 'string') {
						throw new Error('provided name is not a string')
					}
					else if (!(name in store.modals)) {
						throw new Error(`modal '${name}' not registered`)
					}
					store.modal = {
						name,
						component: store.modals[name].component,
						data,
						state: true,
					}
					return store
				})
			}
		},
		pendCloseModal: {
			value() {
				updateStore(store => {
					store.modal.state = false
					return store
				})
			}
		},
		closeModal: {
			value() {
				setTimeout(
					() => updateStore(store => {
						store.modal = {
							name: null,
							component: null,
							data: null,
							state: false,
						}
						return store
					})
				)
			}
		},
	})
}

export default new Engine()
