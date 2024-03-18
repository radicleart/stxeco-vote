<script lang="ts">
import { onMount } from 'svelte';
import type { VoteEvent } from '$types/stxeco.type';
import ChainUtils from '$lib/service/ChainUtils';
import { sbtcConfig } from '$stores/stores';
import { CONFIG } from '$lib/config';
import { NAKAMOTO_VOTE_START_HEIGHT, NAKAMOTO_VOTE_STOPS_HEIGHT, findPoolStackerEventsByDelegator, findPoolStackerEventsByHashBytes, findPoolStackerEventsByStacker, findPoxEntriesByAddress, findPoxEntriesByAddressAndCycle } from '$lib/dao_api';
	import { explorerBtcTxUrl, fmtMicroToStx, fmtNumber, getHashBytesFromAddress, truncate } from '$lib/utils';
	import { isCoordinator } from '$lib/sbtc_admin';
	import { Icon } from 'svelte-hero-icons';
	import ArrowUpRight from '$lib/components/shared/ArrowUpRight.svelte';

export let item:VoteEvent;
let expanded = false;
let inited = false;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
let coordinator = isCoordinator(account.stxAddress);
let entries: Array<any>;
let events: Array<any>;

  const getAmountNested = () => {
		try {
      return (item.amountNested) ? fmtNumber(Math.floor(Number(fmtMicroToStx(item.amountNested)))) : 0 //ChainUtils.fromOnChainAmount(item.amount)
    } catch(err:any) {
      return 0
    }
}

const getAmount = () => {
		try {
      return (item.amount) ? fmtNumber(Math.floor(Number(fmtMicroToStx(item.amount)))) : 0 //ChainUtils.fromOnChainAmount(item.amount)
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
  entries = await findPoxEntriesByAddressAndCycle((item.voterProxy) ? item.voterProxy : item.voter, 78);
  entries = entries.concat(await findPoxEntriesByAddressAndCycle((item.voterProxy) ? item.voterProxy : item.voter, 79));
  //entries = await findPoolStackerEventsByStacker(item.voter);
  const poxAddr = getHashBytesFromAddress(item.voter)
	if (poxAddr && poxAddr.hashBytes) {
    events = await findPoolStackerEventsByHashBytes(poxAddr.hashBytes, 0, 20);
    if (item.poxStacker) {
      events = events.concat(await findPoolStackerEventsByDelegator(item.poxStacker));
      events = events.concat(await findPoolStackerEventsByStacker(item.poxStacker));
    }
  }

  expanded = true
}

onMount(async () => {
  inited = true
})
</script>

{#if inited}
<div class="grid grid-cols-6 w-full justify-evenly text-sm mb-[-5px]">
  <div class={(item.voter === account.stxAddress) ? 'col-span-2 text-success w-1/2 break-words' : 'col-span-2 break-words'} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}>
    <a title="Show in Explorer" href={explorerBtcTxUrl(item.submitTxId)} target="_blank" class="">
      {#if coordinator}{item.voter}{:else}{truncate(item.voter)}{/if}
    </a>  
  </div>
  <div class="">{getAmount()}</div>
  <div class={(checkBlockHeight()) ? 'text-base' : 'text-danger-500'}>{fmtNumber(item.burnBlockHeight)}</div>
  <div class="py-1">{@html (item.for) ? '<span class="bg-success-300 text-success-800 py-2 px-3  border-success-500 rounded-2xl">Yes</span>' : '<span class="bg-danger-300 text-danger-100 py-2 px-3  border-danger-500 rounded-2xl">No</span>'}</div>
  <div class="w-full justify-end  text-[#131416]/[0.64]">{#if coordinator}<a href="/" on:click|preventDefault={() => fetchPoxData()} target="_blank">more</a>{/if}</div>
</div>
{#if isCoordinator(account.stxAddress)}
<div class="grid grid-cols-6 w-full justify-evenly text-sm mb-4">
  <div class="col-span-6 text-[#131416]/[0.44]">
    {#if item.voterProxy}<span title="nested voting address">Nested address: {item.voterProxy}</span>{/if}
    {#if item.poxStacker}<span title="nested stacker address">Stacker: {item.poxStacker}</span>{/if}
    {#if item.stackerData}<span title="nested stacker address">Data: {item.stackerData}</span>{/if}
</div>
</div>
{/if}

{#if expanded && entries}
<div class="mt-0 pt-0 text-[#131416]/[0.44] mb-4 border-b">
  <p>Entries from pox reward data map for cycles 78 and 79</p>
  {#each entries as entry}
  <div class="text-xs grid grid-cols-6 w-full justify-evenly ">
    <div class="break-words col-span-2"><a href={'/stacker-info/' + entry.stacker} target="_blank">{entry.stacker}</a></div>
    <div class="">Stacked: {fmtNumber(Math.floor(Number(fmtMicroToStx(entry.totalUstx))))}</div>
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
    <div class="break-words col-span-2"><a href={'/stacker-info/' + entry.stacker} target="_blank">{entry.stacker}</a></div>
    <div class="">Bal.: {@html ChainUtils.fromOnChainAmount(entry.balance)}</div>
    <div class="col-span-1">lockAmount: {fmtNumber(Math.floor(Number(fmtMicroToStx(entry.data.lockAmount))))}</div>
    <div class="col-span-1">event: {entry.event}</div>
  </div>
  {/each}
  </div>
{/if}

{/if}
