<script lang="ts">
	import { getRewardSlots } from "$lib/pox_api";
	import DaoUtils from "$lib/service/DaoUtils";
	import type { AddressRewardSlot } from "$types/pox_types";
	import { onMount } from "svelte";

	export let rewardSlots: Array<AddressRewardSlot> = []
	export let address: string;
	let additionalRewardSlots: Array<AddressRewardSlot> = []
	let page = 0;
	let limit = 30;
	let componentKey = 0;
	let sortDir = '';
	let sortField = 'voter';

	const reorder = (sf:string) => {
		sortField = sf;
		sortDir = (sortDir === '-') ? '' : '-';
		componentKey++;
	}

	const fetchMore = async () => {
		page++
		additionalRewardSlots = additionalRewardSlots.concat(await getRewardSlots(page*limit, limit, address));
	}

	onMount(async () => {
		additionalRewardSlots = rewardSlots
	})

	$: sortedEvents = additionalRewardSlots.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

<div class=" text-xs grid grid-cols-4 md:grid-cols-6 w-full justify-evenly mt-5  border-b border-gray-300 pb-3 mb-3">
	<div>Index</div>
	<div><a href="/" class="pointer" on:click|preventDefault={() => reorder('burn_block_height')}>Height</a></div>
    <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('burn_amount')}>Burnt</a></div>
	<div><a href="/" class="pointer" on:click|preventDefault={() => reorder('reward_amount')}>Reward (sats)</a></div>
	<div class="col-span-2">Recipient</div>
</div>
{#if sortedEvents.length > 0}
{#each sortedEvents as item, index}
<div class="text-xs grid grid-cols-4 md:grid-cols-6 w-full justify-evenly">
	<div>{index+1}</div>
	<div>{item.burn_block_height}</div>
  	<div>{item.burn_amount}</div>
  	<div>{item.reward_amount}</div>
  	<div class="col-span-2 md:inline-flex hidden">{item.reward_recipient}</div>
</div>
{/each}
{#if rewardSlots.length === 30}
<p class="text-right"><a class="text-xs underline" href="/" on:click|preventDefault={() => fetchMore()} >fetch more</a></p>
{/if}
{:else}
<div class="grid grid-cols-5 w-full justify-evenly">
	<div>No rewards slots registered</div>
</div>
{/if}
