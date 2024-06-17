<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { sessionStore } from "$stores/stores";
	import { getConfig } from "$stores/store_helpers";
	import { getPoxInfoByStacker, getRewardSlotsByCycle } from "$lib/pox_api";
	import type { PoxInfo, RewardSlot } from "$types/pox_types";

	const dispatch = createEventDispatcher();

	export let poxInfo:PoxInfo;

	let stxAddress:string = $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress;
	let rewardSlots:Array<RewardSlot>;
	let cycle = poxInfo.reward_cycle_id;

    const fetchPage = async () => {
		if (!stxAddress) return;
    	rewardSlots = await getRewardSlotsByCycle(cycle)
    }

	onMount(async () => {
    	rewardSlots = await getRewardSlotsByCycle(cycle)
  	})

</script>

<div class=" py-3 space-y-2">
	<p class="text-lg text-[#131416]/[0.64]">Reward slots by cycle</p>
</div>
<div class="flex gap-x-2">
	<label for ="reward-cycle" class="text-sand-500">Cycle</label>
	<input type="number" id="reward-cycle" class="w-1/2 p-3 rounded-sm border-none text-black" bind:value={cycle}/>

	<button on:click={() => {fetchPage()}} class="w-[150px] text-white justify-start items-start gap-x-1.5 bg-black px-4 py-2 rounded-xl border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
	  Continue
	</button>
</div>
{#if rewardSlots}
	{#each rewardSlots as rs }
	<div class="flex flex-col gap-y-2">
		<div class="flex"><div class="w-1/5 text-[#131416]/[0.64]">Address: </div><div class="w-4/5">{rs.address}</div></div>
		<div class="flex"><div class="w-1/5 text-[#131416]/[0.64]">Height / slot: </div><div class="w-4/5">{rs.burn_block_height} / {rs.slot_index}</div></div>
	</div>
	{/each}
{/if}
