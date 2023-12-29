<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton, Tabs, TabItem } from 'flowbite-svelte';
	import { COMMS_ERROR } from '$lib/utils.js'
	import { sbtcConfig } from '$stores/stores';
	import { page } from '$app/stores';
	import { CONFIG } from '$lib/config';
	import DaoUtils from '$lib/service/DaoUtils';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import ChainUtils from '$lib/service/ChainUtils';
	import { ProposalStage, type ProposalEvent, type VoteEvent } from '$types/stxeco.type';
	import { goto } from '$app/navigation';
	import SoloActive from '$lib/components/all-voters/solo/SoloActive.svelte';
	import PoolActive from '$lib/components/all-voters/pool/PoolActive.svelte';
	import DaoActive from '$lib/components/all-voters/dao-voting/DaoActive.svelte';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
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
  
	// fetch/hydrate data from local storage
	let soloVotes:Array<VoteEvent>;
	let poolVotes:Array<VoteEvent>;
	let daoVotes:Array<VoteEvent>;
	let method:number = 3;
	let errorReason:string|undefined; 
	let proposalEvent:ProposalEvent;
	let balanceAtHeight:number = 0;
	let inited = false;
  
	onMount(async () => {
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposalEvent = event;
			const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
			DaoUtils.setStatus(stacksTipHeight, proposalEvent);
			daoVotes = await getDaoVotesByProposal(event.contractId);
			const allVotes = await getPoolAndSoloVotesByProposal(event.contractId)
			poolVotes = allVotes.poolVotes;
			soloVotes = allVotes.soloVotes;
			DaoUtils.setStatus($sbtcConfig.stacksInfo.stacks_tip_height, proposalEvent);
			console.log(event)
		} else {
			goto('/dao/proposals/propose')
		}

		try {
			method = Number($page.url.searchParams.get('method')) || 3
			if (method !== 1 && method !== 2 && method !== 3) method = 3
		} catch (err) {
			errorReason = COMMS_ERROR;
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
	<div class="flex flex-col w-full my-8">
	  <div class="flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
		{#if proposalEvent && inited}
			<ProposalHeader {proposalEvent} />
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
				<TabItem open={method === 3} on:click={() => goto('/dao/proposals/' + proposalEvent.contractId + '?method=3')} title="Liquid STX">
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
	</div>
</div>
  
<!--
  <div class="cols-12"><h1 class={'text-warning-500 text-2xl'}><span class={'strokeme-info'}>SIP Voting is Coming Soon</span></h1></div>
  <div class="cols-12">
	<p class="strapline">The proposal for SIP (Stacks Upgrade) will be deployed soon.</p>
	<p class="strapline">Voting will end roughly 4 weeks after the proposal opens.</p>
  </div>
  <div class="flex justify-center absolute bottom-5"><a href="/dao/proposals/propose">make a proposal</a></div>
  -->
  