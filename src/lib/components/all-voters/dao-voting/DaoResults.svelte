<script lang="ts">
import VotingResults from '$lib/components/dao/results/VotingResults.svelte';
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { onMount } from 'svelte';
import FormatUtils from '$lib/service/FormatUtils';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
import { findDaoVotes } from '$lib/dao_api';
	import VoteResultsRow from '../VoteResultsRow.svelte';
	import type { ResultsSummary } from '$types/pox_types';
	import AddressLookup from '../AddressLookup.svelte';
	import VoteTransactions from '../VoteTransactions.svelte';

const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];

export let summary:ResultsSummary;
export let proposal:ProposalEvent;

let showVotes = false;
let componentKey = 0;
let sortDir = '';
let sortField = 'voter';
const reorder = (sf:string) => {
    sortField = sf;
    sortDir = (sortDir === '-') ? '' : '-';
    componentKey++;
}
let votes: Array<any> = []
let accountsFor = 0;
let accountsAgainst = 0;
let stxFor = 0;
let stxAgainst = 0;

const fetchTransactions = async () => {
  if (showVotes) {
    showVotes = false
    return
  }
 	if (votes.length === 0) {
    const newV = await findDaoVotes();
    if (newV) votes = newV.daoVotes
  }
  showVotes = true
}

let inFavour = 0;
let winning = 'danger';
onMount(async () => {
  const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
	const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
	DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposal);
  const votesFor = summary.summary.find((o) => o._id.event === 'vote' && o._id.for)
  const votesAgn = summary.summary.find((o) => o._id.event === 'vote' && !o._id.for)
  stxFor = votesFor?.total || 0
  stxAgainst = votesAgn?.total || 0
  accountsFor = votesFor?.count || 0
  accountsAgainst = votesAgn?.count || 0

  stxFor = summary.proposalData.votesFor
  stxAgainst = summary.proposalData.votesAgainst


  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
})

$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

<VoteResultsRow {stxFor} {stxAgainst} {accountsFor} {accountsAgainst} />

<div class="flex justify-between">
  <a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => fetchTransactions() }>{#if !showVotes}Show{:else}Hide{/if} transaction details</a>
</div>

{#if showVotes}
    {#key componentKey}
    <VoteTransactions {votes}/>
    {/key}
  {/if}
