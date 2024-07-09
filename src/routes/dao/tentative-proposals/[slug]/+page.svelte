<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Holding from '$lib/components/all-voters/Holding.svelte';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import { getCurrentProposalLink, getTentativeProposal, isCoordinator } from '$lib/proposals';
	import { daoStore } from '$stores/stores_dao';
	import { type TentativeProposal } from '@mijoco/stx_helpers/dist/index';
	import { Placeholder } from '@mijoco/stx_components';
	import ProposalStageCustom from '$lib/components/all-voters/ProposalStageCustom.svelte';

	let contractId:string;
	let proposal:TentativeProposal|undefined;
	let proposalNotFound = false;
	let inited = false;

	onMount(async () => {

		contractId = $page.params.slug;

		proposal = await getTentativeProposal(contractId)
		inited = true;
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
	{#if proposal}

		<ProposalStageCustom message={'Upcoming proposals'} />
		
		<div class="flex w-full my-8 bg-[#F4F3F0] rounded-2xl">
			<div class="flex flex-col py-10 px-10 gap-y-5">
				{#if proposalNotFound}
				<Holding />
				{:else}
				<h1 class="text-2xl">{@html proposal.proposalMeta.title}</h1>
				<p>Expected start/end: {proposal.expectedStart} /  {proposal.expectedEnd}</p>
				<p>{@html proposal.proposalMeta.synopsis}</p>
				<p>{@html proposal.proposalMeta.description}</p>
				{/if}
			</div>
			<div class="flex flex-col py-10 px-10 ">
				<NakamotoBackground />
				<NakamotoShield />
			</div>
		</div>
	{:else}
		{#if proposal}
		<Placeholder message={'Vote info loading'} link={getCurrentProposalLink()}/>
		{:else}
		Proposal not found.
		{/if}
	{/if}
</div>