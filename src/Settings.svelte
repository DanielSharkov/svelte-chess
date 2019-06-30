<script>
	import Chess from './engine'

	export let close;
	let bgImgURL = ''
	let newBgURL = ''

	function setNewBG() {
		if (newBgURL.length > 0) {
			Chess.newBG(newBgURL)
			newBgURL = ''
		}
	}
</script>



<style lang="stylus">
	.content
		width 500px
	h1
		margin 2rem 0 4rem 0
		text-align center
	h4
		display flex
		margin 0 0 1rem 0
		padding .5rem
		flex 1 1 100%
		text-align center
		align-items center
	.close-modal
		position absolute
		top 2rem
		right 2rem
		display flex
		padding .25rem
		border-radius 100%
		justify-content center
		align-content center
		align-items center
		.icon
			height 1.25rem
			width 1.25rem
			stroke #000
	h4:before, h4:after
		content ''
		height 1px
		margin auto 1rem
		flex 1 1 auto
		background-color rgba(0,0,0,.1)
	section
		margin-top 4rem
	.background
		.options
			display flex
			flex-flow row wrap
			width 100%
			justify-content flex-start
			align-items center
			.image
				position relative
				background-size cover
				height 100px
				box-shadow 0 4px 10px rgba(0,0,0,.2)
				border-radius 4px
				flex 0 0 calc(100% / 3 - 1rem)
				border none
				overflow hidden
				&:nth-child(3n+1)
					margin 0 1rem 1.5rem 0
				&:nth-child(3n+2)
					margin 0 .5rem 1.5rem .5rem
				&:nth-child(3n+3)
					margin 0 0 1.5rem 1rem
				&:not(.active)
					cursor pointer
				&:not(.active):hover, &:focus
					transform scale(1.1)
				&:after
					content 'Selected'
					position absolute
					bottom 0
					left 0
					display flex
					width 100%
					height 2.5rem
					justify-content center
					align-content center
					align-items center
					background-color rgba(0,0,0,.5)
					-webkit-backdrop-filter blur(4px)
					backdrop-filter blur(4px)
					color #FFF
					transition all cubic-bezier(.22,.61,.36,1) 300ms
					border-radius 0 0 4px 4px
					transform translateY(100%)
					border-top solid 1px rgba(#FFF, .25)
				&.active:after
					transform translateY(0)
				.remove
					position absolute
					top .5rem
					right .5rem
					display flex
					height 1.5rem
					width 1.5rem
					margin 0
					padding 0
					-webkit-backdrop-filter blur(4px)
					backdrop-filter blur(4px)
					background-color rgba(#000, .5)
					opacity 0
					box-shadow 0 0 0 1px rgba(#FFF, .25)
					border-radius 100%
					justify-content center
					align-content center
					align-items center
					&:hover
						box-shadow 0 0 0 .25rem rgba(#FFF, .5)
					.icon
						height 1rem
						width 1rem
						stroke #FFF
				&:hover .remove
					opacity 1
		.own-bg
			display flex
			margin 0 auto 1rem auto
			flex-flow row nowrap
			justify-content flex-start
			align-content center
			align-items center
			input
				padding .5rem
				border solid 1px rgba(0,0,0,.1)
				flex 1 1 auto
				&:hover
					border-color rgba(0,0,0,.5)
				&:active, &:focus
					border-color #000
					box-shadow 0 0 0 .25rem rgba(0,0,0,.15)
			button
				margin-left .5rem
				padding .5rem 1rem
				flex 0 0 auto
	.graphics
		.toggle
			position relative
			display flex
			width 60%
			margin 0 auto
			padding 0
			border-radius 4px
			border solid 1px rgba(0,0,0,.1)
			cursor pointer
			&:focus
				box-shadow 0 0 0 .25rem rgba(0,0,0,.1)
				border-color #000
			span
				z-index 1
				padding .5rem 0
				flex 1 1 50%
				text-align center
				pointer-events none
				&.active
					color #FFF
			.slide
				z-index 0
				position absolute
				left 0
				top 0
				width 50%
				height 100%
				margin 0
				background-color #000
				border-radius 4px 0 0 4px
				transition-duration 200
				pointer-events none
			&.fancy .slide
				border-radius 0 4px 4px 0
				transform translateX(100%)
</style>



<div class="content">
	<h1>Settings</h1>

	<button class="close-modal" on:click={close}>
		<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134 134">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M35 99l64-64m0 64L35 35"/>
		</svg>
	</button>

	<section class="graphics">
		<h4>Graphics</h4>
		<button
		class="toggle"
		on:click={Chess.toggleGraphics}
		class:fancy={$Chess.fancyGraphics}>
			<span class:active={!$Chess.fancyGraphics}>Low</span>
			<span class:active={$Chess.fancyGraphics}>High</span>
			<div class="slide"/>
		</button>
	</section>

	<section class="background">
		<h4>Background</h4>
		<div class="own-bg">
			<input
				id="ownbg"
				placeholder="Own background - Paste URL here"
				type="text"
				bind:value={newBgURL}
			/>
			<button on:click={setNewBG}>
				Set
			</button>
		</div>
		<div class="options">
			{#each Object.keys($Chess.backgrounds) as id}
				<button
				image-id={id}
				image-url={$Chess.backgrounds[id]}
				class:active={id === $Chess.currentBgId}
				class="image"
				style="background-image: url({$Chess.backgrounds[id]})"
				on:click={() => Chess.changeBG(id)}>
					<button
					class="remove"
					on:click={() => Chess.removeBG(id)}>
						<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134 134">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M35 99l64-64m0 64L35 35"/>
						</svg>
					</button>
				</button>
			{/each}
		</div>
	</section>
</div>
