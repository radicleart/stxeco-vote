<script lang="ts">
	import { sbtcConfig } from '$stores/stores';
	import { afterNavigate } from "$app/navigation";
	import { fmtNumber } from 'sbtc-bridge-lib';
	import { fmtMicroToStx } from '$lib/utils';

	const threshold = $sbtcConfig.poxInfo.min_amount_ustx
	const cycle = $sbtcConfig.poxInfo.current_cycle
	const nextCycle = $sbtcConfig.poxInfo.next_cycle.blocks_until_prepare_phase


	let componentKey = 0;
	let currentPahse = 'prepare';
	afterNavigate((nav) => {
		componentKey++;
	})

</script>

<div class="mx-0 border-none rounded-lg p-0 flex flex-col ">
	<div class="flex justify-between">
		<div class="p-1 border-white rounded-lg">
			<span role="contentinfo" class="inline-flex items-center gap-1 md:text-sand-700 py-1 px-0">
				<span class="w-1 h-1 rounded-full bg-bloodorange"></span>
				Cycle:
				<span class="text-[#131416]/[0.64] inline-flex items-center gap-0">
					{cycle.id}
				</span>
			</span>
		</div>
		<div class="p-1 border-white rounded-lg">
			<span role="contentinfo" class="inline-flex items-center gap-1 md:text-sand-700 py-1 px-0">
				<span class="w-1 h-1 rounded-full bg-bloodorange"></span>
				Activation:
				<span class="text-[#131416]/[0.64] inline-flex items-center gap-0">
					????
				</span>
			</span>
		</div>
		<div class="p-1 border-white rounded-lg">
			<span role="contentinfo" class="inline-flex items-center gap-1 md:text-sand-700 py-1 px-0">
				<span class="w-1 h-1 rounded-full bg-bloodorange"></span>
				Threshold:
				<span class="text-[#131416]/[0.64] inline-flex items-center gap-0">
					{fmtNumber(Number(fmtMicroToStx(threshold)))}
				</span>
			</span>
		</div>
		<div class="p-1 border-white rounded-lg">
			<span role="contentinfo" class="inline-flex items-center gap-1 md:text-sand-700 py-1 px-0">
				<span class="w-1 h-1 rounded-full bg-bloodorange"></span>
				Next prepare phase:
				<span class="text-[#131416]/[0.64] inline-flex items-center gap-0">
					{nextCycle} blocks
				</span>
			</span>
		</div>
	</div>
</div>
