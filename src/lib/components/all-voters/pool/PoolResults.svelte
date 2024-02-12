<script lang="ts">
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { onMount } from 'svelte';
import FormatUtils from '$lib/service/FormatUtils';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
import VoteResultsRow from '../VoteResultsRow.svelte';

export let poolVotes:Array<VoteEvent> = [];
export let proposal:ProposalEvent;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];

let showVotes = false;
let componentKey = 0;
let sortDir = '';
let sortField = 'voter';
const reorder = (sf:string) => {
    sortField = sf;
    sortDir = (sortDir === '-') ? '' : '-';
    componentKey++;
}
const votes: any[] = []
let totalVotePower = (proposal.proposalData) ? FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(proposal.proposalData.votesFor + proposal.proposalData.votesAgainst))) : 0;
let accountsFor = 0;
let accountsAgainst = 0;
let stxFor = 0;
let stxAgainst = 0;
let stxPower = 0;

let stacksTipHeight = 0;
let inFavour = 0;
let winning = 'danger';
onMount(async () => {
  const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
	const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
	DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposal);
  if (poolVotes && poolVotes.length > 0) {
    poolVotes.forEach((o:any) => {
      if (o) votes.push(o)
      if (o.for) {
        accountsFor++;
        stxFor += (o.amount === 0) ? 100 : o.amount
      } else {
        accountsAgainst++;
        stxAgainst += (o.amount === 0) ? 100 : o.amount
      }
      stxPower += (o.amount === 0) ? 100 : o.amount
    });
  }

  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
})

$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

{#if poolVotes}
<VoteResultsRow {stxPower} {stxFor} {stxAgainst} {accountsFor} {accountsAgainst} />

  <div class="flex justify-start text-sm">
    <a href="/" class={'text-xs text-gray-400'} on:click|preventDefault={() => { showVotes = !showVotes }}>{#if !showVotes}show{:else}hide{/if} transactions</a>
  </div>

  {#if showVotes}
    <div class="grid grid-cols-4 w-full justify-evenly mt-5  border-b border-gray-300 pb-3 mb-3">
      <div class="col-span-2"><a href="/" class="pointer w-1/2" on:click|preventDefault={() => reorder('voter')}>Voter</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('for')}>For/Against</a></div>
    </div>
    {#key componentKey}
    {#each sortedEvents as item}
    <div class="grid grid-cols-4 w-full justify-evenly">
      <div class={(item.voter === account.stxAddress) ? 'col-span-2 text-success w-1/2 break-words' : 'col-span-2 break-words'} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}>{item.voter}</div>
      <div class="break-words">{@html (item.for) ? '<span class="text-warning">for</span>' : 'against'}</div>
    </div>
    {/each}
    {/key}
  {/if}
{/if}
