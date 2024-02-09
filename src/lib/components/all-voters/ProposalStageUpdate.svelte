<script lang="ts">
	import { fmtNumber } from '$lib/utils';
	import { sbtcConfig } from '$stores/stores';
	import { NAKAMOTO_VOTE_START_HEIGHT, NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao_api';
	import Countdown from '../shared/Countdown.svelte';
	import type { ProposalEvent } from '$types/stxeco.type';
	import { onDestroy, onMount } from 'svelte';

	export let proposal:ProposalEvent|undefined;
	export let method:number;

	$: endBitcoinBlock = () => {
		return ($sbtcConfig.stacksInfo) ? NAKAMOTO_VOTE_STOPS_HEIGHT - $sbtcConfig.stacksInfo.burn_block_height : 0;
	}

	$: startsInBitcoinBlock = () => {
		return ($sbtcConfig.stacksInfo) ? NAKAMOTO_VOTE_START_HEIGHT - $sbtcConfig.stacksInfo.burn_block_height : 0;
	}

	onMount(() => {
	})

</script>

<div class="inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
	<div class="flex items-center gap-2">
		<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
		<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
			{#if proposal && proposal.proposalData}
				Vote in progress
			{:else}
				Voting starts in {fmtNumber(startsInBitcoinBlock())} blocks
			{/if}
		</p>
	</div>
	{#if proposal && proposal.proposalData}
		{#if method === 3}
		<div class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends at stacks block {fmtNumber(proposal.proposalData.endBlockHeight)}</div>
		{:else}
		<div class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends in {fmtNumber(endBitcoinBlock())} bitcoin blocks</div>
		{/if}
	{:else}
	<div class="mt-1 font-mono text-[#131416] text-xs uppercase tracking-wider">
		<Countdown endBlock={startsInBitcoinBlock()} />
	</div>
	{/if}
</div>
