<script lang="ts">
	import { fmtNumber } from '$lib/utils';
	import { sessionStore } from '$stores/stores';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers';
	import Countdown from '../../ui/Countdown.svelte';
	import { onMount } from 'svelte';
	import { isVoting } from '$lib/proposals';

	export let proposal:VotingEventProposeProposal;

	$: endBitcoinBlock = () => {
		return proposal.proposalData.burnEndHeight - ($sessionStore.stacksInfo?.burn_block_height || 0);
	}

	$: startsInBitcoinBlock = () => {
		return proposal.proposalData.burnStartHeight - ($sessionStore.stacksInfo?.stacks_tip_height || 0);
	}

	onMount(async () => {
	})

</script>

<div class="inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
	<div class="mb-1 flex items-center gap-2">
		<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
		<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
			{#if $sessionStore.stacksInfo.burn_block_height  >= proposal.proposalData.burnStartHeight }
				{#if $sessionStore.stacksInfo.burn_block_height  < proposal.proposalData.burnEndHeight}
				Vote in progress
				{:else}
				Voting closed
				{/if}
			{:else}
			Voting starts in {fmtNumber(startsInBitcoinBlock())} blocks
			{/if}
		</p>
	</div>
	{#if isVoting(proposal)}
	<div class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends in {fmtNumber(endBitcoinBlock())} bitcoin blocks</div>
	<div class="mt-1 font-mono text-[#131416] text-xs uppercase tracking-wider"><Countdown scaleFactor={1} endBlock={endBitcoinBlock()} /></div>
	{:else}
	<div class="mt-1 font-mono text-[#131416] text-xs uppercase tracking-wider">
		<Countdown scaleFactor={1} endBlock={startsInBitcoinBlock()} />
	</div>
	{/if}
</div>
