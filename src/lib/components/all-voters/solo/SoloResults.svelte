<script lang="ts">
import DaoUtils from '$lib/service/DaoUtils';
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import { sessionStore } from '$stores/stores';
import VoteResultsRow from '../VoteResultsRow.svelte';
import { findSoloVotes } from '$lib/dao_api';
import SoloResultsRow from './SoloResultsRow.svelte';
	import AddressLookup from '../AddressLookup.svelte';
	import { Icon, InformationCircle, MagnifyingGlassCircle } from 'svelte-hero-icons';
	import { Tooltip } from 'flowbite-svelte';
	import { isCoordinator } from '$lib/admin';
	import { csvMaker, downloadCsv } from '$lib/utils';
	import type { ProposalEvent, ResultsSummary, VoteEvent } from '@mijoco/stxeco_types';

export let proposal:ProposalEvent;
export let summary:ResultsSummary;

let votes: Array<VoteEvent> = []
let allVotes: Array<VoteEvent> = []
let includeZeros = false;
let showVotes = false;
let showAddressLookup = false;
let componentKey = 0;
let sortDir = '';
let sortField = 'voter';
let accountsFor = 0;
let accountsAgainst = 0;
let stxFor = 0;
let stxAgainst = 0;
let stxForUnnested = 0;
let stxAgainstUnnested = 0;
let stxPower = 0;
let stxPowerNested = 0;

let inited = false;
let inFavour = 0;
let winning = 'danger';

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
  csvMaker(csvVotes, 'nakamoto-solo-votes.csv')
}

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
    allVotes = (await findSoloVotes()).soloVotes;
    //if (newV) votes = newV.soloVotes.filter((o:VoteEvent) => o.amount > 0)
    if (includeZeros) {
      votes = allVotes
    } else {
      votes = allVotes.filter((o:VoteEvent) => o.amount > 0)
    }
  }
  showVotes = true
}

const analysisMode = () => {
  includeZeros = !includeZeros
  if (allVotes.length > 0)
  if (includeZeros) {
      votes = allVotes
  } else {
      votes = allVotes.filter((o:VoteEvent) => o.amount > 0)
  }
  let votesFor = summary.summary.find((o:any) => o._id.event === 'solo-vote' && o._id.for);
  let votesAgn = summary.summary.find((o:any) => o._id.event === 'solo-vote' && !o._id.for);
  if (includeZeros) {
    votesFor = summary.summaryWithZeros.find((o:any) => o._id.event === 'solo-vote' && o._id.for)
    votesAgn = summary.summaryWithZeros.find((o:any) => o._id.event === 'solo-vote' && !o._id.for)
  }
  stxFor = votesFor?.total || 0
  stxAgainst = votesAgn?.total || 0
  stxForUnnested = votesFor?.total || 0
  stxAgainstUnnested = votesAgn?.total || 0
  stxPower = stxForUnnested + stxAgainstUnnested
  stxPowerNested = stxFor + stxAgainst
  accountsFor = votesFor?.count || 0
  accountsAgainst = votesAgn?.count || 0
  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
  componentKey++
}

onMount(async () => {
  const stacksTipHeight = $sessionStore.stacksInfo?.stacks_tip_height | 0;
	const burnHeight = $sessionStore.stacksInfo?.burn_block_height | 0;
	DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposal);
  includeZeros = true // double negative here!
  analysisMode()
  inited = true
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
    {#if isCoordinator($sessionStore.keySets[CONFIG.VITE_NETWORK].stxAddress)}
    <a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => analysisMode() }>
      <Icon src="{InformationCircle}" mini class="ml-2 shrink-0 h-8 w-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" aria-hidden="true" id="analysis-label" />
    </a>
    {/if}
    <!--
    <a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => openAddressLookup() }>
      <Icon src="{MagnifyingGlassCircle}" mini class="ml-2 shrink-0 h-8 w-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" aria-hidden="true" id="search-label" />
    </a>
    -->
  </div>
</div>

  {#if showVotes}
  <!--
	<div class="grid grid-cols-2 w-full text-sm gap-x-8">
    <div class="">
      <p class="font-bold mt-3 mb-2">Explanation</p>
      <p class="">Pox-3 reward set data is read from the pox-3 
        contract and event stream over cycles 78 and 79. The data
        is indexed into a local database and matched against bitcoin vote transactions
        sent to the yes or no voting addresses.
      </p>
      <p class="font-semibold mt-3 mb-2">Vote counting</p>
      <p class="">The counting process sums all the stx controlled by a voting address
        in cycles 78 and 79. The voting power is taken as the mean value over the two
        cycles.
      </p>
    </div>
    <div class="">
      <p class="font-semibold mt-3 mb-2">Voting addresses</p>
      <p class="">Counting includes transactions sent from addresses derived from the
        same private key as the voting address but for practical purposes only those
        addresses linked by a single transaction to the voting address are
        taken into consideration. In some cases multiple votes txs were sent which resolve
        to an address that links to the same rewards slots - only the first tx 
        is counted in these cases.
      </p>
      <p class="font-semibold mt-3 mb-2">Stacking pools</p>
      <p class="">Voting addresses which wrap a stacking address enable pool
        operators to de-risk their holdings by distributing
        across multiple wallets. The stacks controlled by this type of wrapping 
        are excluded from the total counts as per the SIP.
      </p>
    </div>
  </div>
  -->
    <div class="grid grid-cols-6 w-full justify-evenly mt-6  border-b border-gray-300 pb-3 mb-3">
      <div class="col-span-2"><a href="/" class="pointer w-1/2" on:click|preventDefault={() => reorder('voter')}>Voter</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('amount')}>Power</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('burnBlockHeight')}>Height</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('for')}>For/Against</a></div>
      <div>
        <a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => download() }>to csv</a>
      </div>
    </div>
    {#key componentKey}
    {#each sortedEvents as item}
    <SoloResultsRow {item} />
    {/each}
    {/key}
  {/if}
  {#if showAddressLookup}
  <AddressLookup lookupMode={true} walletAddress={$sessionStore.keySets[CONFIG.VITE_NETWORK].stxAddress}/>
  {/if}
{/if}
