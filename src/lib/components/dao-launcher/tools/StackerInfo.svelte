<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import { getConfig } from '$stores/store_helpers';
	import { findStackerEventsByAddress } from '$lib/pox_api';
	import { fmtMicroToStx, fmtNumber, truncate } from '$lib/utils';
	import type { StackerInfo, PoxInfo, PoolStackerEvent } from '@mijoco/stx_helpers/dist/index';

	const dispatch = createEventDispatcher();

	export let poxInfo: PoxInfo;
	export let address: string | null;
	let stackerEvents: Array<PoolStackerEvent>;

	let stxAddress: string = $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress;
	let stackerInfo: StackerInfo;
	let cycle = poxInfo.reward_cycle_id;
	let lockPeriod: { value: number };

	const processAddress = async () => {
		if (!address) return;
		//stackerInfo = await getPoxInfoByStacker(address, cycle);
		stackerEvents = await findStackerEventsByAddress(address);
		do {
			stackerEvents = stackerEvents.concat(await findStackerEventsByAddress(address));
		} while (stackerEvents.length === 100);
	};

	const camelToSpace = (text: string) => {
		return text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
	};

	const back = async () => {
		dispatch('back');
	};
	onMount(async () => {
		if (!address) address = stxAddress;
		// if (poxEntry) {
		// 	stackerInfo = await getPoxInfoByStacker(poxEntry.stacker, poxEntry.cycle)
		// 	stxAddress = poxEntry.stacker
		// 	cycle = poxEntry.cycle
		// 	lockPeriod = (stackerInfo.stacker?.lockPeriod) ? stackerInfo.stacker?.lockPeriod[0] : {value: 0}
		// }
	});
</script>

<div class=" py-3 space-y-2">
	<p class="text-lg text-[#131416]/[0.64]">Enter address</p>
</div>
<div class="flex flex-col md:flex-row gap-2">
	<input
		type="text"
		id="stacks-address"
		placeholder="stacks address is required"
		class="w-4/5 p-3 rounded-md border-none text-black"
		bind:value={address}
	/>

	<!--
	<label for="reward-cycle" class="text-sand-500">PoX information relating to bitcoin address</label
	>
	<input
		type="number"
		id="reward-cycle"
		class="p-3 rounded-sm border-none text-black"
		bind:value={cycle}
	/>
	-->

	<button
		on:click={() => {
			processAddress();
		}}
		class="w-1/5 text-white justify-start items-start gap-x-1.5 bg-black px-4 py-2 rounded-md border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
	>
		Lookup
	</button>
</div>
{#if stackerEvents}
	<div class="my-5">
		<!-- Template to display data when it arrives -->
		<div class="grid grid-cols-5 text-lg font-bold">
			<!-- Example: Render poxData here -->
			<div class="col-span-1">Event</div>
			<div class="col-span-4">Event data</div>
		</div>

		<div class="grid grid-cols-5 gap-y-5 space-5 font-bold text-sm">
			<!-- Example: Render poxData here -->
			{#each stackerEvents as entry}
				<div class="md:col-span-1 font-bold text-primary-500"><b>{entry.event}</b></div>
				<div class="col-span-4">
					<div class="data-item">
						{#each Object.keys(entry) as key}
							{#if key !== '_id'}
								{#if key === 'data'}
									{#each Object.keys(entry.data) as dataKey}
										<div class="px-5 grid grid-cols-3">
											<div><strong>{camelToSpace(dataKey)}:</strong></div>
											<div class="col-span-2">{entry.data[dataKey]}</div>
										</div>
									{/each}
								{:else}
									<div class="grid grid-cols-3">
										<div><strong>{camelToSpace(key)}:</strong></div>
										<div class="col-span-2">{entry[key]}</div>
									</div>
								{/if}
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

{#if stackerInfo}
	<div class="flex flex-col gap-y-2">
		<div class="flex">
			<div class="w-1/5 text-[#131416]/[0.64]">Stacker:</div>
			<div class="text-bloodorange w-4/5">{stackerInfo.stacksAddress}</div>
		</div>
		{#if stackerInfo.stacker?.bitcoinAddr}
			<div class="flex text-[#131416]/[0.44]">
				<div class="w-1/5"></div>
				<div class="w-4/5">{stackerInfo.stacker?.bitcoinAddr}</div>
			</div>
			<div class="flex text-[#131416]/[0.44]">
				<div class="w-1/5">First cycle</div>
				<div class="w-4/5">{fmtNumber(stackerInfo.stacker?.firstRewardCycle)}</div>
			</div>
			<div class="flex text-[#131416]/[0.44]">
				<div class="w-1/5">Lock period</div>
				<div class="w-4/5">{lockPeriod ? lockPeriod.value : 0}</div>
			</div>
			{#if stackerInfo.stacker?.delegatedTo}
				<div class="flex text-[#131416]/[0.44]">
					<div class="w-1/5">Delegation</div>
					<div class="w-4/5">{stackerInfo.stacker?.delegatedTo}</div>
				</div>
				<div class="flex text-[#131416]/[0.44]">
					<div class="w-1/5"></div>
					<div class="w-4/5">{fmtMicroToStx(stackerInfo.delegation?.amountUstx || 0)}</div>
				</div>
				<div class="flex text-[#131416]/[0.44]">
					<div class="w-1/5"></div>
					<div class="w-4/5">{stackerInfo.delegation?.bitcoinAddr}</div>
				</div>
				<div class="flex text-[#131416]/[0.44]">
					<div class="w-1/5">until</div>
					<div class="w-4/5">{stackerInfo.delegation?.untilBurnHt}</div>
				</div>
			{/if}
		{/if}
	</div>
{/if}
