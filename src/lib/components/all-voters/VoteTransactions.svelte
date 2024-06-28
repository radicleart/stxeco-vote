<script lang="ts">
	import { isCoordinator } from "$lib/proposals";
	import ChainUtils from "$lib/service/ChainUtils";
	import DaoUtils from "$lib/service/DaoUtils";
	import { csvMaker, explorerTxUrl, truncate } from "$lib/utils";
	import { sessionStore } from "$stores/stores";
	import { onMount } from "svelte";
	import { ArrowUpRight, Icon } from "svelte-hero-icons";
	import type { VoteEvent } from "@mijoco/stx_helpers/dist/index";
	import { getConfig } from "$stores/store_helpers";

	export let votes: Array<VoteEvent> = []
	const account = $sessionStore.keySets[getConfig().VITE_NETWORK];
	let componentKey = 0;
	let sortDir = '';
	let sortField = 'voter';

	const download = () => {
		const csvVotes = []
		for (const vote of votes) {
			csvVotes.push({
			voter: vote.voter,
			txid: vote.submitTxId,
			for: vote.for,
			power: vote.amount
			})
		}
		csvMaker(csvVotes, 'nakamoto-dao-votes.csv')
	}

	const getAmount = (vote:VoteEvent):number => {
		if (vote.event === 'pool-event') {
			if (vote.stackerData && vote.stackerData.length > 0) {
				return vote.stackerData[0].data.amountUstx
			} else return 0
		} else {
			return vote.amount
		}
	}

	const reorder = (sf:string) => {
		sortField = sf;
		sortDir = (sortDir === '-') ? '' : '-';
		componentKey++;
	}

	onMount(async () => {
	})

	$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

<div>
	<a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => download() }>to csv</a>
  </div>

<div class="grid grid-cols-4 w-full justify-evenly mt-5  border-b border-gray-300 pb-3 mb-3">
    <div class="col-span-2"><a href="/" class="pointer w-1/2" on:click|preventDefault={() => reorder('voter')}>Voter</a></div>
    <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('amount')}>Power</a></div>
	<div><a href="/" class="pointer" on:click|preventDefault={() => reorder('for')}>For/Against</a></div>
</div>
{#each sortedEvents as item}
{#if getAmount(item) > 0}
<div class="grid grid-cols-4 w-full justify-evenly">
  <div class={(item.voter === account.stxAddress) ? 'col-span-2 text-success w-1/2 break-words' : 'col-span-2 break-words'} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}>
	<span class="">
		<span class="pe-5 ">{item.voter}</span> 
		<a title="Show in Explorer" href={explorerTxUrl(item.submitTxId)} target="_blank" class=" h-4 w-4 rounded-md bg-black inline-flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
	  <Icon src="{ArrowUpRight}" mini class="inline-block h-5 w-5 text-white" aria-hidden="true" />
	</a>  
	</span>
  </div>
  <div class="break-words">{@html ChainUtils.fromOnChainAmount(getAmount(item))}</div>
  <div class="py-2">{@html (item.for) ? '<span class="bg-success-300 text-success-800 py-2 px-3  border-success-500 rounded-2xl">Yes</span>' : '<span class="bg-danger-300 text-danger-100 py-2 px-3  border-danger-500 rounded-2xl">No</span>'}</div>
</div>
{/if}
{/each}
