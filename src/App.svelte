<script>
	import Chess from './engine'
	import PlayerStats from './PlayerStats'
	import SettingsModal from './Settings'
	import { fade, fly } from 'svelte/transition'
	import globalStyles from '../public/global.styl'

	Chess.newModal('settings', SettingsModal)

	$:chessStore = $Chess
	$:cpt = chessStore.currentPlayerTurn

	function startChess() {
		Chess.start()
		setTimeout(() => {
			getGameSize(window.innerWidth, window.innerHeight)
		})
	}

	let gameEl;
	let gameSize = 0
	$:fieldSize = gameSize / 8
	function getGameSize(x, y) {
		if (x < y) gameSize = x - 200
		else gameSize = y - 200
		gameEl.style.height = gameSize+'px'
		gameEl.style.width = gameSize+'px'
	}
	function onResize(event) {
		if (chessStore.inProcess) {
			getGameSize(
				event.target.innerWidth,
				event.target.innerHeight,
			)
		}
	}

	$:reversedChessfield = chessfield => {
		let newOrder = []
		for (const row in chessfield) {
			newOrder[7-row] = chessfield[row]
		}
		return newOrder
	}

	function toChar(col) {
		switch (col) {
		case 0: return 'A'
		case 1: return 'B'
		case 2: return 'C'
		case 3: return 'D'
		case 4: return 'E'
		case 5: return 'F'
		case 6: return 'G'
		case 7: return 'H'
		default: throw new Error('not a valid column')
		}
	}
</script>

<svelte:window on:resize={onResize}/>

<style lang="stylus">
	#game
		display flex
		height 100vh
		width 100vw
		user-select none
		-webkit-user-select none
		background-repeat no-repeat
		background-size cover
		.start-game
			margin auto
			padding 1rem
			background-color rgba(#FFF,.7)
			backdrop-filter blur(16px)
			-webkit-backdrop-filter blur(16px)
			border-radius 4px
			text-align center
			button
				margin 1rem

		.overlay
			z-index 50
			position fixed
			height 100vh
			width 100vw
			pointer-events none
			.menu
				position fixed
				top 0
				left 50%
				display flex
				padding 1rem
				flex-flow row wrap
				align-items center
				border-radius 0 0 4px 4px
				background-color #FFF
				transform translate(-50%, calc(-100% + .75rem))
				box-shadow 0 0 50px rgba(#000, .4)
				pointer-events all
				&:before
					content ''
					position absolute
					left 50%
					bottom .3rem
					height 2px
					width 2rem
					transform translateX(-50%)
					background-color #000
					border-radius 1rem
				&:after
					content ''
					z-index -1
					position absolute
					top 0
					left 0
					height 150%
					width 125%
					transform translateX(-10%)
				&:hover
					transform translate(-50%, 0)
				button
					.icon
						height 1rem
						width 1rem
						stroke #000
					&:not(:last-child)
						margin-right 1rem

		.modal-viewport
			z-index 100
			position fixed
			left 0
			top 0
			display flex
			height 100%
			width 100%
			padding 2rem
			flex-flow column nowrap
			justify-content flex-start
			align-content center
			align-items center
			overflow-y auto
			&:not(.active)
				pointer-events none
			.background
				z-index -1
				position fixed
				left 0
				top 0
				height 100%
				width 100%
				background-color rgba(#000, .5)
			.modal
				position relative
				margin auto
				padding 2rem
				flex 0 0 auto
				background-color #FFF
				border-radius 4px
				pointer-events all

		.chessfield
			position relative
			display flex
			min-height 300px
			min-width 300px
			margin auto
			flex-flow row wrap
			box-shadow 0 0 30px 1rem rgba(#000, .3)
			.row
				display flex
				height 12.5%
				flex 0 0 100%
				.field
					display flex
					flex 0 0 12.5%
					justify-content center
					align-content center
					align-items center
					box-sizing border-box
					font-size .5rem
					font-weight 600
					flex-flow row wrap
					text-align center
					box-shadow none
					background-color #FFF
					.figure
						height 50%
						width 50%
						flex 1 1 100%
					&.turn-player:hover .figure
						transform scale(1.4)
						cursor pointer
					@keyframes selectedFieldWhite
						from
							box-shadow 0 0 0 .1rem #fff
						to
							box-shadow 0 0 0 1rem rgba(#FFF, .5)
					&.selected
						z-index 100
						animation selectedFieldWhite 500ms ease alternate infinite
						.figure
							transform scale(1.4)
				@keyframes selectedFieldBlack
					from
						box-shadow 0 0 0 .1rem #000
					to
						box-shadow 0 0 0 1rem rgba(#000, .5)
				&:nth-child(odd) .field.selected:nth-child(odd),
				&:nth-child(even) .field.selected:nth-child(even)
					animation selectedFieldBlack 500ms ease alternate infinite
				&:nth-child(odd) .field:nth-child(odd),
				&:nth-child(even) .field:nth-child(even)
					background-color #222
					color #FFF
			.indicators
				position absolute
				top 50%
				left 50%
				transform translate(-50%, -50%)
				pointer-events none
				transition none
				.indicator
					z-index -1
					position absolute
					display flex
					font-size .6rem
					font-weight 700
					background-color rgba(#000, .5)
					color #FFF
					justify-content center
					align-content center
					align-items center
					> *
						display flex
						flex 1 1 12.5%
						justify-content center
						align-content center
						align-items center
					&.top, &.bottom
						left 0
						height 1.25rem
						width 100%
						flex row nowrap
					&.top
						bottom 100%
						border-radius 6px 6px 0 0
					&.bottom
						top 100%
						border-radius 0 0 6px 6px
					&.left, &.right
						top 0
						width 1.25rem
						height 100%
						flex-flow column nowrap
					&.left
						right 100%
						border-radius 6px 0 0 6px
					&.right
						left 100%
						border-radius 0 6px 6px 0

		.chessfield-overlay
			position absolute
			top 50%
			left 50%
			transform translate(-50%, -50%)
			pointer-events none
			transition none
			.hovering
				position absolute
				display flex
				height 12.5%
				width 12.5%
				justify-content center
				align-content center
				align-items center
				color #FFF
				border solid .5rem transparent
				&.target
					border-color #F05
					background-color rgba(255,0,50,.5)
				&.move
					border-color #000
					background-color rgba(#000, .5)

		&.fancy
			.overlay .menu
				background-color rgba(#FFF, .4)
				backdrop-filter blur(16px)
				-webkit-backdrop-filter blur(16px)
			.modal-viewport .background
				-webkit-backdrop-filter blur(20px)
				backdrop-filter blur(20px)
			.chessfield
				backdrop-filter blur(20px)
				-webkit-backdrop-filter blur(20px)
				.row
					.field
						background-color rgba(#FFF, .65)
					&:nth-child(odd) .field:nth-child(odd),
					&:nth-child(even) .field:nth-child(even)
						background-color rgba(#000, .65)
				&-overlay .hovering
					backdrop-filter blur(2px)
					-webkit-backdrop-filter blur(2px)
				.indicators .indicator
					background-color rgba(#000, .3)
					-webkit-backdrop-filter blur(20px)
					backdrop-filter blur(20px)
</style>

<div
id="game"
style="background-image: url({$Chess.currentBgURL})"
class:fancy={$Chess.fancyGraphics}>
	<div class="modal-viewport" class:active={$Chess.modal.state}>
		{#if
			$Chess.modal.name !== null &&
			$Chess.modal.name.length > 0 &&
			$Chess.modal.state
		}
			<div
				class="background"
				on:click={Chess.pendCloseModal}
				transition:fade={{duration: 300}}
			/>
			<div
			class="modal"
			transition:fly={{ y: 300, duration: 400 }}
			on:outroend={Chess.closeModal}>
				<svelte:component
					this={$Chess.modal.component}
					data={$Chess.modal.data}
					close={Chess.pendCloseModal}
				/>
			</div>
		{/if}
	</div>

	{#if chessStore.inProcess}
		<div class="overlay">
			<div class="menu">
				<button on:click={Chess.exit}>
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M20 10h64v19M20 10v85l44 15V95M20 10l44 15v70m20-19v19H64m10-43h30m0 0L89 37m15 15L89 67"/>
					</svg>
					<span>Exit</span>
				</button>
				<button on:click={() => Chess.openModal('settings')}>
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M21 32.4a4 4 0 0 1 0-5.6l5.8-5.8a4 4 0 0 1 5.6 0l5.4 5.2a8 8 0 0 0 13.5-5.8V16a4 4 0 0 1 4-4h9.4a4 4 0 0 1 4 4v4.4a8 8 0 0 0 13.5 5.8l5.4-5.2a4 4 0 0 1 5.6 0l5.8 5.8a4 4 0 0 1 0 5.6l-5.2 5.4a8 8 0 0 0 5.8 13.5h4.4a4 4 0 0 1 4 4v9.4a4 4 0 0 1-4 4h-3.4A8 8 0 0 0 95 82.5l4.5 4.3a4 4 0 0 1 0 5.7l-7.1 7.2a4 4 0 0 1-5.7-.1L82.5 95a8 8 0 0 0-13.8 5.5v3.4a4 4 0 0 1-4 4h-9.4a4 4 0 0 1-4-4v-3.4A8 8 0 0 0 37.5 95l-4.3 4.5a4 4 0 0 1-5.7 0l-7.2-7.1a4 4 0 0 1 .1-5.7l4.5-4.3a8 8 0 0 0-5.5-13.8H16a4 4 0 0 1-4-4v-9.4a4 4 0 0 1 4-4h4.4a8 8 0 0 0 5.8-13.5L21 32.4z"/>
						<circle cx="60" cy="60" r="16" stroke-width=".5rem"/>
					</svg>
					<span>Settings</span>
				</button>
			</div>

			<div class="players-stats">
				<PlayerStats player={Chess.playerWhite}/>
				<PlayerStats player={Chess.playerBlack}/>
			</div>
		</div>

		<div bind:this={gameEl} class="chessfield">
			<div class="indicators" style="width: {gameSize}px; height: {gameSize}px">
				<div class="indicator top">
					{#each Array(8) as _, x}
						<div {x}>{toChar(x)}</div>
					{/each}
				</div>
				<div class="indicator bottom">
					{#each Array(8) as _, x}
						<div {x}>{toChar(x)}</div>
					{/each}
				</div>
				<div class="indicator left">
					{#each Array(8) as _, y}
						<div {y}>{7- y + 1}</div>
					{/each}
				</div>
				<div class="indicator right">
					{#each Array(8) as _, y}
						<div {y}>{7- y + 1}</div>
					{/each}
				</div>
			</div>

			{#each reversedChessfield(chessStore.chessfield) as row, rowIndex}
				<div class="row" row={7-rowIndex}>
					{#each row as field, colIndex}
						<div
						class="field"
						class:selected={
							chessStore.selectedField.id == `${7-rowIndex}${colIndex}`
						}
						class:empty={field === null}
						class:turn-player={
							field != null &&
							field.player === cpt
						}
						col={colIndex}
						field={field ? field.figure : field}
						on:click={
							() => Chess.selectField(7-rowIndex, colIndex)
						}>
							{#if field !== null}
								<img
									id={field.id}
									class="figure"
									src="/chesspieces/{field.figure}.svg"
									alt="{field.name} {field.player}"
								/>
							{/if}
						</div>
					{/each}
				</div>
			{/each}


		</div>

		<div class="chessfield-overlay" style="width: {gameSize}px; height: {gameSize}px">
			{#if chessStore.hoveringTarget.hovering}
				<div
				transition:fade={{duration: 200}}
				class="hovering target"
				style="left: {fieldSize * chessStore.hoveringTarget.col}px; top: {fieldSize * (7 - chessStore.hoveringTarget.row)}px;"
				piece-id={chessStore.hoveringTarget.id}>
					<span>Beaten by</span>
				</div>
			{/if}
			{#if chessStore.hoveringMove.hovering}
				<div
				transition:fade={{duration: 200}}
				class="hovering move from"
				style="left: {fieldSize * chessStore.hoveringMove.from.col}px; top: {fieldSize * (7 - chessStore.hoveringMove.from.row)}px;"
				piece-id={chessStore.hoveringMove.from.id}>
					<span>Move from</span>
				</div>
				<div
				transition:fade={{duration: 200}}
				class="hovering move to"
				style="left: {fieldSize * chessStore.hoveringMove.to.col}px; top: {fieldSize * (7 - chessStore.hoveringMove.to.row)}px;"
				piece-id={chessStore.hoveringMove.to.id}>
					<span>Move to</span>
				</div>
			{/if}
		</div>
	{:else}
		<div class="start-game">
			<h1>Chess</h1>
			<button on:click={startChess}>
				Start Game
			</button>
		</div>
	{/if}
</div>
