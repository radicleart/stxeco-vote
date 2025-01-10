<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import { page } from '$app/stores';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';
	import ChainUtils from '$lib/service/ChainUtils';
	import { findPoolVotes, findSoloVotes } from '$lib/dao_api';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import HoldingResults from '$lib/components/all-voters/HoldingResults.svelte';
	import {
		getCurrentProposalLink,
		getProposalLatest,
		getProposalNotFoundLink,
		isCoordinator,
		isPostVoting,
		isVoting
	} from '$lib/proposals';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { Placeholder } from '@mijoco/stx_components';
	import { fmtNumber } from '$lib/utils';
	import VoteResults2Overview from '$lib/components/results2/VoteResults2Overview.svelte';
	import type { VoteEvent } from '@mijoco/stx_helpers/dist/dao';
	import VoteResults2 from '$lib/components/results2/VoteResults2.svelte';

	let proposal: VotingEventProposeProposal | undefined;

	let bitcoinVotes: Array<VoteEvent> = [];
	let stacksVotes: Array<VoteEvent> = [];
	let uniqueAccounts: number = 0;
	let method: number = -1;
	let errorReason: string | undefined;
	let balanceAtHeight: number = 0;
	let inited = false;

	let bSumFor: number;
	let bSumAg: number;
	let sSumFor: number;
	let sSumAg: number;

	const voteConcluded = () => {
		if (!proposal || !proposal.proposalData) return false;
		return isPostVoting(proposal);
	};

	onMount(async () => {
		method = 1; //Number($page.url.searchParams.get('method')) || 3
		proposal = await getProposalLatest($page.params.slug);
		const bitcoin = await findSoloVotes(proposal.proposal);
		const stacks = await findPoolVotes(proposal.proposal);
		bitcoinVotes = bitcoin?.soloVotes.filter((o: any) => o.amount > 0);
		stacksVotes = stacks?.poolVotes.filter((o: any) => o.amount > 0);

		uniqueAccounts = (bitcoinVotes?.length || 0) + (stacksVotes?.length || 0);
		bSumFor = bitcoinVotes.filter((o) => o.for).length;
		bSumAg = bitcoinVotes.filter((o) => !o.for).length;
		sSumFor = stacksVotes.filter((o) => o.for && o.amount > 0).length;
		sSumAg = stacksVotes.filter((o) => !o.for && o.amount > 0).length;

		if (proposal) {
			try {
				const response = await getBalanceAtHeight(
					getConfig().VITE_STACKS_API,
					$sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress,
					proposal.proposalData.startBlockHeight
				);
				balanceAtHeight = ChainUtils.fromMicroAmount(
					Number(response.stx.balance) - Number(response.stx.locked)
				);
			} catch (e: any) {
				balanceAtHeight =
					$sessionStore.keySets[getConfig().VITE_NETWORK].walletBalances?.stacks.amount || 0;
				errorReason = e.message;
			}
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
	{#if proposal && inited}
		<ProposalHeader {proposal} />
		{#if voteConcluded() || isVoting(proposal)}
			<div class="flex flex-col w-full my-8">
				<div
					class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative"
				>
					<div class="flex flex-col items-stretch justify-items-stretch">
						<div>
							{#if !isVoting(proposal)}
								<div class="mb-3 max-w-md">
									<h2 class="text-[#131416] text-2xl mb-3">Voting over</h2>
									<p>Voting closed at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
									<p>{uniqueAccounts} addresses voted</p>
									<p class="mt-5">Detailed results are displayed below</p>
								</div>
							{:else}
								<div class="mb-3 max-w-md">
									<h2 class="text-[#131416] text-2xl mb-3">Voting in progress</h2>
									<p>Voting closes at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
									<p>
										{uniqueAccounts} addresses voting with {bSumFor + bSumAg} bitcoin and {sSumFor +
											sSumAg} stacks transactions
									</p>
									<p class="mt-5">Detailed results are displayed below</p>
								</div>
							{/if}
						</div>
					</div>
					<NakamotoBackground />
					<NakamotoShield />
				</div>
			</div>

			<div id="tabs-header">
				<VoteResults2Overview {proposal} {bitcoinVotes} {stacksVotes} />
			</div>
			<div>
				<!-- {#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)} -->
				<div class="bg-lightgray py-8 px-4">
					<VoteResults2 {proposal} {bitcoinVotes} {stacksVotes} />
				</div>
				<!-- {/if} -->
			</div>
		{:else}
			<HoldingResults />
		{/if}
	{:else if !proposal}
		<Placeholder message={'Proposal could not be loaded'} link={getProposalNotFoundLink()} />
	{:else}
		<Placeholder message={'Vote info loading'} link={getCurrentProposalLink($page.params.slug)} />
	{/if}
</div>
