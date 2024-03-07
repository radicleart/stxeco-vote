<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { sbtcConfig } from "$stores/stores";
	import { CONFIG } from "$lib/config";
	import { getPoxInfoByRewardSlot, getPoxInfoByStacker } from "$lib/pox_api";
	import type { PoxEntry, PoxInfo, StackerInfo } from "$types/pox_types";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";

	const dispatch = createEventDispatcher();

	export let stackerInfo:StackerInfo;
	export let amount:number;

	onMount(async () => {
  	})

</script>

<div class="flex flex-col gap-y-5">
{#if stackerInfo?.stacker}
	<p>{#if !stackerInfo.stacker?.rewardSetIndexes || stackerInfo.stacker?.rewardSetIndexes.length === 0}
	No reward set slots.
	{:else}
	{stackerInfo.stacker?.rewardSetIndexes.length} reward slots.
	{/if}
		The reward address id {stackerInfo.stacker?.bitcoinAddr} with first cycle
		{fmtNumber(stackerInfo.stacker?.firstRewardCycle)}
	</p>
{/if}
{#if stackerInfo?.delegation && stackerInfo.delegation.amountUstx > 0}
	<p>
		Stacker delegated {stackerInfo.delegation.amountUstx} to {stackerInfo.delegation.delegatedTo}
		until {stackerInfo.delegation.untilBurnHt || 'indefinitely'}
	</p>
{/if}
{#if stackerInfo?.cycleInfo}
	<p>
		Cycle {stackerInfo.cycle} has {stackerInfo.cycleInfo?.numRewardSetPoxAddresses || 0} reward set addresses and
		a total of {fmtMicroToStx(Number(stackerInfo.cycleInfo?.totalUstxStacked || 0))} stx locked.
	</p>
{/if}
</div>