<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from 'flowbite-svelte';
	import { sessionStore } from '$stores/stores';
	import { page } from '$app/stores';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';
	import ChainUtils from '$lib/service/ChainUtils';
	import SoloVotingActive from '$lib/components/all-voters/solo/SoloVotingActive.svelte';
	import PoolVotingActive from '$lib/components/all-voters/pool/PoolVotingActive.svelte';
	import DaoVotingActive from '$lib/components/all-voters/dao-voting/DaoVotingActive.svelte';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import Holding from '$lib/components/all-voters/Holding.svelte';
	import DaoConcluded from '$lib/components/all-voters/dao-voting/DaoConcluded.svelte';
	import { getCurrentProposalLink, getProposalLatest, getTentativeProposal, isConclusionPending, isCoordinator, isFunding, isProposedPreVoting, isVoting } from '$lib/proposals';
	import { type TentativeProposal, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { Placeholder } from '@mijoco/stx_components';
	import { concludeVote } from '$lib/dao_actions';
	import Preamble from '$lib/components/all-voters/Preamble.svelte';
	import ProposalStageCustom from '$lib/components/all-voters/ProposalStageCustom.svelte';

	let proposal:TentativeProposal|undefined;

	onMount(async () => {
		proposal = await getTentativeProposal($page.params.slug)
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">

	{#if proposal}
	<ProposalStageCustom message={'Voting starts soon'}/>

	<Preamble proposalMeta={proposal.proposalMeta} votingContract={proposal.votingContract} submissionContract={undefined} contractId={proposal.tag} />

	{:else}
	<Placeholder message={'Vote info loading'} link={getCurrentProposalLink($page.params.slug)}/>
	{/if}
</div>