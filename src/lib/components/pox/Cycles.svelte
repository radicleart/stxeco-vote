<script lang="ts">
	import { Tabs, TabItem, TableSearch } from "flowbite-svelte";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";
	import Countdown from "../shared/Countdown.svelte";
	import type { PoxInfo } from "$types/pox_types";
	import { sbtcConfig } from "$stores/stores";

	export let poxInfo:PoxInfo;
	let method:number = 1;
	let stacksTip = $sbtcConfig.stacksInfo.stacks_tip_height;

</script>

<div class=" py-3 space-y-2">
	<p class="text-lg text-[#131416]/[0.64]">The current bitcoin chain tip is {fmtNumber(poxInfo.current_burnchain_block_height)} 
	  ({fmtNumber(stacksTip)} on stacks) and the current reward cycle is {poxInfo.reward_cycle_id}</p>
	<p class="text-lg text-[#131416]/[0.64]">A stacking cycle is 2100 blocks (100 blocks in prepare phase and 2000 blocks in reward phase)</p>
  </div>

<Tabs  style="underline" contentClass="py-4">
	<TabItem open={method === 1} title="Cycle {poxInfo.current_cycle.id}" class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
	  <div class="bg-lightgray py-8 px-4 relative top-[-15px]">
		<div class="grid grid-cols-6 space-y-2">
		  <div class="col-span-2">Stacked</div>
		  <div class="col-span-4">{fmtNumber(Number(fmtMicroToStx(poxInfo.current_cycle.stacked_ustx)))}</div>
		  <div class="col-span-2">Cycle ends</div>
		  <div class="col-span-4">
			{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - 1)} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - 1 - poxInfo.current_burnchain_block_height)} bitcoin blocks
			<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height} /></span>
		  </div>
		</div>
	  </div>
	</TabItem>
	<TabItem  title="Cycle {poxInfo.next_cycle.id}" class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
	  <div class="bg-lightgray py-8 px-4 relative top-[-15px]">
		<div class="grid grid-cols-6 space-y-2">
		  <div class="col-span-2">Stacked</div>
		  <div class="col-span-4">{fmtNumber(Number(fmtMicroToStx(poxInfo.next_cycle.stacked_ustx)))}</div>
		  <div class="col-span-2">Cycle starts</div>
		  <div class="col-span-4">
			{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height)} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height)} blocks
			<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height} /></span>
		  </div>
		  <div class="col-span-2">Cycle ends</div>
		  <div class="col-span-4">{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + 2100)} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + 2100 - poxInfo.current_burnchain_block_height)} blocks
			<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height + 2100} /></span>
		  </div>
		</div>
	  </div>
	</TabItem>
	<TabItem  title="Cycle {poxInfo.next_cycle.id + 1}" class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
	  <div class="bg-lightgray py-8 px-4 relative top-[-15px]">
		<div class="grid grid-cols-6 space-y-2">
		  <div class="col-span-2">Stacked</div>
		  <div class="col-span-4">-</div>
		  <div class="col-span-2">Cycle starts</div>
		  <div class="col-span-4">
			{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height + 2100)} blocks
			<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height + (2100)} /></span>
		  </div>
		  <div class="col-span-2">Cycle ends</div>
		  <div class="col-span-4">
			{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2*2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2*2100) - poxInfo.current_burnchain_block_height)} blocks
			<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height + (2*2100)} /></span>
		  </div>
		</div>
	  </div>
	</TabItem>
	<TabItem  title="Cycle {poxInfo.next_cycle.id + 2}" class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
	  <div class="bg-lightgray py-8 px-4 relative top-[-15px]">
		<div class="grid grid-cols-6 space-y-2">
		  <div class="col-span-2">Stacked</div>
		  <div class="col-span-4">-</div>
		  <div class="col-span-2">Cycle starts</div>
		  <div class="col-span-4">
			{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2*2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height + (2*2100))} blocks
			<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height + (2*2100)}/></span>
		  </div>
		  <div class="col-span-2">Cycle ends</div>
		  <div class="col-span-4">
			{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (3*2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (3*2100) - poxInfo.current_burnchain_block_height)} blocks
			<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - poxInfo.current_burnchain_block_height + (3*2100)} /></span>
		  </div>
		</div>
	  </div>
	</TabItem>
  </Tabs>
