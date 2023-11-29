<script>
	export let type = 'primary'
	export let flat = false
	export let inverse = false
</script>

<button class={type} class:flat={flat} class:inverse={inverse} on:click>
	<slot></slot>
</button>

<style>
	button {
		border: 0;
		cursor: pointer;
		padding: 8px 12px;
		font-weight: bold;
		box-shadow: 1px 2px 3px rgba(0,0,0,0.2);
	}
	.secondary {
		background: #45c496;
		color: #fff;
	}
	.primary {
		background: #d91b42;
		color: #fff;
	}
	.flat {
		box-shadow: none;
	}
	.primary.inverse {
		background: #fff;
		color: #d91b42;
	}
	.primary.inverse {
		background: #fff;
		color: #d91b42;
	}
	.secondary.inverse {
		background: #fff;
		color: #45c496;
	}
</style>