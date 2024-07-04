<script lang="ts">
	import { onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import type { ProposalEvent } from '@mijoco/stx_helpers/dist/index';

	export let proposalEvent: ProposalEvent;
	let tipHeight = $sessionStore.stacksInfo.burn_block_height;

	onMount(async () => {
	});
</script>
 
<svelte:head>
	<title>Ecosystem DAO</title>
	<meta
		name="description"
		content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin"
	/>
</svelte:head>

<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
	<p>Voting starts in {proposalEvent.proposalData.burnStartHeight - tipHeight} blocks.</p>
</div>

