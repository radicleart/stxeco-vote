<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { sbtcConfig } from "$stores/stores";
	import { CONFIG } from "$lib/config";
	import { getPoxInfoForPoolStacker, getPoxInfoForSoloStacker } from "$lib/pox_api";
	import type { PoxInfo } from "$types/pox_types";
	import JSONTree from 'svelte-json-tree'

	const dispatch = createEventDispatcher();

	export let poxInfo:PoxInfo;

	let stxAddress:string = $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress;
	let btcAddress:string = $sbtcConfig.keySets[CONFIG.VITE_NETWORK].cardinal;
	let soloInfo:any;
	let poolInfo:any;

    const processAddress = async () => {
		if (!stxAddress) return;
      	poolInfo = await getPoxInfoForPoolStacker(stxAddress, poxInfo.current_cycle.id)
      	if (!btcAddress) return;
      	soloInfo = await getPoxInfoForSoloStacker(btcAddress, poxInfo.current_cycle.id, stxAddress)
    }

    const back = async () => {
		dispatch('back')
    }

</script>

<div class=" py-3 space-y-2">
	<p class="text-lg text-[#131416]/[0.64]">Enter stacks or bitcoin address that is either stacking/delegating or a reward slot owner</p>
</div>
<div class="flex flex-col gap-y-2">
	<label for ="stacks-address" class="text-sand-500">PoX information relating to stacks address</label>
	<input type="text" id="stacks-address" placeholder="stacks address is required" class="p-3 rounded-sm border-none text-black" bind:value={stxAddress}/>

	<label for ="bitcoin-address" class="text-sand-500">PoX information relating to bitcoin address</label>
	<input type="text" id="bitcoin-address" placeholder="bitcoin address is not required" class="p-3 rounded-sm border-none text-black" bind:value={btcAddress}/>

	<button on:click={() => {processAddress()}} class="w-[150px] text-white justify-start items-start gap-x-1.5 bg-black px-4 py-2 rounded-xl border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
	  Process
	</button>
</div>
{#if poolInfo}
<div class="flex flex-col gap-y-2">
	<JSONTree value={poolInfo} />
</div>
{/if}
{#if soloInfo}
<div class="flex flex-col gap-y-2">
	<JSONTree value={soloInfo} />
</div>
{/if}
