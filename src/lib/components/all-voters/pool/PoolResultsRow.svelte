<script lang="ts">
import ChainUtils from '$lib/service/ChainUtils';
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import type { VoteEvent } from '$types/stxeco.type';
import { NAKAMOTO_VOTE_START_HEIGHT, NAKAMOTO_VOTE_STOPS_HEIGHT, findPoolStackerEventsByStacker, findPoolVotes } from '$lib/dao_api';
import { fmtNumber, getAddressFromHashBytes, truncate } from '$lib/utils';
	import AddressLookup from '../AddressLookup.svelte';
	import { page } from '$app/stores';

export let item:VoteEvent;

let expanded = false;
let inited = false;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
let events: Array<any>;

const checkBlockHeight = () => {
  if (!item.burnBlockHeight) return true
  return true; //item.burnBlockHeight >= NAKAMOTO_VOTE_START_HEIGHT && item.burnBlockHeight < NAKAMOTO_VOTE_STOPS_HEIGHT
}

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

const fetchPoxData = async () => {
  if (expanded) {
    expanded = false
    return
  }
  events = await findPoolStackerEventsByStacker(item.voter);
  expanded = true
}

onMount(async () => {
  inited = true
})
</script>

{#if inited}
<div class="grid grid-cols-6 w-full justify-evenly text-sm">
  <div class={(item.voter === account.stxAddress) ? 'col-span-2 text-success w-1/2 break-words' : 'col-span-2 break-words'} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}><a href={'/stacker-info/' + item.voter} target="_blank">{item.voter}</a></div>
  <div class="">{@html ChainUtils.fromOnChainAmount(item.amount)}</div>
  <div class={(checkBlockHeight()) ? 'text-base' : 'text-danger-500'}>{fmtNumber(item.burnBlockHeight || 0)}</div>
  <div class="py-1">{@html (item.for) ? '<span class="bg-success-300 text-success-800 py-2 px-3  border-success-500 rounded-2xl">Yes</span>' : '<span class="bg-danger-300 text-danger-100 py-2 px-3  border-danger-500 rounded-2xl">No</span>'}</div>
  <div class="w-full justify-end  text-[#131416]/[0.64]"><a href={'/stacker-info/' + item.voter} target="_blank">more</a></div>
</div>

{#if expanded && events}
<div class="mt-0 pt-0 text-[#131416]/[0.44] mb-4 border-b">
  <p>Entries from pox-3 event stream</p>
  {#each events as entry}
  <div class="text-xs grid grid-cols-7 w-full justify-evenly ">
    <div class="break-words col-span-2"><a href={'/stacker-info/' + entry.stacker} target="_blank">{entry.stacker}</a></div>
    <div class="col-span-1">{entry.event}</div>
    {#if entry.event === 'delegate-stx'}
    <div class="col-span-2">Delegator: <a href={'/stacker-info/' + entry.data.delegator} target="_blank">{truncate(entry.data.delegator)}</a></div>
    <div class="">Amt: {entry.data.amountUstx}</div>
    <div class="">Unlck: {entry.data.unlockBurnHeight}</div>
    {:else}
    <div class=""></div>
    <div class=""></div>
    <div class=""></div>
    {/if}

  </div>
  {/each}
  </div>
{/if}

{/if}
