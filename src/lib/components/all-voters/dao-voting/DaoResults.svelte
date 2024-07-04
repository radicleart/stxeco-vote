<script lang="ts">
  import DaoUtils from '$lib/service/DaoUtils';
  import { onMount } from 'svelte';
  import { sessionStore } from '$stores/stores';
  import { findDaoVotes } from '$lib/dao_api';
	import VoteResultsRow from '../VoteResultsRow.svelte';
	import VoteTransactions from '../VoteTransactions.svelte';
	import type { ResultsSummary, VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';

  export let summary:ResultsSummary;
  export let proposal:VotingEventProposeProposal|undefined;

  let showVotes = false;
  let componentKey = 0;
  let sortDir = '';
  let sortField = 'voter';
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
    const votesFor = summary.summary.find((o) => o._id.event === 'vote' && o._id.for)
    const votesAgn = summary.summary.find((o) => o._id.event === 'vote' && !o._id.for)
    stxFor = votesFor?.total || 0
    stxAgainst = votesAgn?.total || 0
    accountsFor = votesFor?.count || 0
    accountsAgainst = votesAgn?.count || 0

    stxFor = summary.proposalData.votesFor
    stxAgainst = summary.proposalData.votesAgainst


    inFavour = (proposal?.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
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
<div class="mt-6 w-1/2">
  <p>
    <span class="text-sm">
      Vote stacks transactions sent to the stx.eco DAO contract are 
      counted - any stacks holder is able to vote with a voting power
      up to the liquid balance of their account(s) at the stacks block height when
      voting began.
    </span>
  </p>
</div>
  {#key componentKey}
    <VoteTransactions {votes}/>
    {/key}
  {/if}
