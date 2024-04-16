
<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import SignerWeightsSection from './sections/SignerWeightsSection.svelte';
	import { getRecentSigners } from '$lib/signers_api';
	import { Spinner } from 'flowbite-svelte';
	import { getSbtcTransactionCounts } from '$lib/sbtc_api';

	let sbtcTransactionCounts:any;

	const openStackingFeature = () => {
		goto('/insights/events')
	}

	onMount(async () => {
		sbtcTransactionCounts = await getSbtcTransactionCounts()
	});


</script>

<div class="h-full flex flex-col items-stretch min-h-[200px] text-yellow-500">

	<div class="h-full text-sm flex flex-col  z-[1]">
		<div class="flex-0">
			{#if sbtcTransactionCounts}
			<h4 class="text-lg mt-0 mb-3">{sbtcTransactionCounts.total} sBTC Transactions</h4>
			{/if}
		</div>

		{#if sbtcTransactionCounts}
		<div class="">
			<div class="flex justify-between">
				<div>Total deposits:</div><div class="mt-1 text-base font-bold leading-none text-transparent bg-clip-text bg-sbtc-primary-02">{sbtcTransactionCounts.deposits}</div>
			</div>
			<div class="flex justify-between">
				<div>2 phase (op_drop):</div><div class="mt-1 text-base font-bold leading-none text-transparent bg-clip-text bg-sbtc-primary-02">{sbtcTransactionCounts.depositsOpDrop}</div>
			</div>
			<div class="flex justify-between">
				<div>Single phase (op_return):</div><div class="mt-1 text-base font-bold leading-none text-transparent bg-clip-text bg-sbtc-primary-02">{sbtcTransactionCounts.depositsOpReturn}</div>
			</div>
			<div class="flex justify-between">
				<div>Total withdrawals:</div><div class="mt-1 text-base font-bold leading-none text-transparent bg-clip-text bg-sbtc-primary-02">{sbtcTransactionCounts.withdrawals}</div>
			</div>
		</div>
		{:else}
		<Spinner color="blue" class="w-5 h-5 " aria-hidden="true" />
		{/if}
	</div>
	<div class="mt-3 text-center w-full text-sm font-mono uppercase items-baseline block bg-bloodorange px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
		<a href="https://bridge.sbtc.tech/transactions" target="_blank">All transactions</a>
	</div>
</div>
