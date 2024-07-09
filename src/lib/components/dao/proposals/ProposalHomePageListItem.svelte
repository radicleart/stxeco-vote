<script lang="ts">
	import BullsEye from "$lib/assets/home/BullsEye.svelte";
	import LinkInChainIcon from "$lib/assets/home/LinkInChainIcon.svelte";
	import type { HeaderItem } from "@mijoco/stx_helpers/dist/index";

	export let propType:string;
	export let title:string;
	export let contractId:string;
	export let description:string;
	export let infoItems:Array<HeaderItem>;

	const getLink = () => {
		if (propType === 'active') {
			return `/dao/proposals/${contractId}`
		} else if (propType === 'tentative') {
			return `/dao/tentative-proposals/${contractId}`
		} else {
			return `/dao/proposals/${contractId}/results`
		}
	}
</script>

<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
	<!-- <NakamotoRelease/> --> 
	<div class="mt-4 sm:mt-0 relative z-[1]">
		<div class="mb-4">
			<h2 class="text-[#131416] text-xl mb-3"><a href={getLink()} >{@html title} <LinkInChainIcon /></a></h2>
			<p class="text-lg text-[#605D5D]">{@html description}</p>
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
