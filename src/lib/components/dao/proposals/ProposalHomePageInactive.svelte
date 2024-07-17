<script lang="ts">
	import BullsEye from "$lib/assets/home/BullsEye.svelte";
	import LinkInChainIcon from "$lib/assets/home/LinkInChainIcon.svelte";
	import DaoResults from "$lib/components/all-voters/dao-voting/DaoResults.svelte";
	import VoteResultsExecSummary from "$lib/components/all-voters/VoteResultsExecSummary.svelte";
	import { isCoordinator } from "$lib/proposals";
	import { getDaoSummary } from "$lib/voting-non-stacker";
	import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import type { VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import { onMount } from "svelte";
	import { ArrowDownCircle, Icon } from "svelte-hero-icons";

	export let proposal:VotingEventProposeProposal;

	const getLink = () => {
		return `/dao/proposals/${proposal.proposal}/results`
	}

	const getAdminLink = () => {
		return `/dao/proposals/${proposal.proposal}/tally`
	}

	onMount(async () => {
	})

</script>

<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
	<!-- <NakamotoRelease/> --> 
	<div class="mt-4 sm:mt-0 relative z-[1]">
		<div class="mb-4">
			<h2 class="text-[#131416] text-3xl mb-3"><a href={getLink()} >{@html proposal.proposalMeta.title} <LinkInChainIcon /></a>
				{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}<a href={getAdminLink()} > <Icon class="inline" src={ArrowDownCircle} width={35} height={35} /></a>{/if}
			</h2>
			<p class="text-lg text-[#605D5D]">{@html proposal.proposalMeta.synopsis.replaceAll(';;', '')}</p>
		</div>
		{#if proposal.links && proposal.links.length > 0}
		<div class="pt-4 mb-8">
			<ul class="list-disc pl-4 text-[#605D5D]">
				{#each proposal.links as item}
				<li><a class="underline" href={item.href} target={item.target}>{item.display}</a></li>
				{/each}
			</ul>
		</div>
		{/if}

		{#if proposal}
		<VoteResultsExecSummary {proposal} />
		{/if}
	</div>
	<BullsEye />
</div>
