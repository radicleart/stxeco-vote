<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from 'flowbite-svelte';
	import { COMMS_ERROR, fmtNumber } from '$lib/utils.js'
	import { sbtcConfig } from '$stores/stores';
	import { page } from '$app/stores';
	import { CONFIG } from '$lib/config';
	import DaoUtils from '$lib/service/DaoUtils';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import ChainUtils from '$lib/service/ChainUtils';
	import { goto } from '$app/navigation';
	import FundedSubmissionVoting from '$lib/components/dao/submission/FundedSubmissionVoting.svelte';
	import SoloInactive from '$lib/components/all-voters/solo/SoloInactive.svelte';
	import SoloConcluded from '$lib/components/all-voters/solo/SoloConcluded.svelte';
	import SoloProposed from '$lib/components/all-voters/solo/SoloProposed.svelte';
	import PoolInactive from '$lib/components/all-voters/pool/PoolInactive.svelte';
	import PoolProposed from '$lib/components/all-voters/pool/PoolProposed.svelte';
	import PoolConcluded from '$lib/components/all-voters/pool/PoolConcluded.svelte';
	import DaoInactive from '$lib/components/all-voters/dao-voting/DaoInactive.svelte';
	import DaoProposed from '$lib/components/all-voters/dao-voting/DaoProposed.svelte';
	import DaoConcluded from '$lib/components/all-voters/dao-voting/DaoConcluded.svelte';
	import { getDaoVotesByProposal, getPoolAndSoloVotesByProposal } from '$lib/dao_api';
	import { ProposalStage, type ProposalEvent, type VoteEvent } from '$types/stxeco.type';
	import Preamble from '$lib/components/all-voters/Preamble.svelte';
	import SoloVotingActive from '$lib/components/all-voters/solo/SoloVotingActive.svelte';
	import PoolVotingActive from '$lib/components/all-voters/pool/PoolVotingActive.svelte';
	import DaoVotingActive from '$lib/components/all-voters/dao-voting/DaoVotingActive.svelte';

	let showDetails = false;

	// fetch/hydrate data from local storage
	let soloVotes:Array<VoteEvent>;
	let poolVotes:Array<VoteEvent>;
	let daoVotes:Array<VoteEvent>;
	let method:number = -1;
	let errorReason:string|undefined;
	let proposalEvent:ProposalEvent;
	let balanceAtHeight:number = 0;
	let inited = false;

	onMount(async () => {
		method = Number($page.url.searchParams.get('method')) || 3
		//if (method !== 1 && method !== 2 && method !== 3) method = 3
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposalEvent = event;
			inited = true;
			const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
			DaoUtils.setStatus(stacksTipHeight, proposalEvent);
			daoVotes = await getDaoVotesByProposal(event.contractId);
			const allVotes = await getPoolAndSoloVotesByProposal(event.contractId)
			poolVotes = allVotes.poolVotes;
			soloVotes = allVotes.soloVotes;
			DaoUtils.setStatus($sbtcConfig.stacksInfo.stacks_tip_height, proposalEvent);
			console.log(event)
		} else {
			goto('/dao/proposals/holding')
		}

		try {
			const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposalEvent.proposalData.startBlockHeight);
			balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
		} catch (e:any) {
			balanceAtHeight = 0;
			errorReason = e.message;
		}
		inited = true;
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
	<div class="mt-8 inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
		{#if inited}
		<div class="flex items-center gap-2 -mb-1">
			<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
			<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
				{#if proposalEvent.stage === ProposalStage.PARTIAL_FUNDING || proposalEvent.stage === ProposalStage.UNFUNDED}
				Funding in progress
				{:else}
				Vote in progress
				{/if}
				</p>
			</div>
			{#if proposalEvent.stage === ProposalStage.PARTIAL_FUNDING || proposalEvent.stage === ProposalStage.UNFUNDED}
			<span class="font-mono text-[#131416] text-xs uppercase tracking-wider">Awaiting funding</span>
			{:else}
			<span class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends at block {fmtNumber(proposalEvent.proposalData.endBlockHeight)}</span>
			{/if}
		{/if}
	</div>
	<div class="flex items-center justify-between mt-6">
		<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl -mx-4">
			<a href="https://github.com/stacksgov/sips/pull/155/files#diff-f54db5667e06bf510f4dfd4e8c0169c309558f037c2fc758759dc74a6bd9679c" class="py-2 px-4 rounded-md" target="_blank">
				SIP-021 - Nakamoto Release
				<svg class="inline" width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M34.8958 27.6042L37.5 25C40.9518 21.5482 40.9518 15.9518 37.5 12.5C34.0482 9.04822 28.4518 9.04822 25 12.5L22.3958 15.1042" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M15.1042 22.3958L12.5 25C9.04822 28.4518 9.04822 34.0482 12.5 37.5C15.9518 40.9518 21.5482 40.9518 25 37.5L27.6042 34.8958" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M29.6875 20.3125L20.3125 29.6875" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>
		</h1>

		<button on:click={() => (showDetails = !showDetails)} class="text-sm font-mono uppercase inline-flex items-center bg-transparent gap-2 px-4 py-2 font-normal text-[#0A0A0B]/[0.64] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
			<!-- Show/Hide toggle -->
			Show details <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
				<path fill-rule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clip-rule="evenodd" />
			</svg>
		</button>
	</div>

	{#if inited}
		{#if showDetails}
			<Preamble proposal={proposalEvent} />
		{/if}

		{#if proposalEvent.stage === ProposalStage.PARTIAL_FUNDING || proposalEvent.stage === ProposalStage.UNFUNDED}
		<FundedSubmissionVoting proposal={proposalEvent} />
		{:else}
			{#if method === 1}
			<SoloVotingActive proposal={proposalEvent} />
			{:else if method === 2}
			<PoolVotingActive proposal={proposalEvent} />
			{:else if method === 3}
			<DaoVotingActive proposal={proposalEvent} />
			{:else}
			<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
				<Skeleton size="md" />
			</div>
			{/if}
		{/if}
	{/if}
</div>

<!--
<div>
	<div class="flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
	{#if proposalEvent && inited}
			<Tabs style="underline" contentClass="py-4">
		{#if proposalEvent.stage === ProposalStage.PARTIAL_FUNDING || proposalEvent.stage === ProposalStage.UNFUNDED}
			<FundedSubmissionVoting proposal={proposalEvent} />
		{:else}
			<TabItem  open={method === 1} on:click={() => goto('/dao/proposals/' + proposalEvent.contractId + '?method=1')} title="Solo Stackers">
				{#if proposalEvent.stage === ProposalStage.ACTIVE}
				<SoloActive {proposalEvent}/>
				{:else if proposalEvent.stage === ProposalStage.INACTIVE}
				<SoloInactive {proposalEvent} />
				{:else if proposalEvent.stage === ProposalStage.CONCLUDED}
				<SoloConcluded {proposalEvent} />
				{:else}
				<SoloProposed {proposalEvent} />
				{/if}
			</TabItem>
			<TabItem open={method === 2} on:click={() => goto('/dao/proposals/' + proposalEvent.contractId + '?method=2')} title="Pool Stackers">
				{#if proposalEvent.stage === ProposalStage.ACTIVE}
				<PoolActive {proposalEvent} />
				{:else if proposalEvent.stage === ProposalStage.INACTIVE}
				<PoolInactive {proposalEvent} />
				{:else if proposalEvent.stage === ProposalStage.CONCLUDED}
				<PoolConcluded {proposalEvent} />
				{:else}
				<PoolProposed {proposalEvent} />
				{/if}
			</TabItem>
			<TabItem open={method === 3} on:click={() => goto('/dao/proposals/' + proposalEvent.contractId + '?method=3')} title="Non-Stackers">
				{#if proposalEvent.stage === ProposalStage.ACTIVE}
				<DaoActive {proposalEvent} {balanceAtHeight} {daoVotes}/>
				{:else if proposalEvent.stage === ProposalStage.INACTIVE}
				<DaoInactive {proposalEvent} />
				{:else if proposalEvent.stage === ProposalStage.CONCLUDED}
				<DaoConcluded {proposalEvent}  {daoVotes}/>
				{:else}
				<DaoProposed {proposalEvent} />
				{/if}
			</TabItem>
		{/if}
		</Tabs>
	{:else}
		<Tabs style="underline" contentClass="py-4">
				<TabItem open={true} title="Fetching data">
				<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
				<Skeleton size="md" />
				</div>
				</TabItem>
			</Tabs>
	{/if}
	</div>
</div> -->

