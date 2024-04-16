<script lang="ts">
import ChainUtils from '$lib/service/ChainUtils';
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import type { VoteEvent } from '$types/stxeco.type';
import { findPoolStackerEventsByStacker } from '$lib/dao_api';
import { explorerTxUrl, fmtNumber, getAddressFromHashBytes, truncate } from '$lib/utils';
import { isCoordinator } from '$lib/sbtc_admin';
	import { Icon } from 'svelte-hero-icons';
	import ArrowUpRight from '$lib/components/shared/ArrowUpRight.svelte';

export let item:VoteEvent;

let expanded = false;
let inited = false;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
let coordinator = isCoordinator(account.stxAddress);
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
  <div class={(item.voter === account.stxAddress) ? 'col-span-2 text-success w-1/2 break-words' : 'col-span-2 break-words'} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}>
    <span class="">
      <span class="pe-5 ">{item.voter}</span> 
      <a title="Show in Explorer" href={explorerTxUrl(item.submitTxId)} target="_blank" class=" h-4 w-4 rounded-md bg-black inline-flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
      <Icon src="{ArrowUpRight}" mini class="inline-block h-5 w-5 text-white" aria-hidden="true" />
    </a>  
    </span>
    </div>
  <div class="">{@html ChainUtils.fromOnChainAmount(item.amount)}</div>
  <div class={(checkBlockHeight()) ? 'text-base' : 'text-danger-500'}>{fmtNumber(item.burnBlockHeight || 0)}</div>
  <div class="py-1">{@html (item.for) ? '<span class="bg-success-300 text-success-800 py-2 px-3  border-success-500 rounded-2xl">Yes</span>' : '<span class="bg-danger-300 text-danger-100 py-2 px-3  border-danger-500 rounded-2xl">No</span>'}</div>
  <div class="w-full justify-end  text-[#131416]/[0.64]">{#if coordinator}<a href={'/dashboard/address-lookup/' + item.voter} target="_blank">more</a>{/if}</div>
</div>

{#if expanded && events}
<div class="mt-0 pt-0 text-[#131416]/[0.44] mb-4 border-b">
  <p>Entries from pox-3 event stream</p>
  {#each events as entry}
  <div class="text-xs grid grid-cols-7 w-full justify-evenly ">
    <div class="break-words col-span-2">{#if coordinator}<a href={'/dashboard/address-lookup/' + entry.stacker} target="_blank">{entry.stacker}</a>{/if}</div>
    <div class="col-span-1">{entry.event}</div>
    {#if entry.event === 'delegate-stx'}
    <div class="col-span-2">Delegator: {#if coordinator}<a href={'/dashboard/address-lookup/' + entry.data.delegator} target="_blank">{truncate(entry.data.delegator)}</a>{/if}</div>
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
