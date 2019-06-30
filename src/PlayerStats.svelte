<script>
	import Chess from './engine/'

	export let player;
	if (player === undefined) {
		throw new Error('Player not provided')
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

	let hoveringID = ''
	$:isHoveringEntry = beaten => {
		if (beaten) {
			return beaten.id === hoveringID
		}
		return false
	}
	function mouseOverEntry(beaten, by, from, to) {
		if (from !== undefined && to !== undefined) {
			Chess.hoverMove(from, to)
		}
		if (beaten) {
			if (by) {
				Chess.hoverTarget(by)
			}
			hoveringID = beaten.id
		}
	}
	function mouseLeaveEntry() {
		hoveringID = ''
		Chess.hoverTarget()
		Chess.hoverMove()
	}
</script>



<style lang="stylus">
	.player
		position absolute
		top 0
		display flex
		height 100%
		min-width 400px
		max-width 25%
		padding 2rem
		flex-flow column nowrap
		justify-content flex-start
		align-content center
		align-items center
		box-shadow 0 0 50px rgba(#000, .5)
		pointer-events all
		&:after
			content ''
			position absolute
			top 50%
			height 2rem
			width 2px
			border-radius 1rem
			transform translateY(-50%)
		> *
			width 100%
			flex 0 0 auto
		.title
			margin 1rem 0 2rem 0
			text-align center
			text-transform capitalize
			font-weight 400
		h4
			margin-bottom .5rem
		.turns-history, .enemy-pieces
			padding .5rem
			flex 0 1 50%
			flex-flow row wrap
			border-radius 4px
			overflow auto
			border solid 1px
		.enemy-pieces, .turns-history .empty
			display flex
			flex-flow row wrap
			justify-content flex-start
			align-content flex-start
			align-items flex-start
		.turns-history, .enemy-pieces
			.empty
				opacity .5
				padding .5rem
				font-size .65rem
		.turns-history .entry
			display flex
			padding .5rem
			border-radius 4px
		.turns-history
			.entry
				.figure:first-child
					margin-right .5rem
				.from, .to
					padding .25rem .5rem
					border-radius 4px
				.icon, .figure
					height 1.5rem
					width 1.5rem
				.icon
					margin auto .5rem
				.time
					margin auto 0 auto auto
					font-size .6rem
					font-family 'Fira Code', 'Monaco', monospace
		.enemy-pieces .entry
			padding .5rem
			flex 0 0 calc(100% / 5)
			border-radius 4px
		&.white
			left 0
			padding 2rem 2.5rem 2rem 2rem
			background-color #FFF
			transform translateX(calc(-100% + 1rem))
			border-right solid 1px rgba(#000, .15)
			&:after
				right .4rem
				background-color #000
			.turns-history, .enemy-pieces
				background-color rgba(#000, .1)
				border-color rgba(#000, .05)
				.entry
					&:hover, &.hovering
						background-color rgba(#000, .2)
			.turns-history .entry
				.from, .to
					background-color rgba(#FFF, .5)
				&:hover, &.hovering
					.from, .to
						background-color #FFF
				.icon
					stroke #000
		&.black
			right 0
			background-color #000
			padding 2rem 2rem 2rem 2.5rem
			color #FFF
			border-left solid 1px rgba(#FFF, .15)
			&:after
				left .4rem
				background-color #FFF
			transform translateX(calc(100% - 1rem))
			.turns-history, .enemy-pieces
				background-color rgba(#FFF, .1)
				border-color rgba(#FFF, .05)
				.entry
					&:hover, &.hovering
						background-color rgba(#FFF, .2)
			.turns-history .entry
				.from, .to
					background-color rgba(#000, .5)
				&:hover, &.hovering
					.from, .to
						background-color #000
				.icon
					stroke #FFF
		&:hover
			transform translateX(0)
		&.fancy
			-webkit-backdrop-filter blur(20px)
			backdrop-filter blur(20px)
			&.black
				background-color rgba(#000, .6)
			&.white
				background-color rgba(#FFF, .6)
</style>



<div class="player {player.type}" class:fancy={$Chess.fancyGraphics}>
	<h1 class="title">{player.type}</h1>

	<h4>{$player.totalTurns} Turns</h4>
	<div class="turns-history">
		{#if $player.turnsHistory.length < 1}
			<span class="empty">
				No turns made yet
			</span>
		{/if}
		{#each $player.turnsHistory as turn, index}
			<div
			class="entry"
			class:hovering={isHoveringEntry(turn.beatenPiece)}
			on:mouseover={() => mouseOverEntry(
				turn.beatenPiece,
				turn.beatenBy,
				turn.from,
				turn.to,
			)}
			on:mouseleave={mouseLeaveEntry}>
				<img
					piece-id={turn.beatenBy.id}
					class="figure"
					src="/chesspieces/{turn.beatenBy.figure}.svg"
					alt="{turn.beatenBy.name} {turn.beatenBy.player}"
				/>
				<span class="from">
					{toChar(turn.from.col)}{turn.from.row + 1}
				</span>
				<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width=".4rem"
						d="M10 50h80m0 0L75 70m15-20L75 30"
					/>
				</svg>
				<span class="to">
					{toChar(turn.to.col)}{turn.to.row + 1}
				</span>
				{#if turn.beatenPiece}
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
						<path stroke-width=".3rem" d="M34 45L18 28V18h10l17 17M43 67l39-39V18H72L33 57m10 10L28 83 17 72l16-15m10 10L33 57m10 10l5 5M33 57l-5-5M57 67l15 16 11-11-16-15M57 67l10-10M57 67l-5 5m15-15l5-5"/>
					</svg>
					<img
						piece-id={turn.beatenPiece.id}
						class="figure"
						src="/chesspieces/{turn.beatenPiece.figure}.svg"
						alt="{turn.beatenPiece.name} {turn.beatenPiece.player}"
					/>
				{/if}
				<span class="time">{
					new Date(turn.time).toLocaleTimeString('en-US', {
						hour12: false,
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
					})
				}</span>
			</div>
		{/each}
	</div>

	<h4>{$player.enemyPieces.length} Beaten pieces</h4>
	<div class="enemy-pieces">
		{#if $player.enemyPieces.length < 1}
			<span class="empty">
				No beaten pieces
			</span>
		{/if}
		{#each $player.enemyPieces as piece}
			<div
			class="entry"
			class:hovering={isHoveringEntry(piece)}
			on:mouseover={() => mouseOverEntry(piece)}
			on:mouseleave={mouseLeaveEntry}>
				<img
					piece-id={piece.id}
					class="figure"
					src="/chesspieces/{piece.figure}.svg"
					alt="{piece.name} {piece.player}"
				/>
			</div>
		{/each}
	</div>
</div>
