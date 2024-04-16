
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fmtNumberStacksFloor, truncate } from '$lib/utils';
	import { stacksStore } from '$stores/stacksStore';
	import { onMount } from 'svelte';
	import SignerWeightsSection from './sections/SignerWeightsSection.svelte';
	import { getSignerSlots } from '$lib/signers_api';
	import SignerSlotsSection from './sections/SignerSlotsSection.svelte';
	import SignerAccumulationSection from './sections/SignerAccumulationSection.svelte';

	let signerSlots: any;

	onMount(async () => {
		signerSlots = await getSignerSlots()
	});


	const openStackingFeature = () => {
		goto('/insights/events')
	}

</script>

<div class="h-full flex flex-col items-stretch min-h-[200px]">

	<div class="h-full text-sm flex flex-col flex-0 z-[1]">
		<div class="">
			<h4 class="text-lg mt-0 text-[#131416] mb-3">Signer power</h4>
			<p class="text-sm mt-0 text-[#131416] mb-3">Accumulated over pox-4 reward cycles</p>
		</div>

		{#if signerSlots}
		<SignerAccumulationSection slots={signerSlots.page0}/>
		{/if}
	</div>

	<div class="mt-3 text-center w-full text-sm font-mono uppercase items-baseline block bg-bloodorange px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
		<a href="/" on:click|preventDefault={() => openStackingFeature()}>More signer slots</a>
	</div>
</div>
