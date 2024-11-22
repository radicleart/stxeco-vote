<script lang="ts">
	import { page } from '$app/stores';
	import ProposalStageCustom from '$lib/components/all-voters/ProposalStageCustom.svelte';
	import ProposalHomePageActive from '$lib/components/dao/proposals/ProposalHomePageActive.svelte';
	import ProposalHomePageEmptyItem from '$lib/components/dao/proposals/ProposalHomePageEmptyItem.svelte';
	import ProposalHomePageInactive from '$lib/components/dao/proposals/ProposalHomePageInactive.svelte';
	import ProposalHomePageListItem from '$lib/components/dao/proposals/ProposalHomePageListItem.svelte';
	import ProposalHomePageTentative from '$lib/components/dao/proposals/ProposalHomePageTentative.svelte';
	import TentativeProposalHeader from '$lib/components/dao/proposals/rows/TentativeProposalHeader.svelte';
	import {
		getActiveProposals,
		getConcludedProposals,
		getTentativeProposals,
		isCoordinator
	} from '$lib/proposals';
	import PageIntro from '$lib/ui/PageIntro.svelte';
	import { getConfig } from '$stores/store_helpers';
	import { sessionStore } from '$stores/stores';
	import type {
		TentativeProposal,
		VotingEventProposeProposal
	} from '@mijoco/stx_helpers/dist/index';
	import { onMount } from 'svelte';
	import { Icon, MinusCircle, PlusCircle } from 'svelte-hero-icons';

	let message =
		'STX ECO is the all-in-one voting platform where the Stacks community can weigh in on major protocol changes';
	let listingsMessages = ['stacks improvement proposals', 'all proposals'];
	let showAllProposals = false;
	let tentativeProposals: Array<TentativeProposal>;
	let listingsMessage = listingsMessages[0];
	let componentKey = 0;
	let showInactiveProposals = true;
	let coordinator = false;

	let activeProposals: Array<VotingEventProposeProposal>;
	let inactiveProposals: Array<VotingEventProposeProposal>;

	const toggleListings = async () => {
		if ($page.url.hostname.indexOf('localhost') === -1) return;
		showAllProposals = !showAllProposals;
		listingsMessage = showAllProposals ? listingsMessages[1] : listingsMessages[0];
		componentKey++;
	};

	onMount(async () => {
		const proposals: Array<VotingEventProposeProposal> = await getActiveProposals();
		tentativeProposals = await getTentativeProposals();
		if (tentativeProposals) tentativeProposals = tentativeProposals.filter((o) => o.visible);
		inactiveProposals = await getConcludedProposals();
		if (inactiveProposals)
			inactiveProposals = inactiveProposals.filter((o) => !o.stackerData?.removed);
		inactiveProposals = inactiveProposals.reverse();
		if (proposals) {
			//activeProposals = activeProposals.filter((o) => !o.stackerData?.removed);
			activeProposals = proposals.filter((o) => !o.proposalData.concluded);
			activeProposals = activeProposals.filter((o) => !o.stackerData?.removed);
		}
		coordinator = isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress);
	});
</script>

<svelte:head>
	<title>Ecosystem DAO - Nakamoto SIP Voting</title>
	<meta
		name="description"
		content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin"
	/>
</svelte:head>

<PageIntro {message} />

<div class="py-4 mx-auto max-w-7xl md:px-6">
	<div class="flex flex-col w-full my-8">
		<div>
			<div class="space-y-6">
				<ProposalStageCustom
					message={listingsMessage}
					on:toggle_proposal_listings={toggleListings}
				/>

				{#key componentKey}
					{#if tentativeProposals && tentativeProposals.length > 0}
						<div>
							<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 mt-6">
								<a
									href="/"
									on:click|preventDefault={() => {}}
									class="py-2 px-4 rounded-md"
									target="_blank"
								>
									Upcoming proposals
								</a>
							</h1>
						</div>
						{#each tentativeProposals as prop}
							<ProposalHomePageTentative {prop} infoItems={[]} />
						{/each}
						{#if !tentativeProposals || tentativeProposals.length === 0}
							<ProposalHomePageEmptyItem propType={'upcoming'} />
						{/if}
					{/if}

					<div>
						<!--
					<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 mt-6">
						<a href="/" on:click|preventDefault={() => {}} class="py-2 px-4 rounded-md" target="_blank">
							Active proposals
						</a>
					</h1>
					-->
					</div>
					{#if activeProposals && activeProposals.length > 0}
						{#each activeProposals as prop}
							{#if showAllProposals || (prop.stackerData && prop.stackerData.sip)}
								<ProposalHomePageActive {prop} infoItems={[]} />
							{/if}
						{/each}
					{/if}
					{#if !activeProposals || activeProposals.length === 0}
						<ProposalHomePageEmptyItem propType={'active'} />
					{/if}

					<div>
						<!--
					<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4 mt-6">
						<a href="/" on:click|preventDefault={() => {}} class="py-2 px-4 rounded-md" target="_blank">
							Past proposals 
							<a href="/" class="text-bitcoinorange" on:click={() => showInactiveProposals = !showInactiveProposals}>{#if showInactiveProposals}<Icon class="inline-block" src={MinusCircle} width={30} height={30}/>{:else}<Icon class="inline-block" src={PlusCircle} width={30} height={30}/>{/if}</a>
						</a>
					</h1>
					-->
					</div>
					{#if showInactiveProposals && inactiveProposals && inactiveProposals.length > 0}
						{#each inactiveProposals as proposal}
							{#if (proposal.stackerData && proposal.stackerData.sip) || showAllProposals}
								<ProposalHomePageInactive {proposal} />
							{/if}
						{/each}
						{#if !inactiveProposals || inactiveProposals.length === 0}
							<ProposalHomePageEmptyItem propType={'inactive'} />
						{/if}
					{/if}
				{/key}
			</div>

			<!--
			<div class="space-y-6 mt-24">
				<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-6">Cast your vote</h2>
				<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
					{#each votingOptions as opt}
						<a href={`/dao/proposals/?method=${opt.method}`} class="group flex flex-col overflow-hidden border border-transparent hover:border-[#FC6432] rounded-lg relative bg-[#E6E4E2] px-6 py-6 transition duration-300 ease-in-out">

							<VotingOptionBackground />

							<div class="flex flex-col h-full relative z-[1]">
								<div class="flex-1">
									{@html opt.icon}
									<h4 class="text-lg mt-12 text-[#131416] mb-3">{opt.title}</h4>
								</div>
								<p class="mt-auto text-[#131416]/[0.64]">{opt.explanation}</p>
							</div>

							<div class="mt-3 text-center sm:hidden w-full text-sm font-mono uppercase inline-block bg-bloodorange px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
								Vote now
							</div>
						</a>
					{/each}
				</div>
			</div>
			-->
		</div>
	</div>
</div>
