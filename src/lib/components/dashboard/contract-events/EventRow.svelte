<script lang="ts">
	import { goto } from '$app/navigation';
	import ArrowUpRight from '$lib/components/shared/ArrowUpRight.svelte';
	import { explorerAddressUrl, fmtNumberStacksFloor, truncate } from '$lib/utils';
	import type { PoolStackerEvent } from '$types/pox_types';
	import { onMount } from 'svelte';
	import EventSubRow from './EventSubRow.svelte';

    export let event:PoolStackerEvent;
    export let details:boolean;

    const getReclaimUrl = () => {
        goto('/insights/events/' + event._id)
    }

	onMount(async () => {
		console.log(event)
	})

</script>

<div class="w-full grid grid-cols-3 md:grid-cols-5 my-4 text-xs font-extralight text-gray-300">
	<div class="w-[20px] md:inline-flex hidden">
		{event.eventIndex}
	</div>
	<div class="flex text-[0.6rem] justify-start">
		<div class={'px-2 py-1 ps-2 border border-yellow-500 rounded-full text-yellow-500'}>
			{event.event}
		</div>
	</div>
	<div class="break-words col-span-2 pe-3 flex">
		<div>
		<a class="" href={explorerAddressUrl(event.stacker)} target="_blank" rel="noreferrer">{truncate(event.stacker, 5)}</a>
		</div>
		<div class="text-right pt-1 ps-2">
			<ArrowUpRight
				class="h-5 w-5 text-white"
				target={explorerAddressUrl(event.stacker)}
			/>
		</div>
	</div>
	<div class="md:inline-flex hidden  max:w-1/5">{fmtNumberStacksFloor(event.balance)}</div>
	<!--
	<div class="text-end whitespace-nowrap">
		<a
			class="text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 hover:underline"
			href="/" on:click|preventDefault={() => getReclaimUrl()}>View details</a>
	</div>
	-->
</div>
{#if details}
<EventSubRow {event} />
{/if}