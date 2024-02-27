<script lang="ts">
import { onMount } from 'svelte';
import type { VoteEvent } from '$types/stxeco.type';
import ChainUtils from '$lib/service/ChainUtils';
import { sbtcConfig } from '$stores/stores';
import { CONFIG } from '$lib/config';
import { NAKAMOTO_VOTE_START_HEIGHT, NAKAMOTO_VOTE_STOPS_HEIGHT, findPoolStackerEventsByHashBytes, findPoolStackerEventsByStacker, findPoxEntriesByAddress } from '$lib/dao_api';
	import { fmtNumber, getHashBytesFromAddress } from '$lib/utils';

export let item:VoteEvent;
let expanded = false;
let inited = false;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
let entries: Array<any>;
let events: Array<any>;

const getAmount = () => {
		try {
      return (item.amount) ? item.amount : 0 //ChainUtils.fromOnChainAmount(item.amount)
    } catch(err:any) {
      return 0
    }
}

const checkBlockHeight = () => {
  return item.burnBlockHeight >= NAKAMOTO_VOTE_START_HEIGHT && item.burnBlockHeight < NAKAMOTO_VOTE_STOPS_HEIGHT
}

const fetchPoxData = async () => {
  if (expanded) {
    expanded = false
    return
  }
  entries = await findPoxEntriesByAddress(item.voter);
  //entries = await findPoolStackerEventsByStacker(item.voter);
  const poxAddr = getHashBytesFromAddress(item.voter)
	if (poxAddr && poxAddr.hashBytes) {
    events = await findPoolStackerEventsByHashBytes(poxAddr.hashBytes, 0, 20);
  }

  expanded = true
}

onMount(async () => {
  inited = true
})
</script>

{#if inited}
<div class="grid grid-cols-6 w-full justify-evenly text-sm">
  <div class={(item.voter === account.stxAddress) ? 'col-span-2 text-success w-1/2 break-words' : 'col-span-2 break-words'} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}>{item.voter}</div>
  <div class="">{getAmount()}</div>
  <div class={(checkBlockHeight()) ? 'text-base' : 'text-danger-500'}>{fmtNumber(item.burnBlockHeight)}</div>
  <div class="py-1">{@html (item.for) ? '<span class="bg-success-300 text-success-800 py-2 px-3  border-success-500 rounded-2xl">Yes</span>' : '<span class="bg-danger-300 text-danger-100 py-2 px-3  border-danger-500 rounded-2xl">No</span>'}</div>
  <div class="w-full justify-end  text-[#131416]/[0.64]"><a href="/" on:click|preventDefault={() => fetchPoxData()}>{#if expanded}less{:else}more{/if}</a></div>
</div>
{#if expanded && entries}
<div class="mt-0 pt-0 text-[#131416]/[0.44] mb-4 border-b">
  <p>Entries from pox reward data map for cycles 78 and 79</p>
  {#each entries as entry}
  <div class="text-xs grid grid-cols-6 w-full justify-evenly ">
    <div class="break-words col-span-2">{entry.stacker}</div>
    <div class="">Stacked: {@html ChainUtils.fromOnChainAmount(entry.totalUstx)}</div>
    <div class="col-span-1">Cycle: {entry.cycle}</div>
    <div class="col-span-1">Index: {entry.index}</div>
  </div>
  {/each}
  </div>
{/if}

{#if expanded && events}
<div class="mt-0 pt-0 text-[#131416]/[0.44] mb-4 border-b">
  <p>Entries from pox-3 event stream</p>
  {#each events as entry}
  <div class="text-xs grid grid-cols-6 w-full justify-evenly ">
    <div class="break-words col-span-2">{entry.stacker}</div>
    <div class="">Bal.: {@html ChainUtils.fromOnChainAmount(entry.balance)}</div>
    <div class="col-span-1">lockAmount: {entry.data.lockAmount}</div>
    <div class="col-span-1">event: {entry.event}</div>
  </div>
  {/each}
  </div>
{/if}

{/if}
