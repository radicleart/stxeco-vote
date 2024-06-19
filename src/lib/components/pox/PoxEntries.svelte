<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { sessionStore } from "$stores/stores";
	import { getConfig } from "$stores/store_helpers";
	import { getPoxEntriesByCycle } from "$lib/pox_api";
	import type { PoxEntry, PoxInfo, RewardSlot } from "$types/pox_types";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";

	const dispatch = createEventDispatcher();

	export let poxInfo:PoxInfo;

	let stxAddress:string = $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress;
	let poxEntries:Array<PoxEntry>;
	let cycle = poxInfo.reward_cycle_id;

	const stackerInfo = (entry:PoxEntry) => {
		dispatch('/stacker-info', { entry })
	}

    const fetchPage = async () => {
		if (!stxAddress) return;
    	poxEntries = await getPoxEntriesByCycle(cycle)
    }

	onMount(async () => {
    	poxEntries = await getPoxEntriesByCycle(cycle)
		console.log(poxEntries.length)
  	})

</script>

<div class=" py-3 space-y-2">
	<p class="text-lg text-[#131416]/[0.64]">PoX entries by cycle</p>
</div>
<div class="flex gap-x-2">
	<input type="number" id="reward-cycle" class="w-1/2 p-3 rounded-sm border-none text-black" bind:value={cycle}/>

	<button on:click={() => {fetchPage()}} class="w-[150px] text-white justify-start items-start gap-x-1.5 bg-black px-4 py-2 rounded-xl border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
	  Continue
	</button>
</div>
{#if poxEntries}
	{#each poxEntries as rs }
	<div class="flex flex-col gap-y-2">
		<div class="flex"><div class="w-1/5 text-[#131416]/[0.64]">Slot {rs.index}: </div><div class="text-bloodorange w-4/5">{rs.bitcoinAddr}</div></div>
		<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 "></div><div class="w-4/5"><a href="/" on:click|preventDefault={() => stackerInfo(rs)}>{rs.stacker}</a></div></div>
		<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 "></div><div class="w-4/5">{fmtNumber(Number(fmtMicroToStx(rs.totalUstx)))}</div></div>
	</div>
	{/each}
{/if}
