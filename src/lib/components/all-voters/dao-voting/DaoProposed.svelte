<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import type { ProposalEvent } from '$types/stxeco.type';

	export let proposalEvent: ProposalEvent;
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;

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
	<p>Voting starts in {proposalEvent.proposalData.startBlockHeight - stacksTipHeight} blocks.</p>
</div>

