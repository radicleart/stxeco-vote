<script lang="ts">
import VotingResults from '$lib/components/dao/results/VotingResults.svelte';
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { onMount } from 'svelte';
import FormatUtils from '$lib/service/FormatUtils';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
import { getDaoVotesByProposal } from '$lib/dao_api';
	import VoteResultsRow from '../VoteResultsRow.svelte';

const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];

let daoVotes:Array<VoteEvent> = [];
export let proposal:ProposalEvent;

let showVotes = false;
let componentKey = 0;
const color = 'warning';
let sortDir = '';
let sortField = 'voter';
const reorder = (sf:string) => {
    sortField = sf;
    sortDir = (sortDir === '-') ? '' : '-';
    componentKey++;
}
const votes: any[] = []
let accountsFor = 0;
let accountsAgainst = 0;
let stxFor = 0;
let stxAgainst = 0;
let stxPower = 0;
const scrollTop = () => {
  const getMeTo = document.getElementById("page-header");
  if (getMeTo) getMeTo.scrollIntoView({behavior: 'smooth'});
}

let stacksTipHeight = 0;
let inFavour = 0;
let winning = 'danger';
onMount(async () => {
  stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
  DaoUtils.setStatus(stacksTipHeight, proposal);
  daoVotes = await getDaoVotesByProposal(proposal.contractId);
  if (daoVotes && daoVotes.length > 0) {
    daoVotes.forEach((o:any) => {
      if (o) votes.push(o)
      const amount = Number(o.amount)
      if (o.for) {
        accountsFor++;
        stxFor += amount
      } else {
        accountsAgainst++;
        stxAgainst += amount
      }
      stxPower += amount
    });
  }

  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
})

let txId: string;
$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

<VoteResultsRow {stxPower} {stxFor} {stxAgainst} {accountsFor} {accountsAgainst} />

  <div class="flex justify-start text-sm">
    <a href="/" class={'text-xs text-gray-400'} on:click|preventDefault={() => { showVotes = !showVotes }}>{#if !showVotes}show{:else}hide{/if} transactions</a>
  </div>

  {#if showVotes}
    <div class="grid grid-cols-4 w-full justify-evenly mt-5  border-b border-gray-300 pb-3 mb-3">
      <div class="col-span-2"><a href="/" class="pointer w-1/2" on:click|preventDefault={() => reorder('voter')}>Voter</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('amount')}>Power</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('for')}>For/Against</a></div>
    </div>
    {#key componentKey}
    {#each sortedEvents as item}
    <div class="grid grid-cols-4 w-full justify-evenly">
      <div class={(item.voter === account.stxAddress) ? 'col-span-2 text-success w-1/2 break-words' : 'col-span-2 break-words'} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}>{item.voter}</div>
      <div class="break-words">{@html ChainUtils.fromOnChainAmount(item.amount)}</div>
      <div class="break-words">{@html (item.for) ? '<span class="text-warning">for</span>' : 'against'}</div>
    </div>
    {/each}
    {/key}
{/if}
