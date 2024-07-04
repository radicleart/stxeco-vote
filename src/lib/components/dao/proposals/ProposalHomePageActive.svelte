<script lang="ts">
	import BullsEye from "$lib/assets/home/BullsEye.svelte";
	import LinkInChainIcon from "$lib/assets/home/LinkInChainIcon.svelte";
	import { concludeVote } from "$lib/dao_actions";
	import { isConclusionPending } from "$lib/proposals";
	import { fmtNumber } from "$lib/utils";
	import { sessionStore } from "$stores/stores";
	import type { HeaderItem, VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";

	export let prop:VotingEventProposeProposal;
	export let infoItems:Array<HeaderItem>;

	const conclude = async() => {
		const result = await concludeVote(prop.votingContract, prop.proposal)
	}

	let burnHeight = $sessionStore.stacksInfo.burn_block_height

	const getLink = () => {
		return '/dao/proposals/' + prop.proposal
	}
</script>

<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
	<!-- <NakamotoRelease/> --> 
	<div class="mt-4 sm:mt-0 relative z-[1]">
		<div class="mb-4">
			<h2 class="text-[#131416] text-xl mb-3"><a href={getLink()} >{prop.proposalMeta.title} <LinkInChainIcon /></a></h2>
			<p class="text-lg text-[#605D5D]">{prop.proposalMeta.description}</p>
		</div>

		<div class="flex justify-around">
			<div class="my-3 text-sm">Bitcoin voting window: {fmtNumber(prop.proposalData.burnStartHeight)} until {fmtNumber(prop.proposalData.burnEndHeight)}</div>
		</div>
		{#if isConclusionPending(prop)}
		<div class="flex justify-around">
			<div class="my-3 text-sm">Voting is closed - please call <a href="/" class="text-bloodorange" on:click|preventDefault={() => conclude()}>conclude</a> to wrap up the voting.</div>
		</div>
		{/if}

		{#if infoItems && infoItems.length > 0}
		<div class="pt-4">
			<h2 class="text-xl mb-3 text-[#131416]">Learn more</h2>
			<ul class="list-disc pl-4 text-[#605D5D]">
				{#each infoItems as item}
				<li><a class="underline" href={item.href} target={item.target}>{item.display}</a></li>
				{/each}
			</ul>
		</div>
		{/if}
	</div>
	<BullsEye />
</div>
