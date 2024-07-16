<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { sessionStore } from '$stores/stores';
	import { page } from '$app/stores';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';
	import ChainUtils from '$lib/service/ChainUtils';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT, getSummary } from '$lib/dao_api';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import DaoResults from '$lib/components/all-voters/dao-voting/DaoResults.svelte';
	import PoolResults from '$lib/components/all-voters/pool/PoolResults.svelte';
	import SoloResults from '$lib/components/all-voters/solo/SoloResults.svelte';
	import { goto } from '$app/navigation';
	import VoteResultsOverview from '$lib/components/all-voters/VoteResultsOverview.svelte';
	import HoldingResults from '$lib/components/all-voters/HoldingResults.svelte';
	import { getCurrentProposalLink, getProposalLatest, getProposalNotFoundLink, isPostVoting, isVoting } from '$lib/proposals';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import { type ResultsSummary, type StackerProposalData, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { Placeholder } from '@mijoco/stx_components';
	import { getDaoSummary } from '$lib/voting-non-stacker';
	import { fmtNumber, fmtStxMicro } from '$lib/utils';
	import { getStackerBitcoinTxs, getStackerStacksTxs } from '$lib/tally';

	let proposal:VotingEventProposeProposal|undefined;

	let summary:ResultsSummary;
	let daoSummary:ResultsSummary;
	let uniqueAll:number = 0;
	let uniqueAccounts:number = 0;
	let method:number = -1;
	let errorReason:string|undefined;
	let balanceAtHeight:number = 0;
	let approved = false;
	let inited = false;
	let poolVoting = true;
	let soloVoting = true;

	const changeMethod = async (e:any, newMethod:number) => {
    	e.preventDefault();
		method = newMethod
		$page.url.searchParams.set('method', '' + method)
		goto(`?${$page.url.searchParams.toString()}`);
		const getMeTo = document.getElementById("tabs-header");
		await tick();
  		if (getMeTo) getMeTo.scrollTo({behavior: 'smooth'});
		return false;
	}

	const blockSinceEnd = () => {
		return $sessionStore.stacksInfo?.burn_block_height - (proposal?.proposalData?.burnEndHeight || 0)
	}

	const isApproved = () => {
		approved = $sessionStore.stacksInfo?.burn_block_height > NAKAMOTO_VOTE_STOPS_HEIGHT
	}

	const voteConcluded = () => {
		if (!proposal || !proposal.proposalData) return false
		return isPostVoting(proposal)
	}

	const uniqueVotes = (proposal:VotingEventProposeProposal, summary:any) => {
		const sd:StackerProposalData|undefined = proposal.stackerData;
		let votesFor = summary.summary.find((o:any) => o._id.event === 'pool-vote' && o._id.for)
		if (!votesFor) votesFor = {count: 0, total: 0}
		let votesAgn = summary.summary.find((o:any) => o._id.event === 'pool-vote' && !o._id.for)
		if (!votesAgn) votesAgn = {count: 0, total: 0}
		if (sd && sd.reportedResults) {
			summary.uniquePoolVoters = sd.reportedResults.poolAddresses
			summary.uniqueSoloVoters = sd.reportedResults.soloAddresses
			votesFor.count =  sd.reportedResults.poolAddresses
			votesFor.total =  fmtStxMicro(sd.reportedResults.poolFor || 0)
			votesAgn.total =  fmtStxMicro(sd.reportedResults.poolAgainst || 0)
		}
		let stxFor = votesFor?.count || 0
		let stxAgainst = votesAgn?.count || 0
		let stxPower = stxFor + stxAgainst

		votesFor = summary.summary.find((o:any) => o._id.event === 'solo-vote' && o._id.for)
		if (!votesFor) votesFor = {count: 0, total: 0}
		votesAgn = summary.summary.find((o:any) => o._id.event === 'solo-vote' && !o._id.for)
		if (!votesAgn) votesAgn = {count: 0, total: 0}
		if (soloVoting && sd && sd.reportedResults) {
			votesFor.count =  sd.reportedResults.soloAddresses
			votesFor.total =  fmtStxMicro(sd.reportedResults.soloFor || 0)
			votesAgn.total =  fmtStxMicro(sd.reportedResults.soloAgainst || 0)
		}
		stxFor = votesFor?.count || 0
		stxAgainst = votesAgn?.count || 0
		stxPower += stxFor + stxAgainst

		votesFor = daoSummary.summary.find((o:any) => o._id.event === 'vote' && o._id.for)
		votesAgn = daoSummary.summary.find((o:any) => o._id.event === 'vote' && !o._id.for)
		uniqueAccounts = summary.uniquePoolVoters + summary.uniqueSoloVoters + (votesFor?.count || 0) + (votesAgn?.count || 0);
		stxFor = daoSummary.proposalData.votesFor
		stxAgainst = daoSummary.proposalData.votesAgainst
		stxPower += stxFor + stxAgainst

		if (proposal.proposal ===  'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.edp015-sip-activation') {
			poolVoting = false
			soloVoting = false
			uniqueAccounts = (votesFor?.count || 0) + (votesAgn?.count || 0);
		}

		return stxPower
	}

	onMount(async () => {
		method = 3 //Number($page.url.searchParams.get('method')) || 3
		proposal = await getProposalLatest($page.params.slug)

		if (proposal) {
			//const stacksTxs = await getStackerStacksTxs(proposal)
			const bitcoinTxs = await getStackerBitcoinTxs(proposal)
			daoSummary = await getDaoSummary(proposal.proposal)
			//const results = await findPoolVotes()
			//poolVotes = results.poolVotes
			summary = await getSummary(proposal.proposal)
			summary.proposalData = proposal.proposalData
			//const allVotes = await getPoolAndSoloVotesByProposal(event.contractId)
			//poolVotes = allVotes.poolVotes || [];
			//soloVotes = allVotes.soloVotes || [];
			uniqueAll = uniqueVotes(proposal, summary);
			
			isApproved()
			try {
				const response = await getBalanceAtHeight(getConfig().VITE_STACKS_API, $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress, proposal.proposalData.startBlockHeight);
				balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
			} catch (e:any) {
				balanceAtHeight = $sessionStore.keySets[getConfig().VITE_NETWORK].walletBalances?.stacks.amount || 0;
				errorReason = e.message;
			}
		}
		inited = true;

	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">

	{#if proposal && inited}

	<ProposalHeader {proposal}/>
	{#if voteConcluded() || isVoting(proposal)}
		<div class="flex flex-col w-full my-8">
			<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
			  	<div class="flex flex-col items-stretch justify-items-stretch">
					<div>
						{#if blockSinceEnd() > 0}
						<div class="mb-3 max-w-md">
							<h2 class="text-[#131416] text-2xl mb-3">Voting over</h2>
							<p>Voting closed at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
							<p>{uniqueAccounts} addresses voted. Detailed results are displayed below.</p>
						</div>
						{:else}
						<div class="mb-3 max-w-md">
							<h2 class="text-[#131416] text-2xl mb-3">Voting in progress</h2>
							<p>Voting closes at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
							<p>{uniqueAccounts} addresses voted. Detailed results are displayed below.</p>
						</div>
						{/if}
					</div>
				</div>
				<NakamotoBackground />
				<NakamotoShield />
			</div>
		</div>
		
		{#if proposal.proposalData.concluded}
		<div id="tabs-header">
			<VoteResultsOverview {approved} {summary} {daoSummary} {poolVoting} {soloVoting}/>
		</div>
		{/if}
		<div >
		<Tabs  style="underline" contentClass="py-4">

			{#if soloVoting}
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
					open={method === 1} on:keyup={(e) => changeMethod(e, 1)} title="Solo Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<SoloResults {proposal} {summary} />
				</div>
        	</TabItem>
			{/if}

			{#if poolVoting}
           	<TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
			open={method === 2} on:keyup={(e) => changeMethod(e, 2)} title="Pool Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<PoolResults {proposal} {summary} />
				</div>
            </TabItem>
			{/if}

			{#if daoSummary}
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
					open={method === 3} on:keyup={(e) => changeMethod(e, 3)} title="Non Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<DaoResults {proposal} {daoSummary} />
				</div>
            </TabItem>
			{/if}
        </Tabs>
		</div>
		{:else}
		<HoldingResults />
		{/if}

	{:else}
	{#if !proposal}
	<Placeholder message={'Proposal could not be loaded'} link={getProposalNotFoundLink()}/>
	{:else}
	<Placeholder message={'Vote info loading'} link={getCurrentProposalLink($page.params.slug)}/>
	{/if}
	{/if}

</div>
