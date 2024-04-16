
<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import SignerWeightsSection from './sections/SignerWeightsSection.svelte';
	import { getRecentSigners } from '$lib/signers_api';

	let recentSigners:any;

	const openStackingFeature = () => {
		goto('/insights/events')
	}

	onMount(async () => {
		recentSigners = await getRecentSigners()
	});


</script>

<div class="h-full flex flex-col items-stretch min-h-[200px]">

	<div class="h-full text-sm flex flex-col  z-[1]">
		<div class="flex-0">
			<h4 class="text-lg mt-0 text-[#131416] mb-3">Signers and weights</h4>
			<p class="text-sm mt-0 text-[#131416] mb-3">Set by the stacks node in prepare phase</p>
		</div>

		{#if recentSigners}
		<SignerWeightsSection entry={recentSigners.current} />
		<SignerWeightsSection entry={recentSigners.previous} />
		{/if}
	</div>
	<div class="mt-3 text-center w-full text-sm font-mono uppercase items-baseline block bg-bloodorange px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
		<a href="/" on:click|preventDefault={() => openStackingFeature()}>Show more signer info</a>
	</div>
</div>
