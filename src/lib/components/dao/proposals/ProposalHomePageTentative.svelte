<script lang="ts">
	import BullsEye from "$lib/assets/home/BullsEye.svelte";
	import LinkInChainIcon from "$lib/assets/home/LinkInChainIcon.svelte";
	import Countdown from "$lib/ui/Countdown.svelte";
	import { fmtNumber } from "$lib/utils";
	import { sessionStore } from "$stores/stores";
	import type { HeaderItem, TentativeProposal } from "@mijoco/stx_helpers/dist/index";

	export let prop:TentativeProposal;
	export let infoItems:Array<HeaderItem>;
	let currentBurnHeight:number = $sessionStore.stacksInfo.burn_block_height;

	const getLink = () => {
		return '/dao/proposals/' + prop.tag + '/tentative'
	}
</script>

<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
	<!-- <NakamotoRelease/> --> 
	<div class="mt-4 sm:mt-0 relative z-[1]">
		<div class="mb-4">
			<h2 class="text-[#131416] text-xl mb-3"><a href={getLink()} >{@html prop.proposalMeta.title} <LinkInChainIcon /></a></h2>
			<p class="text-lg text-[#605D5D]">{@html prop.proposalMeta.description.split('<br/>')[0]}</p>
		</div>

		<div class="flex flex-col gap-y-2 justify-items-center">
			<div class="text-sm text-center">Bitcoin voting window: {fmtNumber(prop.expectedStart)} until {fmtNumber(prop.expectedEnd)}</div>
			<div class="text-sm text-center">Tentative start: <Countdown scaleFactor={1} endBlock={prop.expectedStart - currentBurnHeight} /></div>
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
