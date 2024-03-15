<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import type { StackerInfo } from "$types/pox_types";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";

	export let stackerInfo:StackerInfo;
	let showCycleInfo = false; // interesting but too much info here

	onMount(async () => {
  	})

</script>

<div class="flex flex-col gap-y-5 mt-4">
{#if stackerInfo?.stacker}
	<p>{#if !stackerInfo.stacker?.rewardSetIndexes || stackerInfo.stacker?.rewardSetIndexes.length === 0}
	No reward set slots.
	{:else}
	{stackerInfo.stacker?.rewardSetIndexes.length} reward slots.
	{/if}
		The reward address id {stackerInfo.stacker?.bitcoinAddr}
	</p>
{/if}
{#if stackerInfo?.delegation && stackerInfo.delegation.amountUstx > 0}
	<p>
		Stacker delegated {fmtNumber(Math.floor(Number(fmtMicroToStx(stackerInfo.delegation.amountUstx))))} to {stackerInfo.delegation.delegatedTo}
		until {stackerInfo.delegation.untilBurnHt || 'indefinitely'}
	</p>
{/if}
{#if stackerInfo?.cycleInfo && showCycleInfo}
	<p>
		Cycle {stackerInfo.cycle} has {stackerInfo.cycleInfo?.numRewardSetPoxAddresses || 0} reward set addresses and
		a total of {fmtNumber(Math.floor(Number(fmtMicroToStx(stackerInfo.cycleInfo?.totalUstxStacked || 0))))} stx locked.
	</p>
{/if}
</div>