<script lang="ts">
	import { fmtNumber } from '$lib/utils';
	import { sessionStore } from '$stores/stores';
	import { NAKAMOTO_VOTE_START_HEIGHT, NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao_api';
	import Countdown from '../../ui/Countdown.svelte';
	import { onDestroy, onMount } from 'svelte';
	import DaoUtils from '$lib/service/DaoUtils';
	import { daoStore } from '$stores/stores_dao';
	import { ProposalStage, type ProposalEvent } from '@mijoco/stxeco_types';

	export let proposal:ProposalEvent|undefined;
	export let method:number;

	$: endBitcoinBlock = () => {
		return ($sessionStore.stacksInfo) ? NAKAMOTO_VOTE_STOPS_HEIGHT - $sessionStore.stacksInfo.burn_block_height : 0;
	}

	$: endStacksBlock = () => {
		return ($sessionStore.stacksInfo && proposal) ? proposal.proposalData.endBlockHeight - $sessionStore.stacksInfo.stacks_tip_height : 0;
	}

	$: startsInBitcoinBlock = () => {
		return ($sessionStore.stacksInfo) ? NAKAMOTO_VOTE_START_HEIGHT - $sessionStore.stacksInfo.burn_block_height : 0;
	}

	$: startsInStacksBlock = () => {
		return ($sessionStore.stacksInfo && proposal) ? proposal.proposalData.startBlockHeight - $sessionStore.stacksInfo.stacks_tip_height : 0;
	}

	onMount(async () => {
		if (!proposal) {
			let event:ProposalEvent|undefined = await DaoUtils.getProposal($daoStore.proposals, $daoStore.currentProposal?.contractId || '');
			if (event) {
				proposal = event;
				const stacksTipHeight = $sessionStore.stacksInfo?.stacks_tip_height | 0;
				const burnHeight = $sessionStore.stacksInfo?.burn_block_height | 0;
				DaoUtils.setStatus(method, burnHeight, stacksTipHeight, proposal);
			}
		}
	})

</script>

{#if proposal && $sessionStore.stacksInfo}
<div class="inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
	<div class="mb-1 flex items-center gap-2">
		<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
		<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
			{#if method !== 3 && $sessionStore.stacksInfo.burn_block_height  >= NAKAMOTO_VOTE_START_HEIGHT }
				{#if $sessionStore.stacksInfo.burn_block_height  < NAKAMOTO_VOTE_STOPS_HEIGHT}
				Vote in progress
				{:else}
				Voting closed
				{/if}
				{:else if method === 3 && endStacksBlock() <= 0 }
				Voting closed
				{:else if method === 3 && startsInStacksBlock() <= 0 }
				Vote in progress
					{:else}
				{#if method === 3}
				Voting starts in {fmtNumber(startsInStacksBlock())} blocks
				{:else}
				Voting starts in {fmtNumber(startsInBitcoinBlock())} blocks
				{/if}
			{/if}
		</p>
	</div>
	{#if proposal && proposal.proposalData && proposal.stage === ProposalStage.ACTIVE}
		{#if method === 3}
		<div class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends at stacks block {fmtNumber(proposal.proposalData.endBlockHeight)}</div>
		<div class="mt-1 font-mono text-[#131416] text-xs uppercase tracking-wider"><Countdown scaleFactor={1/0.83} endBlock={endStacksBlock()} /></div>
		{:else}
		<div class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends in {fmtNumber(endBitcoinBlock())} bitcoin blocks</div>
		<div class="mt-1 font-mono text-[#131416] text-xs uppercase tracking-wider"><Countdown scaleFactor={1} endBlock={endBitcoinBlock()} /></div>
		{/if}
	{:else}
	<div class="mt-1 font-mono text-[#131416] text-xs uppercase tracking-wider">
		{#if method === 3 && proposal?.proposalData}
		<Countdown scaleFactor={1/0.83} endBlock={startsInStacksBlock()} />
		{:else}
		<Countdown scaleFactor={1} endBlock={startsInBitcoinBlock()} />
		{/if}
	</div>
	{/if}
</div>
{/if}