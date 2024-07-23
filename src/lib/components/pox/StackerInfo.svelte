<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { sessionStore } from "$stores/stores";
	import { getConfig } from "$stores/store_helpers";
	import { getPoxInfoByStacker } from "$lib/pox_api";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";
	import type { PoxEntry, PoxInfo, StackerInfo } from "@mijoco/stx_helpers/dist/index";

	const dispatch = createEventDispatcher();

	export let poxInfo:PoxInfo;
	export let poxEntry:PoxEntry|undefined;

	let stxAddress:string = $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress;
	let stackerInfo:StackerInfo;
	let cycle = poxInfo.reward_cycle_id;
	let lockPeriod:{value:number};

    const processAddress = async () => {
		if (!stxAddress) return;
		stackerInfo = await getPoxInfoByStacker(stxAddress, cycle)
    }

    const back = async () => {
		dispatch('back')
    }
	onMount(async () => {
		if (poxEntry) {
			stackerInfo = await getPoxInfoByStacker(poxEntry.stacker, poxEntry.cycle)
			stxAddress = poxEntry.stacker
			cycle = poxEntry.cycle
			lockPeriod = (stackerInfo.stacker?.lockPeriod) ? stackerInfo.stacker?.lockPeriod[0] : {value: 0}
		}
  	})

</script>

<div class=" py-3 space-y-2">
	<p class="text-lg text-[#131416]/[0.64]">Enter stacks address and stacking cycle</p>
</div>
<div class="flex flex-col gap-y-2">
	<label for ="stacks-address" class="text-sand-500">Stacks address</label>
	<input type="text" id="stacks-address" placeholder="stacks address is required" class="p-3 rounded-sm border-none text-black" bind:value={stxAddress}/>

	<label for ="reward-cycle" class="text-sand-500">PoX information relating to bitcoin address</label>
	<input type="number" id="reward-cycle" class="p-3 rounded-sm border-none text-black" bind:value={cycle}/>

	<button on:click={() => {processAddress()}} class="w-[150px] text-white justify-start items-start gap-x-1.5 bg-black px-4 py-2 rounded-xl border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
	  Lookup
	</button>
</div>
{#if stackerInfo}
<div class="flex flex-col gap-y-2">
	<div class="flex"><div class="w-1/5 text-[#131416]/[0.64]">Stacker: </div><div class="text-bloodorange w-4/5">{stackerInfo.stacksAddress}</div></div>
	{#if stackerInfo.stacker?.bitcoinAddr}
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 "></div><div class="w-4/5">{stackerInfo.stacker?.bitcoinAddr}</div></div>
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 ">First cycle</div><div class="w-4/5">{fmtNumber(stackerInfo.stacker?.firstRewardCycle)}</div></div>
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 ">Lock period</div><div class="w-4/5">{(lockPeriod) ? lockPeriod.value : 0}</div></div>
	{#if stackerInfo.stacker?.delegatedTo}
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 ">Delegation</div><div class="w-4/5">{stackerInfo.stacker?.delegatedTo}</div></div>
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 "></div><div class="w-4/5">{fmtMicroToStx(stackerInfo.delegation?.amountUstx || 0)}</div></div>
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 "></div><div class="w-4/5">{stackerInfo.delegation?.bitcoinAddr}</div></div>
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 ">until</div><div class="w-4/5">{stackerInfo.delegation?.untilBurnHt}</div></div>
	{/if}
	{:else}
	<div class="flex text-[#131416]/[0.44]"><div class="w-1/5 "></div><div class="w-4/5">Non-stacking address</div></div>
	{/if}
</div>
{/if}
