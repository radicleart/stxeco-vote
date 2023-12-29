<script lang="ts">
import VotingResults from '$lib/components/dao/results/VotingResults.svelte';
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { onMount } from 'svelte';
import FormatUtils from '$lib/service/FormatUtils';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
import ChevronDown from '$lib/components/shared/ChevronDown.svelte';
import ChevronUp from '$lib/components/shared/ChevronUp.svelte';

export let proposal:ProposalEvent;
const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
let soloVotes:Array<VoteEvent>|undefined;

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
let totalAccountsFor = 0;
let totalAccountsAgainst = 0;
let totalVotePower = (proposal.proposalData) ? FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(proposal.proposalData.votesFor + proposal.proposalData.votesAgainst))) : 0;

let stacksTipHeight = 0;
let inFavour = 0;
let winning = 'danger';
onMount(async () => {
  stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
  DaoUtils.setStatus(stacksTipHeight, proposal);
  soloVotes = $sbtcConfig.soloPoolData?.soloVotes
  if (soloVotes && soloVotes.length > 0) {
    soloVotes.forEach((o:any) => {
      if (o) votes.push(o)
      if (o.for) {
        totalAccountsFor++;
      } else {
        totalAccountsAgainst++;
      }
    });
  }

  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
})

$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

{#if soloVotes}
  <div class="row">
    <h1 class={'text-' + color}><span>Method 3: Liquid STX Balance</span></h1>
    <h4 class="text-white">Total voting power is <span class="text-warning">{totalVotePower}</span> with votes cast from <span class="text-warning">{soloVotes.length}</span> accounts.</h4>
    <div class="cols-12 text-white">Voting now closed.</div>
  </div>
  <div class="bg-card py-4 px-5 mb-3">
    <VotingResults {proposal} totalAccountsAgainst={totalAccountsAgainst} totalAccountsFor={totalAccountsFor}/>
  </div>
  <div class="flex justify-end text-sm">
      <a href="/" class={'text-white'} on:click|preventDefault={() => { showVotes = !showVotes }}>{#if showVotes}<ChevronUp class="inline w-[15px]" />{:else}<ChevronDown class="inline w-[15px]" />{/if} transactions</a>
  </div>
  
  {#if showVotes}
    <div class="grid grid-cols-4 w-full justify-evenly">
      <div class="col-span-2"><a href="/" class="pointer w-1/2" on:click|preventDefault={() => reorder('voter')}>{#if sortDir}<ChevronUp class={'inline w-[10px]'} />{:else}<ChevronDown class={'inline w-[10px]'} />{/if} Voter</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('amount')}>{#if sortDir}<ChevronUp class={'inline w-[10px]'} />{:else}<ChevronDown class={'inline w-[10px]'} />{/if} Power</a></div>
      <div><a href="/" class="pointer" on:click|preventDefault={() => reorder('for')}>{#if sortDir}<ChevronUp class={'inline w-[10px]'} />{:else}<ChevronDown class={'inline w-[10px]'} />{/if} For/Against</a></div>
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
{/if}
