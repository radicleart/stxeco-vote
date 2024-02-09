<script lang="ts">
	import { sbtcConfig } from '$stores/stores';
	import { fmtMicroToStx, fmtNumber } from 'sbtc-bridge-lib';
	import { onMount } from 'svelte';
	import type { ProposalEvent } from '$types/stxeco.type';

	export let proposal:ProposalEvent;
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let startHeightMessage:string;
	let durationMessage:string;

	onMount(async () => {
		const proposalDuration = proposal.funding.parameters.proposalDuration
		const proposalStartDelay = proposal.funding.parameters.proposalStartDelay
		startHeightMessage = 'The earliest start for voting is in ' + proposalStartDelay + ' blocks ' + ((proposalStartDelay) / 144).toFixed(2) + ' days after proposal is funded at block ~ ' + (fmtNumber(stacksTipHeight + proposalStartDelay));
		durationMessage = 'The voting window is ' + (proposalDuration)+ ' blocks, roughly ' + ((proposalDuration) / 144).toFixed(2) + ' days, after voting starts.';
	})
</script>


<div class="flex flex-col gap-y-5 bg-warning-01">
	<h1 class="text-3xl mb-6">Voting starts soon</h1>
	{#if proposal.proposalData}
		<p class="text-base">Voting on this proposal will begin in {fmtNumber(proposal.proposalData.startBlockHeight - stacksTipHeight)} blocks.</p>
		<p class="text-base">Voting will end at block #{fmtNumber(proposal.proposalData.endBlockHeight)}.</p>
	{/if}
</div>
