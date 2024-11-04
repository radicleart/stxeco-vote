<script lang="ts">
	import { onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import { page } from '$app/stores';
	import { getSummary } from '$lib/dao_api';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import { goto } from '$app/navigation';
	import { getProposalLatest, isCoordinator, isPostVoting } from '$lib/proposals';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import {
		getBalanceAtHeight,
		type ResultsSummary,
		type StackerProposalData,
		type VoteEvent,
		type VotingEventProposeProposal
	} from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { getDaoSummary, readVotingContractEvents } from '$lib/voting-non-stacker';
	import { explorerTxUrl, fmtNumber, fmtStxMicro } from '$lib/utils';
	import { getStackerEvents, readStackerEvents, reconcileStackerEvents } from '$lib/voting-stacker';
	import {
		getBurnHeightToRewardCycle,
		getCheckDelegation,
		getStackerInfo,
		getStackerInfoFromContract
	} from '@mijoco/stx_helpers/dist/pox/pox';
	import type { Delegation } from '@mijoco/stx_helpers/dist/pox_types';
	import { getTotalStackedInCycle } from '$lib/pox_api';

	let proposal: VotingEventProposeProposal;
	let votes: { votesStacks: Array<VoteEvent>; votesBitcoin: Array<VoteEvent> } | undefined;
	let toggleStacks = false;
	let toggleBitcoin = false;
	let cycle1 = 0;
	let cycle2 = 0;
	let stacksStartHeight = 0;
	let burnStartHeight = 0;

	let daoSummary: ResultsSummary;
	let uniqueAccounts: number = 0;
	let method: number = -1;
	let inited = false;
	let poolVoting = true;
	let soloVoting = true;
	let message: string | undefined;

	const blockSinceEnd = () => {
		return (
			$sessionStore.stacksInfo?.burn_block_height - (proposal?.proposalData?.burnEndHeight || 0)
		);
	};

	const doVoteAmountStacks = async (voter: string) => {
		let stacker = await getStackerInfo(
			getConfig().VITE_STACKS_API,
			getConfig().VITE_NETWORK,
			getConfig().VITE_POX_CONTRACT_ID,
			voter,
			stacksStartHeight + 2200
		);
		console.log(stacker);
		stacker = await getStackerInfo(
			getConfig().VITE_STACKS_API,
			getConfig().VITE_NETWORK,
			getConfig().VITE_POX_CONTRACT_ID,
			voter,
			stacksStartHeight + 200
		);
		console.log(stacker);
	};

	const doVoteAmountBitcoin = async (voter: string) => {
		let amount = await getTotalStackedInCycle(voter, stacksStartHeight + 2200);
		console.log(amount);
	};

	const readStackerVotes = () => {
		readStackerEvents(proposal.proposal);
		message = 'Reading stacker voting events for contract: ' + proposal.proposal;
	};

	const reconcileStackerVotes = () => {
		reconcileStackerEvents(proposal.proposal);
		message = 'Reconciling stacker voting events for contract: ' + proposal.proposal;
	};

	const readNonStackerVotes = () => {
		readVotingContractEvents(true, proposal.daoContract, proposal.votingContract);
		message = 'Reading voting events for contract: ' + proposal.proposal;
	};

	const fetchVotingInformation = async () => {
		votes = await getStackerEvents(proposal.proposal);
		burnStartHeight =
			proposal.stackerData?.heights?.burnStart || proposal.proposalData.burnStartHeight;
		const endHeight = proposal.stackerData?.heights?.burnEnd || proposal.proposalData.burnEndHeight;
		stacksStartHeight = proposal.proposalData.startBlockHeight;

		const cycle1CV = proposal.stackerData
			? await getBurnHeightToRewardCycle(
					getConfig().VITE_STACKS_API,
					getConfig().VITE_POX_CONTRACT_ID,
					burnStartHeight + 200
				)
			: undefined;
		const cycle2CV = proposal.stackerData
			? await getBurnHeightToRewardCycle(
					getConfig().VITE_STACKS_API,
					getConfig().VITE_POX_CONTRACT_ID,
					endHeight - 200
				)
			: undefined;
		if (cycle1CV) cycle1 = Number(cycle1CV.cycle.value);
		if (cycle2CV) cycle2 = Number(cycle2CV.cycle.value);
		daoSummary = await getDaoSummary(proposal.proposal);
		let summary: any = await getSummary(proposal.proposal);
		summary.proposalData = proposal.proposalData;
		//uniqueAll = fetchVotingInformation(proposal, summary);

		const sd: StackerProposalData | undefined = proposal.stackerData;
		let votesFor = summary.summary.find((o: any) => o._id.event === 'pool-vote' && o._id.for);
		if (!votesFor) votesFor = { count: 0, total: 0 };
		let votesAgn = summary.summary.find((o: any) => o._id.event === 'pool-vote' && !o._id.for);
		if (!votesAgn) votesAgn = { count: 0, total: 0 };
		if (sd && sd.reportedResults) {
			summary.uniquePoolVoters = sd.reportedResults.poolAddresses;
			summary.uniqueSoloVoters = sd.reportedResults.soloAddresses;
			votesFor.count = sd.reportedResults.poolAddresses;
			votesFor.total = fmtStxMicro(sd.reportedResults.poolFor || 0);
			votesAgn.total = fmtStxMicro(sd.reportedResults.poolAgainst || 0);
		}
		let stxFor = votesFor?.count || 0;
		let stxAgainst = votesAgn?.count || 0;
		let stxPower = stxFor + stxAgainst;

		votesFor = summary.summary.find((o: any) => o._id.event === 'solo-vote' && o._id.for);
		if (!votesFor) votesFor = { count: 0, total: 0 };
		votesAgn = summary.summary.find((o: any) => o._id.event === 'solo-vote' && !o._id.for);
		if (!votesAgn) votesAgn = { count: 0, total: 0 };
		if (soloVoting && sd && sd.reportedResults) {
			votesFor.count = sd.reportedResults.soloAddresses;
			votesFor.total = fmtStxMicro(sd.reportedResults.soloFor || 0);
			votesAgn.total = fmtStxMicro(sd.reportedResults.soloAgainst || 0);
		}
		stxFor = votesFor?.count || 0;
		stxAgainst = votesAgn?.count || 0;
		stxPower += stxFor + stxAgainst;

		votesFor = daoSummary.summary.find((o: any) => o._id.event === 'vote' && o._id.for);
		votesAgn = daoSummary.summary.find((o: any) => o._id.event === 'vote' && !o._id.for);
		uniqueAccounts =
			summary.uniquePoolVoters +
			summary.uniqueSoloVoters +
			(votesFor?.count || 0) +
			(votesAgn?.count || 0);
		stxFor = daoSummary.proposalData.votesFor;
		stxAgainst = daoSummary.proposalData.votesAgainst;
		stxPower += stxFor + stxAgainst;

		//if (proposal.proposal ===  'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.edp015-sip-activation') {
		//	poolVoting = false
		//	soloVoting = false
		//	uniqueAccounts = (votesFor?.count || 0) + (votesAgn?.count || 0);
		//}

		return stxPower;
	};

	onMount(async () => {
		method = 3; //Number($page.url.searchParams.get('method')) || 3
		try {
			proposal = await getProposalLatest($page.params.slug);
			await fetchVotingInformation();
		} catch (err: any) {
			console.log(err);
			goto('/');
		}
		inited = true;
	});
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta
		name="description"
		content="Stacks Improvement Proposals - governance of the Stacks Blockchain."
	/>
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
	{#if proposal && inited && isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
		<ProposalHeader {proposal} />
		<div class="flex flex-col w-full my-8">
			<div
				class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative"
			>
				<div class="flex flex-col items-stretch justify-items-stretch">
					<div>
						<div class="mb-3 max-w-md">
							{#if blockSinceEnd() > 0}
								<h2 class="text-[#131416] text-2xl mb-3">Voting over</h2>
								<p>Voting closed at block {fmtNumber(proposal.proposalData.burnEndHeight || 0)}</p>
								<p>
									Voting was over cycles {cycle1}
									{#if cycle2 !== cycle1}
										and {cycle2}{/if}
								</p>
							{:else}
								<h2 class="text-[#131416] text-2xl mb-3">Voting in progress</h2>
								<p>Voting closes at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
							{/if}
							<p>
								Transactions between/including {fmtNumber(
									proposal.stackerData?.heights?.burnStart || proposal.proposalData.burnStartHeight
								)} and {fmtNumber(
									proposal.stackerData?.heights?.burnEnd || proposal.proposalData.burnEndHeight
								)} will be counted
							</p>
						</div>
						<div
							class="grid lg:grid-cols-5 grid-cols-5 border-b border-gray-1000 py-2 w-full justify-between my-0 text-md"
						>
							<div class="grow col-span-5">
								<span class="underline">{proposal.proposalMeta.title}</span>
							</div>
							<div class="grow col-span-5">
								stacker votes:
								<a
									href="/"
									on:click|preventDefault={() => readStackerVotes()}
									class="text-blue-500 hover:underline mx-2">read</a
								>
								<a
									href="/"
									on:click|preventDefault={() => reconcileStackerVotes()}
									class="text-blue-500 hover:underline mx-2">recon</a
								>
							</div>
							{#if !proposal.stackerData?.nodao}
								<div class="grow col-span-5">
									non-stacker votes: <a
										href="/"
										on:click|preventDefault={() => readNonStackerVotes()}
										class="text-blue-500 hover:underline">read</a
									>
								</div>
							{/if}
						</div>
					</div>
					<div class="mb-3 max-w-md">
						{#if votes}
							<h2 class="text-[#131416] text-2xl mb-3">Stacker voting</h2>
							<p>
								Stacks tx votes: <a
									href="/"
									on:click|preventDefault={() => (toggleStacks = !toggleStacks)}
									>{votes.votesStacks.length}</a
								>
							</p>
							<p>
								Bitcoin tx votes: <a
									href="/"
									on:click|preventDefault={() => (toggleBitcoin = !toggleBitcoin)}
									>{votes.votesBitcoin.length}</a
								>
							</p>
						{/if}
					</div>
				</div>
				<NakamotoBackground />
				<NakamotoShield />
			</div>

			{#if votes && votes.votesBitcoin && toggleBitcoin}
				{#each votes.votesBitcoin as vote}
					<div
						class="grid lg:grid-cols-6 grid-cols-6 border-b border-gray-1000 py-2 w-full justify-between my-0 text-md"
					>
						<div class="grow col-span-2">
							<span class="underline"
								><a href={explorerTxUrl(vote.submitTxId)} class="text-blue-500 hover:underline"
									>{vote.voter}</a
								></span
							>
						</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">{vote.amount}</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">{vote.event}</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">{vote.burnBlockHeight}</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">
							<a
								href="/"
								on:click|preventDefault={() => doVoteAmountBitcoin(vote.voter)}
								class="text-blue-500 hover:underline">delegation</a
							>
						</div>
					</div>
				{/each}
			{/if}
			{#if votes && votes.votesStacks && toggleStacks}
				{#each votes.votesStacks as vote}
					<div
						class="grid lg:grid-cols-6 grid-cols-6 border-b border-gray-1000 py-2 w-full justify-between my-0 text-md"
					>
						<div class="grow col-span-2">
							<span class="underline"
								><a href={explorerTxUrl(vote.submitTxId)} class="text-blue-500 hover:underline"
									>{vote.voter}</a
								></span
							>
						</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">{vote.amount}</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">{vote.event}</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">{vote.burnBlockHeight}</div>
						<div class="inline-flex whitespace-nowrap flex-shrink">
							<a
								href="/"
								on:click|preventDefault={() => doVoteAmountStacks(vote.voter)}
								class="text-blue-500 hover:underline">delegation</a
							>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
