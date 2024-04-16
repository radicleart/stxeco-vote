
<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const changeFilter = (field:string|undefined) => {
		dispatch('change_filter', { filter: field });
	}

	export let filter:string|undefined;
</script>


<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-2">Proof of transfer metrics</h2>
{#if filter === 'stacking'}
<h4 class="text-danger-600 text-sm mt-1">Stacking metrics: contracts calls, amounts (uSTX) delegated etc</h4>
{:else if filter === 'signer'}
<h4 class="text-danger-600 text-sm mt-1">Signer health metrics, number of signers voting, signer delegations etc</h4>
{:else if filter === 'mining'}
<h4 class="text-danger-600 text-sm mt-1">Mining transactions, rewards and burns per cycle</h4>
{:else if filter === 'sbtc'}
<h4 class="text-danger-600 text-sm mt-1">sBTC metrics, tvl ad transaction histories</h4>
{:else}
<h4 class="text-danger-600 text-sm mt-1">Metrics related to mining, signing, stacking and the sBTC protocol</h4>
{/if}

<div class="flex justify-around gap-x-2">
	{#if filter === undefined}
	<div class="flex justify-center border bg-black text-white rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter(undefined)}>all</a></div>
	{:else}
	<div class="flex justify-center border border-lightgray rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter(undefined)}>all</a></div>
	{/if}
	{#if filter === 'signer'}
	<div class="flex justify-center border bg-bloodorange text-white rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('signer')}>signer</a></div>
	{:else}
	<div class="flex justify-center border border-bloodorange rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('signer')}>signer</a></div>
	{/if}
	{#if filter === 'sbtc'}
	<div class="flex justify-center border bg-black text-yellow-500 rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('sbtc')}>sBTC</a></div>
	{:else}
	<div class="flex justify-center border border-yellow-500 rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('sbtc')}>sBTC</a></div>
	{/if}
	{#if filter === 'stacker'}
	<div class="flex justify-center border bg-lightpurple text-white rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('stacking')}>stacking</a></div>
	{:else}
	<div class="flex justify-center border border-lightpurple rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('stacking')}>stacking</a></div>
	{/if}
	{#if filter === 'mining'}
	<div class="flex justify-center border bg-sand-500 text-white rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('mining')}>mining</a></div>
	{:else}
	<div class="flex justify-center border text-sand-500 rounded-full px-3 md:px-5 w-[150px]"><a href="/" on:click|preventDefault={() => changeFilter('mining')}>mining</a></div>
	{/if}
</div>
