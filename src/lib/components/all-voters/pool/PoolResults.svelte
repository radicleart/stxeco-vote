<script lang="ts">
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { onMount } from 'svelte';
import FormatUtils from '$lib/service/FormatUtils';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
import VoteResultsRow from '../VoteResultsRow.svelte';
	import type { ResultsSummary } from '$types/pox_types';
	import { findPoolVotes } from '$lib/dao_api';
	import PoolResultsRow from './PoolResultsRow.svelte';
	import AddressLookup from '../AddressLookup.svelte';
	import { Icon, InformationCircle } from 'svelte-hero-icons';
	import { Tooltip } from 'flowbite-svelte';

export let summary:ResultsSummary;
export let proposal:ProposalEvent;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
let votes: Array<VoteEvent> = []
let allVotes: Array<VoteEvent> = []
let includeZeros = false;

let showVotes = false;
let showAddressLookup = false;
let componentKey = 0;
let sortDir = '';
let sortField = 'voter';

const reorder = (sf:string) => {
    sortField = sf;
    sortDir = (sortDir === '-') ? '' : '-';
    componentKey++;
}

const fetchTransactions = async () => {
  showAddressLookup = false
  if (showVotes) {
    showVotes = false
    return
  }
  if (votes.length === 0) {
    allVotes = (await findPoolVotes()).poolVotes;
    //if (newV) votes = newV.soloVotes.filter((o:VoteEvent) => o.amount > 0)
    if (includeZeros) {
      votes = allVotes
    } else {
      votes = allVotes.filter((o:VoteEvent) => o.amount > 0)
    }
  }

  showVotes = true
}

let totalVotePower = (proposal.proposalData) ? FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(proposal.proposalData.votesFor + proposal.proposalData.votesAgainst))) : 0;
let accountsFor = 0;
let accountsAgainst = 0;
let stxFor = 0;
let stxAgainst = 0;
let stxPower = 0;

let inited = false;
let inFavour = 0;
let winning = 'danger';

const openAddressLookup = () => {
  showAddressLookup = !showAddressLookup
  showVotes = false
}

const analysisMode = () => {
  includeZeros = !includeZeros
  if (allVotes.length > 0)
  if (includeZeros) {
      votes = allVotes
  } else {
      votes = allVotes.filter((o:VoteEvent) => o.amount > 0)
  }
  let votesFor = summary.summary.find((o) => o._id.event === 'pool-vote' && o._id.for)
  let votesAgn = summary.summary.find((o) => o._id.event === 'pool-vote' && !o._id.for);
  if (includeZeros) {
    votesFor = summary.summaryWithZeros.find((o) => o._id.event === 'pool-vote' && o._id.for)
    votesAgn = summary.summaryWithZeros.find((o) => o._id.event === 'pool-vote' && !o._id.for)
  }
  stxFor = votesFor?.total || 0
  stxAgainst = votesAgn?.total || 0
  stxPower = stxFor + stxAgainst
  accountsFor = votesFor?.count || 0
  accountsAgainst = votesAgn?.count || 0
  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
  componentKey++
}

onMount(async () => {
  const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
	const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
	DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposal);

  includeZeros = true // double negative here!
  analysisMode()
  inited = true;
})

$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

{#if inited}
<VoteResultsRow {stxFor} {stxAgainst} {accountsFor} {accountsAgainst} />

<Tooltip class="w-auto !font-extralight !bg-black z-20" triggeredBy="#analysis-label">
  Toggle between all votes and elligible votes - some pool and solo votes were submitted by non stackers.
</Tooltip>

<div class="flex justify-between">
  <a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => fetchTransactions() }>{#if !showVotes}Show{:else}Hide{/if} transaction details</a>
  <div class="flex gap-x-1 me-10">
    
    <a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => analysisMode() }>
      <Icon src="{InformationCircle}" mini class="ml-2 shrink-0 h-8 w-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" aria-hidden="true" id="analysis-label" />
    </a>
  </div>
</div>

  {#if showVotes}
    <div class="grid grid-cols-6 w-full justify-evenly mt-5  border-b border-gray-300 pb-3 mb-3">
      <div class="col-span-2"><a href="/" class="pointer w-1/2" on:click|preventDefault={() => reorder('voter')}>Voter</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('amount')}>Power</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('amount')}>Height</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('for')}>For/Against</a></div>
      <div>&nbsp;</div>
    </div>
    {#key componentKey}
    {#each sortedEvents as item}
    <PoolResultsRow {item}/>
    {/each}
    {/key}
  {/if}
  {#if showAddressLookup}
  <AddressLookup lookupMode={true} walletAddress={$sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress}/>
  {/if}
{/if}
