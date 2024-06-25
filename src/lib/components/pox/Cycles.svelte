<script lang="ts">
	import { Tabs, TabItem } from "flowbite-svelte";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";
	import Countdown from "../../ui/Countdown.svelte";
	import { sessionStore } from "$stores/stores";
	import { isCoordinator } from "$lib/admin";
	import { getConfig } from "$stores/store_helpers";
	import { syncPoxEntriesByCycle } from "$lib/pox_api";
	import PoxEntries from "./PoxEntries.svelte";
	import type { PoxInfo } from "@mijoco/stx_helpers";

	export let poxInfo:PoxInfo;
	let showPoxEntries = false;
	let method:number = 1;
	let cycle:number;
	$: stacksTip = $sessionStore.stacksInfo?.stacks_tip_height | 0;
	$: bitcoinTip = $sessionStore.stacksInfo?.burn_block_height | 0;

	const loadPoxEntries = async (cycle:number) => {
		await syncPoxEntriesByCycle(cycle)
	}

	const displayPoxEntries = async (myCycle:number) => {
		cycle = myCycle
		showPoxEntries = true
	}

</script>

<div class="py-3 space-y-2">
	<p class="text-lg text-[#131416]/[0.64]">The current bitcoin chain tip is {fmtNumber(bitcoinTip)}
	  ({fmtNumber(stacksTip)} on stacks) and the current reward cycle is {poxInfo.reward_cycle_id}</p>
	<p class="text-lg text-[#131416]/[0.64]">A stacking cycle is 2100 blocks (100 blocks in prepare phase and 2000 blocks in reward phase)</p>
</div>

<div>
	<Tabs style="underline" contentClass="mt-2 py-4">
		<TabItem open={method === 1} title="Cycle {poxInfo.current_cycle.id}" on:click={() => showPoxEntries = false} class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
			<div class="bg-lightgray py-8 px-4 relative top-[-15px]">
			<div class="grid grid-cols-6 space-y-2">
				<div class="col-span-2">Stacked</div>
				<div class="col-span-4">{fmtNumber(Number(fmtMicroToStx(poxInfo.current_cycle.stacked_ustx)))}</div>
				<div class="col-span-2">Cycle ends</div>
				<div class="col-span-4">
				{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - 1)} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - 1 - bitcoinTip)} bitcoin blocks
				<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown scaleFactor={1} endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip} /></span>
				</div>
			</div>
			</div>
			{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
			<div class="text-sm text-[#131416]/[0.64] flex justify-end gap-x-5">
				<div class=""><a href="/" on:click|preventDefault={() => loadPoxEntries(poxInfo.current_cycle.id)}>index</a></div>
			</div>
			{/if}
		</TabItem>
		<TabItem  title="Cycle {poxInfo.next_cycle.id}" on:click={() => showPoxEntries = false} class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
			<div class="bg-lightgray py-8 px-4 relative top-[-15px]">
			<div class="grid grid-cols-6 space-y-2">
				<div class="col-span-2">Stacked</div>
				<div class="col-span-4">{fmtNumber(Number(fmtMicroToStx(poxInfo.next_cycle.stacked_ustx)))}</div>
				<div class="col-span-2">Cycle starts</div>
				<div class="col-span-4">
				{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height)} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip)} blocks
				<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown scaleFactor={1} endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip} /></span>
				</div>
				<div class="col-span-2">Cycle ends</div>
				<div class="col-span-4">{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + 2100)} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + 2100 - bitcoinTip)} blocks
				<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown scaleFactor={1} endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip + 2100} /></span>
				</div>
			</div>
			</div>
			{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
			<div class="text-sm text-[#131416]/[0.64] flex justify-end gap-x-5">
				<div class=""><a href="/" on:click|preventDefault={() => loadPoxEntries(poxInfo.next_cycle.id)}>index</a></div>
			</div>
			{/if}
		</TabItem>
		<TabItem  title="Cycle {poxInfo.next_cycle.id + 1}" on:click={() => showPoxEntries = false} class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
			<div class="bg-lightgray py-8 px-4 relative top-[-15px]">
			<div class="grid grid-cols-6 space-y-2">
				<div class="col-span-2">Stacked</div>
				<div class="col-span-4">-</div>
				<div class="col-span-2">Cycle starts</div>
				<div class="col-span-4">
				{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip + 2100)} blocks
				<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown scaleFactor={1} endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip + (2100)} /></span>
				</div>
				<div class="col-span-2">Cycle ends</div>
				<div class="col-span-4">
				{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2*2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2*2100) - bitcoinTip)} blocks
				<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown scaleFactor={1} endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip + (2*2100)} /></span>
				</div>
			</div>
			</div>
			{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
			<div class="text-sm text-[#131416]/[0.64] flex justify-end gap-x-5">
				<div class=""><a href="/" on:click|preventDefault={() => loadPoxEntries(poxInfo.next_cycle.id + 1)}>index</a></div>
			</div>
			{/if}
		</TabItem>
		<TabItem  title="Cycle {poxInfo.next_cycle.id + 2}" on:click={() => showPoxEntries = false} class="bg-lightgray relative top-[10px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100">
			<div class="bg-lightgray py-8 px-4 relative top-[-15px]">
			<div class="grid grid-cols-6 space-y-2">
				<div class="col-span-2">Stacked</div>
				<div class="col-span-4">-</div>
				<div class="col-span-2">Cycle starts</div>
				<div class="col-span-4">
				{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (2*2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip + (2*2100))} blocks
				<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown scaleFactor={1} endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip + (2*2100)}/></span>
				</div>
				<div class="col-span-2">Cycle ends</div>
				<div class="col-span-4">
				{fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (3*2100))} in {fmtNumber(poxInfo.next_cycle.prepare_phase_start_block_height + (3*2100) - bitcoinTip)} blocks
				<br/><span class="text-sm text-[#131416]/[0.64]"><Countdown scaleFactor={1} endBlock={poxInfo.next_cycle.prepare_phase_start_block_height - bitcoinTip + (3*2100)} /></span>
				</div>
				{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
				<div class="col-span-2"></div>
				<div class="col-span-4"><a href="/" on:click|preventDefault={() => loadPoxEntries(poxInfo.next_cycle.id + 2)}>index pox entries</a></div>
				{/if}
			</div>
			</div>
			{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
			<div class="text-sm text-[#131416]/[0.64] flex justify-end gap-x-5">
				<div class=""><a href="/" on:click|preventDefault={() => loadPoxEntries(poxInfo.next_cycle.id + 2)}>index</a></div>
			</div>
			{/if}
		</TabItem>
	</Tabs>
</div>
{#if showPoxEntries}
<PoxEntries {poxInfo} />
{/if}