<script lang="ts">
	import { goto } from "$app/navigation";
	import BullsEye from "$lib/assets/home/BullsEye.svelte";
	import LinkInChainIcon from "$lib/assets/home/LinkInChainIcon.svelte";
	import { concludeVote } from "$lib/dao_actions";
	import { isConclusionPending, isCoordinator, isProposedPreVoting, isVoting } from "$lib/proposals";
	import Countdown from "$lib/ui/Countdown.svelte";
	import { fmtNumber } from "$lib/utils";
	import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import type { HeaderItem, VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import { onMount } from "svelte";
	import { ArrowDownCircle, Icon } from "svelte-hero-icons";


	export let prop:VotingEventProposeProposal;
	export let infoItems:Array<HeaderItem>;
	let currentBurnHeight:number = $sessionStore.stacksInfo.burn_block_height;

	const conclude = async() => {
		const result = await concludeVote(prop.votingContract, prop.proposal)
	}

	const getLink = () => {
		return `/dao/proposals/${prop.proposal}`
	}

	const getAdminLink = () => {
		return `/dao/proposals/${prop.proposal}/tally`
	}

	onMount(async () => {
	})

</script>

<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
	<!-- <NakamotoRelease/> --> 
	<div class="mt-4 sm:mt-0 relative z-[1]">
		<div class="mb-4">
			<h2 class="text-[#131416] text-xl mb-3"><a href={getLink()} >{@html prop.proposalMeta.title} <LinkInChainIcon /></a> 
				{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}<a href={getAdminLink()} > <Icon class="inline" src={ArrowDownCircle} width={35} height={35} /></a>{/if}
			</h2>
			<p class="text-lg text-[#605D5D]">{@html prop.proposalMeta.description.split('<br/>')[0]}</p>
		</div>

		<div class="flex flex-col gap-y-2 justify-items-center">
			<div class="text-sm text-center">Bitcoin voting window: {fmtNumber(prop.proposalData.burnStartHeight)} until {fmtNumber(prop.proposalData.burnEndHeight)}</div>
			{#if isProposedPreVoting(prop)}<div class="text-sm text-center">Starts: <Countdown scaleFactor={1} endBlock={prop.proposalData.burnStartHeight - currentBurnHeight} /></div>
			{:else if isVoting(prop)}
			<div class="w-full flex justify-center gap-x-5">
				<div class="">
					<button on:click={() => {goto('/dao/proposals/' + prop.proposal + '?method=2')}} class="space-y-3  text-sm font-mono uppercase block w-auto px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
						Voting for Stackers
					</button>
				</div>
				<div class="">
					<button on:click={() => {goto('/dao/proposals/' + prop.proposal + '?method=3')}} class="space-y-3  text-sm font-mono uppercase block w-auto px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
						Voting for Non Stackers
					</button>
				</div>			
			</div>
			<div class="text-sm text-center">
				Voting ends: <Countdown scaleFactor={1} endBlock={prop.proposalData.burnEndHeight - currentBurnHeight} />
			</div>
			{:else if isConclusionPending(prop)}<div class="my-3 text-sm">Voting is closed - please call <a href="/" class="text-bloodorange" on:click|preventDefault={() => conclude()}>conclude</a> to wrap up the voting.</div>
			{/if}
		</div>

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
