<script lang="ts">
import VotingResults from '$lib/components/dao/results/VotingResults.svelte';
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { goto } from '$app/navigation';
import { Icon } from "svelte-hero-icons"
import { onMount } from 'svelte';
import FormatUtils from '$lib/service/FormatUtils';
	import { CONFIG } from '$lib/config';
	import { sbtcConfig } from '$stores/stores';
	import type { ProposalEvent } from '$types/stxeco.type';
	import ChevronDown from '$lib/components/shared/ChevronDown.svelte';
	import ChevronUp from '$lib/components/shared/ChevronUp.svelte';
	import ArrowUpRight from '$lib/components/shared/ArrowUpRight.svelte';

const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];

export let contractEvents:any;
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
let totalAccountsFor = 0;
let totalAccountsAgainst = 0;
let totalVotePower = (proposal.proposalData) ? FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(proposal.proposalData.votesFor + proposal.proposalData.votesAgainst))) : 0;
contractEvents.forEach((o:any) => {
  if (o.voteEvent) votes.push(o.voteEvent)
  if (o.voteEvent.for) {
    totalAccountsFor++;
  } else {
    totalAccountsAgainst++;
  }
  //totalVotePower += o.voteEvent.amount;
});
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

  inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
  if (inFavour > 80) {
    winning = 'success';
  }
})

let txId: string;
$: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;
$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

<section class="bg-card my-5 p-4">
  <div class="row">
    <div class="cols-12">
      <h1 class={'text-' + color}><span>Method 3: Liquid STX Balance</span>
        <span class="css-1wdxw4w"><svg viewBox="0 0 812 812" focusable="false" class="chakra-icon css-1wdxw4w"><path fill-rule="evenodd" clip-rule="evenodd" d="M406 812C630.228 812 812 630.228 812 406C812 181.772 630.228 0 406 0C181.772 0 0 181.772 0 406C0 630.228 181.772 812 406 812ZM583 394.451V351.353H477.186L551.494 239H495.317L405.851 374.536L316.683 239H260.506L334.814 351.353H229V394.748H583V394.451ZM550.305 593L475.106 479.161H583V436.36H229V479.458H336.894L261.695 593H317.574L405.851 459.247L494.128 593H550.305Z" fill="white"></path></svg></span>
      </h1>
    </div>
    <div class="cols-12"><h4 class="text-white">Total voting power is <span class="text-warning">{totalVotePower}</span> with votes cast from <span class="text-warning">{contractEvents.length}</span> accounts.</h4></div>
    <div class="cols-12"><p class="text-white">Voting now closed.</p></div>
  </div>
  <div class="bg-card py-4 px-5 mb-3">
    <VotingResults {proposal} totalAccountsAgainst={totalAccountsAgainst} totalAccountsFor={totalAccountsFor}/>
  </div>
  <div class="row">
    <div class="cols-12 text-end my-3">
      <p class="w-100 text-right">
        <a href="/" class={'text-white'} on:click|preventDefault={() => { showVotes = !showVotes }}>{#if showVotes}<ChevronDown />{:else}<ChevronUp />{/if} transactions</a>
        <a href="/" class="pointer text-akrobat-thin" on:click|preventDefault={() => scrollTop()}><img class="mx-2" src="/img/png-assets/stx_eco_arrow_up.png" alt="Scroll down" width="20" height="auto" /></a>
      </p>
    </div>
  </div>
  
  {#if showVotes}
  <div class="row">
    <div class="cols-12 my-3">
      <table class="table text-white">
        <thead>
          <tr>
            <th scope="col" class="pointer" on:click={() => reorder('voter')}>{#if sortDir}<ArrowUpRight target={'#'} class={''} />{:else}<ArrowUpRight target={'#'} class={''} />{/if} Voter</th>
            <th scope="col" class="pointer" on:click={() => reorder('amount')}>{#if sortDir}<ArrowUpRight target={'#'} class={''} />{:else}<ArrowUpRight target={'#'} class={''} />{/if} Power</th>
            <th scope="col" class="pointer" on:click={() => reorder('for')}>{#if sortDir}<ArrowUpRight target={'#'} class={''} />{:else}<ArrowUpRight target={'#'} class={''} />{/if} For/Against</th>
          </tr>
        </thead>
        <tbody>
      {#key componentKey}
      {#each sortedEvents as item}
        <tr>
        <th scope="row" class={(item.voter === account.stxAddress) ? 'text-success' : ''} title={(item.voter === account.stxAddress) ? 'I voted!' : ''}>{item.voter}</th>
        <td class="py-3">{@html ChainUtils.fromOnChainAmount(item.amount)}</td>
        <td class="py-3">{@html (item.for) ? '<span class="text-warning">for</span>' : 'against'}</td>
      </tr>
      {/each}
      {/key}
  </tbody>
</table>
</div>
</div>
{/if}
</section>

<style>
  h1 {
    font-size: 1.8rem;
  }
section {
}
.part0 {
  font-size: 1.2rem;
  font-weight: 700;
}
.part1 {
  font-size: 1.2rem;
  font-weight: 700;
}
.text-big {
    font-size: 2.0rem;
}
.css-1wdxw4w {
    width: 2.0rem;
    height: 2.0rem;
    display: inline-block;
    line-height: 1em;
    flex-shrink: 0;
    color: rgb(85, 70, 255);
    vertical-align: middle;
    margin-inline-start: 2px;
}

</style>
