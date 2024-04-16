<script lang="ts">
	import { goto } from '$app/navigation';
	import ArrowUpRight from '$lib/components/shared/ArrowUpRight.svelte';
	import { explorerAddressUrl, fmtNumber, fmtNumberStacksFloor, getAddressFromHashBytes, truncate } from '$lib/utils';
	import type { PoolStackerEvent } from '$types/pox_types';
	import { onMount } from 'svelte';

    export let event:any;

	onMount(async () => {
		console.log(event)
	})

</script>
<div class="w-full py-2 flex justify-start mb-2 text-xs text-bloodorange">
{#if event.event === 'stack-stx'}
		{fmtNumberStacksFloor(event.data.lockAmount)} locked at {fmtNumber(event.data.startBurnHeight)}
		until {fmtNumber(event.data.unlockBurnHeight)} ({event.data.lockPeriod} cycles)
		to {getAddressFromHashBytes(event.data.poxAddr.hashBytes, event.data.poxAddr.version)}.
{:else if event.event === 'stack-extend'}
		Extended for {event.data.extendCount} cycles
		until {fmtNumber(event.data.unlockBurnHeight)} 
		to {getAddressFromHashBytes(event.data.poxAddr.hashBytes, event.data.poxAddr.version)}.
{:else if event.event === 'delegate-stack-stx'}
	Del: {event.data.delegator} locked {fmtNumberStacksFloor(event.data.lockAmount)} at {fmtNumber(event.data.startBurnHeight)}
	until {fmtNumber(event.data.unlockBurnHeight)} 
	({event.data.lockPeriod} cycles)
	to {getAddressFromHashBytes(event.data.poxAddr.hashBytes, event.data.poxAddr.version)}.
{:else if event.event === 'delegate-stx'}
	Delegated {fmtNumberStacksFloor(event.data.amountUstx)} to {event.data.delegator} 
	until {fmtNumber(event.data.unlockBurnHeight)} {#if (event.data.unlockBurnHeight === 0)}indefinitely{/if}
	{#if event.data.poxAddr?.hashBytes} with reward addr {getAddressFromHashBytes(event.data.poxAddr.hashBytes, event.data.poxAddr.version)}.{/if}
	{:else if event.event === 'stack-aggregation-commit-indexed'}
	Aggregated {fmtNumberStacksFloor(event.data.amountUstx)} by {event.data.delegator} 
	for {event.data.rewardCycle}
	{#if event.data.poxAddr?.hashBytes} with reward addr {getAddressFromHashBytes(event.data.poxAddr.hashBytes, event.data.poxAddr.version)}.{/if}
{:else if event.event === 'revoke-delegate-stx'}
	Stacker revoked delegation

{/if}
</div>
