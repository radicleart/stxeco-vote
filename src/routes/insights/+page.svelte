<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import StackingMenu from '$lib/components/dashboard/common/StackingMenu.svelte';
	import StackingHighlights from '$lib/components/dashboard/insights/StackingHighlights.svelte';

	let inited = false;

	onMount(async () => {
		inited = true
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

{#if inited}

<div class="py-6 rounded-2xl sm:rounded-none">
	<div class="py-4 mx-auto max-w-7xl md:px-6">
		<StackingMenu method={1}/>
		<StackingHighlights />
	</div>
</div>

{/if}