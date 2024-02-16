<script lang="ts">
import DaoUtils from '$lib/service/DaoUtils';
import { onMount } from 'svelte';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
import VoteResultsRow from '../VoteResultsRow.svelte';
	import type { ResultsSummary } from '$types/pox_types';
	import { findPoolVotes } from '$lib/dao_api';
	import VoteTransactions from '../VoteTransactions.svelte';

export let summary:ResultsSummary;
export let proposal:ProposalEvent;

let votes: Array<VoteEvent> = []

let showVotes = false;
let componentKey = 0;

const fetchTransactions = async () => {
  if (showVotes) {
    showVotes = false
    return
  }
  if (votes.length === 0) {
    const newV = await findPoolVotes();
    if (newV) votes = newV.poolVotes  //.filter((o:VoteEvent) => o.amount > 0)
  }
  showVotes = true
}

let accountsFor = 0;
let accountsAgainst = 0;
let stxFor = 0;
let stxAgainst = 0;
let stxPower = 0;

let inited = false;
let inFavour = 0;
let winning = 'danger';

onMount(async () => {
  const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
	const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
	DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposal);

  const votesFor = summary.summary.find((o) => o._id.event === 'pool-vote' && o._id.for)
  const votesAgn = summary.summary.find((o) => o._id.event === 'pool-vote' && !o._id.for)
  stxFor = votesFor?.total || 0
  stxAgainst = votesAgn?.total || 0
  stxPower = stxFor + stxAgainst
  accountsFor = votesFor?.count || 0
  accountsAgainst = votesAgn?.count || 0

  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
  inited = true;
})

</script>

{#if inited}
<VoteResultsRow {stxFor} {stxAgainst} {accountsFor} {accountsAgainst} />

<div class="flex justify-start">
  <a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => fetchTransactions() }>{#if !showVotes}Show{:else}Hide{/if} transaction details</a>
</div>

  {#if showVotes}
    {#key componentKey}
    <VoteTransactions {votes}/>
    {/key}
  {/if}
{/if}
