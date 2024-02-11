<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from 'flowbite-svelte';
	import { fmtNumber } from '$lib/utils.js'
	import { sbtcConfig } from '$stores/stores';
	import { page } from '$app/stores';
	import { CONFIG } from '$lib/config';
	import DaoUtils from '$lib/service/DaoUtils';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import ChainUtils from '$lib/service/ChainUtils';
	import { goto } from '$app/navigation';
	import Funding from '$lib/components/all-voters/Funding.svelte';
	import DaoInactive from '$lib/components/all-voters/dao-voting/DaoInactive.svelte';
	import { getDaoVotesByProposal } from '$lib/dao_api';
	import { ProposalStage, type ProposalEvent, type VoteEvent } from '$types/stxeco.type';
	import SoloVotingActive from '$lib/components/all-voters/solo/SoloVotingActive.svelte';
	import PoolVotingActive from '$lib/components/all-voters/pool/PoolVotingActive.svelte';
	import DaoVotingActive from '$lib/components/all-voters/dao-voting/DaoVotingActive.svelte';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import Proposed from '$lib/components/all-voters/Proposed.svelte';
	import Holding from '$lib/components/all-voters/Holding.svelte';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';
	import DaoConcluded from '$lib/components/all-voters/dao-voting/DaoConcluded.svelte';
	import Placeholder from '$lib/components/all-voters/Placeholder.svelte';
	import { isCoordinator } from '$lib/sbtc_admin';

	let daoVotes:Array<VoteEvent>;
	let method:number = -1;
	let errorReason:string|undefined;
	let proposal:ProposalEvent;
	let balanceAtHeight:number = 0;
	let proposalNotFound = false;
	let activeFlag = true;
	let inited = false;

	onMount(async () => {
		method = Number($page.url.searchParams.get('method')) || 3
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposal = event;
			const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
			const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
			DaoUtils.setStatus(method, burnHeight, stacksTipHeight, proposal);
			daoVotes = await getDaoVotesByProposal(event.contractId);
			//activeFlag = proposal.proposalData && stacksTipHeight >= proposal.proposalData.startBlockHeight
		} else {
			proposalNotFound = true
		}

		if (CONFIG.VITE_NETWORK === 'mainnet' && !isCoordinator($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)) {
			//proposalNotFound = true
			//activeFlag = false
		}

		try {
			const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposal.proposalData.startBlockHeight);
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
	{#if inited}

	{#if proposal}
	<ProposalHeader {proposal} {method} />
	{/if}

	{#if !activeFlag}
		<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
			<div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
				{#if proposalNotFound}
				<Holding />
				{:else if proposal.stage === ProposalStage.PARTIAL_FUNDING || proposal.stage === ProposalStage.UNFUNDED}
				<Funding {proposal} />
				{:else if proposal.stage === ProposalStage.PROPOSED}
				<Proposed {proposal} />
				{/if}
				<NakamotoBackground />
				<NakamotoShield />
			</div>
		</div>
	{:else}
		{#if proposal.stage === ProposalStage.ACTIVE}
			{#if method === 1}
				<SoloVotingActive {proposal} />
			{:else if method === 2}
				<PoolVotingActive {proposal} />
			{:else if method === 3}
				{#if $sbtcConfig.stacksInfo?.stacks_tip_height >= proposal.proposalData.startBlockHeight}
				<DaoVotingActive {proposal} />
				{:else}
				<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
					<div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
						<Holding />
					</div>
				</div>
				{/if}
			{:else}
				<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
					<Skeleton size="md" />
				</div>
			{/if}
		{:else if proposal.stage === ProposalStage.PROPOSED}
		<Holding />

		{:else if proposal.stage === ProposalStage.INACTIVE}
		<DaoInactive {proposal}/>
		{:else}
		<DaoConcluded {proposal}/>
		{/if}
	{/if}
	{:else}
	<Placeholder />
	{/if}
</div>