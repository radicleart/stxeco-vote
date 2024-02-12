<script lang="ts">
	import NakamotoResultsBackground from "../shared/NakamotoResultsBackground.svelte";
	import tick from '$lib/assets/tick.png'
	import cross from '$lib/assets/cross.png'
	import { sbtcConfig } from "$stores/stores";
	import { NAKAMOTO_VOTE_STOPS_HEIGHT } from "$lib/dao_api";

	export let approved = false;

	const blockSinceEnd = () => {
		return $sbtcConfig.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT
	}

</script>

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0 align-top ">
	<div class="p-8 stretch bg-[#121314] rounded-2xl self-start">
	  	<h3 class="text-3xl text-white font-extralight">Vote results</h3>
	</div>
	<div class="p-8 bg-primary-01 col-span-2 bg-[#F4F3F0] rounded-2xl border-error-600 relative">
		{#if approved}
		<div class="flex justify-between mb-5">
			<div><img alt="correct" src={cross}/></div>
			<div><span class="text-4xl font-extrabold">YES</span></div>
		</div>
		<div class="flex justify-between">
			<div><span class="">Proposal failed to pass</span></div>
		</div>
		{:else}
		<div class="flex justify-between mb-5">
			<div><img alt="correct" src={cross}/></div>
			<div><span class="text-4xl font-semibold">NO</span></div>
		</div>
		<div class="flex flex-col">
			<div><span class="">Proposal failed to pass</span></div>
			<div><span class="">Check below for the detailed breakdown on each voting method</span></div>
		</div>
		{/if}
		<NakamotoResultsBackground />
	</div>
</div>
