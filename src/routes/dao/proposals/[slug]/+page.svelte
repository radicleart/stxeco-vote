<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from 'flowbite-svelte';
	import { sessionStore } from '$stores/stores';
	import { page } from '$app/stores';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';
	import { getStacksAddress } from '@mijoco/stx_helpers/dist/account';
	import ChainUtils from '$lib/service/ChainUtils';
	import SoloVotingActive from '$lib/components/all-voters/solo/SoloVotingActive.svelte';
	import PoolVotingActive from '$lib/components/all-voters/pool/PoolVotingActive.svelte';
	import DaoVotingActive from '$lib/components/all-voters/dao-voting/DaoVotingActive.svelte';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import Holding from '$lib/components/all-voters/Holding.svelte';
	import DaoConcluded from '$lib/components/all-voters/dao-voting/DaoConcluded.svelte';
	import {
		getCurrentProposalLink,
		getProposalLatest,
		isConclusionPending,
		isCoordinator,
		isFunding,
		isPostVoting,
		isProposedPreVoting,
		isVoting
	} from '$lib/proposals';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { Placeholder } from '@mijoco/stx_components';
	import { concludeVote } from '$lib/dao_actions';
	import { goto } from '$app/navigation';

	let method: number = 2;
	let errorReason: string | undefined;
	let proposal: VotingEventProposeProposal | undefined;
	let lockedBalanceAtHeight: number;
	let totalBalanceAtHeight: number;
	let balanceAtHeight: number = 0;
	let inited = false;

	const switchVotingMethod = (e: any) => {
		method = e.detail.method;
	};

	const conclude = async () => {
		if (proposal) {
			await concludeVote(proposal.votingContract, proposal.proposal);
		}
	};

	onMount(async () => {
		method = Number($page.url.searchParams.get('method')) || 2;
		proposal = await getProposalLatest($page.params.slug);

		if (!proposal) goto('/');
		if (isPostVoting(proposal)) {
			const nodao = proposal.stackerData?.nodao;
			goto(`/dao/proposals/${proposal.proposal}/${nodao ? 'results2' : 'results'}?chain=mainnet`);
		}
		try {
			// note the latter is the proposal deploy height but we'd like it to the height that corresponds to the bitcoin start height.
			const startStacksBlock =
				proposal.stackerData?.heights?.stacksStart || proposal.proposalData.startBlockHeight;
			const stxAddress = getStacksAddress(getConfig().VITE_NETWORK);
			const response = await getBalanceAtHeight(
				getConfig().VITE_STACKS_API,
				stxAddress,
				startStacksBlock
			);
			totalBalanceAtHeight = Number(response.stx?.balance || 0);
			lockedBalanceAtHeight = Number(response.stx?.locked || 0);
			balanceAtHeight = ChainUtils.fromMicroAmount(
				Number(response.stx.balance) - Number(response.stx.locked)
			);
			inited = true;
		} catch (e: any) {
			balanceAtHeight =
				$sessionStore.keySets[getConfig().VITE_NETWORK].walletBalances?.stacks.amount || 0;
			errorReason = e.message;
			inited = true;
		}
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

		{#if isVoting(proposal)}
			{#if method === 1}
				<SoloVotingActive {proposal} on:toggle_voting_method={switchVotingMethod} />
			{:else if method === 2}
				<PoolVotingActive
					{proposal}
					{totalBalanceAtHeight}
					{lockedBalanceAtHeight}
					on:toggle_voting_method={switchVotingMethod}
				/>
			{:else if method === 3}
				{#if $sessionStore.stacksInfo?.burn_block_height >= proposal.proposalData.burnStartHeight}
					<DaoVotingActive {proposal} adjustBal={balanceAtHeight} />
				{:else}
					<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
						<div
							class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative"
						>
							<Holding />
						</div>
					</div>
				{/if}
			{:else}
				<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
					<Skeleton size="md" />
				</div>
			{/if}
		{:else if isProposedPreVoting(proposal)}
			<Holding />
		{:else if isConclusionPending(proposal)}
			<div class="flex justify-around">
				{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}<div
						class="my-3 text-sm"
					>
						<a href="/" class="text-bloodorange" on:click|preventDefault={() => conclude()}
							>Voting closed - please conclude</a
						>
					</div>
				{:else}
					Voting has ended. Results will be published soon.
				{/if}
			</div>
		{:else}
			<DaoConcluded {proposal} />
		{/if}
	{:else}
		<Placeholder message={'Proposal not found'} link={getCurrentProposalLink($page.params.slug)} />
	{/if}
</div>
