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
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';


	// fetch/hydrate data from local storage
	let soloVotes:Array<VoteEvent>;
	let poolVotes:Array<VoteEvent>;
	let daoVotes:Array<VoteEvent>;
	let method:number = -1;
	let errorReason:string|undefined;
	let proposal:ProposalEvent;
	let balanceAtHeight:number = 0;
	let inited = false;

	onMount(async () => {
		method = Number($page.url.searchParams.get('method')) || 3
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposal = event;
			inited = true;
			const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
			DaoUtils.setStatus(stacksTipHeight, proposal);
			daoVotes = await getDaoVotesByProposal(event.contractId);
			const allVotes = await getPoolAndSoloVotesByProposal(event.contractId)
			poolVotes = allVotes.poolVotes;
			soloVotes = allVotes.soloVotes;
			DaoUtils.setStatus($sbtcConfig.stacksInfo.stacks_tip_height, proposal);
			console.log(event)
		} else {
			goto('/dao/proposals/holding')
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

	{#if proposal}
	<ProposalHeader {proposal} />
	{/if}

	{#if inited}
		{#if proposal.stage === ProposalStage.PARTIAL_FUNDING || proposal.stage === ProposalStage.UNFUNDED}
			<FundedSubmissionVoting {proposal} />
		{:else}
			{#if method === 1}
				<SoloVotingActive {proposal} />
			{:else if method === 2}
				<PoolVotingActive {proposal} />
			{:else if method === 3}
				<DaoVotingActive {proposal} />
			{:else}
				<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
					<Skeleton size="md" />
				</div>
			{/if}
		{/if}
	{/if}
</div>