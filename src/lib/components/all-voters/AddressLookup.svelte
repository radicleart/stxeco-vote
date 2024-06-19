<script lang="ts">
	import { onMount } from "svelte";
	import { fmtMicroToStx, fmtNumber, getAddressFromHashBytes, getHashBytesFromAddress, truncate } from "$lib/utils";
	import { findPoolStackerEventsByHashBytes, findPoolStackerEventsByStacker, findPoxEntriesByAddress, getVoterEvents } from "$lib/dao_api";
	import ChainUtils from "$lib/service/ChainUtils";
	import type { VoteEvent } from "@mijoco/stx_helpers/dist/index";

	export let walletAddress:string;
	export let lookupMode:boolean;

	let votes: Array<VoteEvent>;
	let stackerEventEntries: Array<any>;
	let soloEventEntries: Array<any>;
	let poxEntries: Array<any>;
	let inited = false;

	const getAmount = (entry:any) => {
		if (entry.event === 'delegate-stx') {
			return 'Amount: ' + ChainUtils.fromOnChainAmount(entry.data.amountUstx)
		} else if (entry.event === 'delegate-stack-stx') {
			return 'Lock: ' + ChainUtils.fromOnChainAmount(entry.data.lockAmount)
		} else if (entry.event === 'delegate-stack-extend') {
			return 'Extend: ' + entry.data.extendCount
		} else {
			return '-'
		}
	}

	const getUnlockHeight = (entry:any) => {
		if (entry.data.unlockBurnHeight === 0) {
			return 'indefinite'
		}
		if (entry.event === 'delegate-stx') {
			return fmtNumber(entry.data.unlockBurnHeight)
		} else if (entry.event === 'delegate-stack-stx') {
			return fmtNumber(entry.data.unlockBurnHeight)
		} else if (entry.event === 'delegate-stack-extend') {
			return fmtNumber(entry.data.unlockBurnHeight)
		} else {
			return '-'
		}
	}

	const getDelegator = (entry:any) => {
		if (entry.data.delegator) {
			return truncate(entry.data.delegator, 10)
		} else {
			return '-'
		}
	}

	const getRewardAddress = (entry:any) => {
		try {
			return truncate(getAddressFromHashBytes(entry.data.poxAddr.hashBytes, entry.data.poxAddr.version), 10)
		} catch (err:any) {
			return '-'
		}
	}
	
    const processStackingHistory = async () => {
		if (!walletAddress) return;
		votes = await getVoterEvents(walletAddress);
		if (walletAddress.startsWith('S')) {
			stackerEventEntries = await findPoolStackerEventsByStacker(walletAddress);
		} else {
			poxEntries = await findPoxEntriesByAddress(walletAddress)
			const poxAddr = getHashBytesFromAddress(walletAddress)
			if (poxAddr && poxAddr.hashBytes) soloEventEntries = await findPoolStackerEventsByHashBytes(poxAddr.hashBytes, 0, 20);
		}
    }

	onMount(async () => {
		//await processStackingHistory()
		inited = true
  	})

</script>

{#if inited}
<div class="p-5 m-5 bg-white border border-lightgray rounded-md">

{#if lookupMode}
<div class="flex flex-col w-full my-8 ">
    <div class="flex flex-col gap-y-2 bg-warning-01">
		<h1 class="text-2xl">Voting data</h1>
		<input type="text" id="stacks-address" placeholder="stacks address is required" class="p-3 rounded-sm border text-black" bind:value={walletAddress}/>

		<button on:click={() => {processStackingHistory()}} class="w-[150px] text-white justify-start items-start gap-x-1.5 bg-black px-4 py-2 rounded-xl border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
		Lookup
		</button>
	</div>
</div>
{#if votes && votes.length > 0}
<div class="flex flex-col w-full my-8 ">
    <div class="flex flex-col gap-y-2 bg-warning-01">
		<h1 class="text-2xl">Voting data</h1>
		<div class="grid grid-cols-3 w-full justify-evenly border-t border-gray-300 py-3 mt-3">
			<div>Type</div>
			<div>STX</div>
			<div>For</div>
		</div>
		{#each votes as vote}
		<div class="text-xs grid grid-cols-3 w-full justify-evenly ">
		  <div class="">{vote.event}</div>
		  <div class="">{(vote.amount) ? fmtNumber(Number(fmtMicroToStx(vote.amount))) : '-'}</div>
		  <div class="">{vote.for}</div>
		</div>
		{/each}
	</div>
</div>
{/if}
{/if}
{#if stackerEventEntries && stackerEventEntries.length > 0}
<div class="flex flex-col w-full my-8 ">
    <div class="flex flex-col gap-y-2 bg-warning-01">
		<h1 class="text-2xl">Voting data</h1>
		<div class="grid grid-cols-3 w-full justify-evenly border-t border-gray-300 py-3 mt-3">
			<div>Type</div>
			<div>STX</div>
			<div>For</div>
		</div>
		{#each stackerEventEntries as vote}
		{#if vote.event === 'stack-stx'}
		<div class="text-xs grid grid-cols-3 w-full justify-evenly ">
			<div class="">{vote.event}</div>
			<div class="">{fmtNumber(Number(fmtMicroToStx(vote.data.lockAmount)))}</div>
			<div class="">{'-'}</div>
		  </div>
		  {:else}
		<div class="text-xs grid grid-cols-3 w-full justify-evenly ">
			<div class="">{vote.event}</div>
			<div class="">{(vote.amount) ? fmtNumber(Number(fmtMicroToStx(vote.amount))) : '-'}</div>
			<div class="">{vote.for}</div>
		  </div>
		  {/if}
		{/each}
	</div>
</div>
{/if}
{#if poxEntries}
<div class="flex flex-col w-full my-8 ">
    <div class="flex flex-col gap-y-2 bg-warning-01">
		<h1 class="text-2xl">PoX data</h1>
		<div class="grid grid-cols-6 w-full justify-evenly border-t border-gray-300 py-3 mt-3">
		<div>Event</div>
		<div>Unlock</div>
		<div>Amount/Unlock</div>
		<div>Delegator</div>
		<div>Reward Addr</div>
		</div>
		{#if poxEntries.length > 0}
		{#each poxEntries as entry}
		<div class="text-xs grid grid-cols-6 w-full justify-evenly ">
		<div class="">{entry.event}</div>
		<div class="">{getUnlockHeight(entry)}</div>
		<div class="">{@html getAmount(entry)}</div>
		<div class="">{getDelegator(entry)}</div>
		<div class="">{getRewardAddress(entry)}</div>
		</div>
		{/each}
		{:else}
			<div class="flex flex-col gap-y-2 bg-warning-01">
				<h3 class="mb-2">No pox data in cycles 78/79</h3>
			</div>
		{/if}
	</div>
</div>
{/if}
</div>
{/if}
