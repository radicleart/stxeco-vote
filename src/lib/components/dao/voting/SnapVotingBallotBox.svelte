<script lang="ts">
import { PostConditionMode } from 'micro-stacks/transactions';
import ChainUtils from '$lib/service/ChainUtils';
import DaoUtils from '$lib/service/DaoUtils';
import { goto } from "$app/navigation";
import FormatUtils from '$lib/service/FormatUtils';
import {tick, onMount} from 'svelte';
import { CONFIG } from '$lib/config';
import { contractPrincipalCV, falseCV, trueCV, uintCV } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import type { ProposalEvent } from '$types/stxeco.type';
import { sbtcConfig } from '$stores/stores';
import { Button } from 'flowbite-svelte'
	import { getStacksNetwork } from '$lib/stacks_connect';

export let proposalEvent: ProposalEvent;
export let balanceAtHeight:number = 0;

let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height || 0;
const proposalData = proposalEvent.proposalData || { votesFor: 0, votesAgainst: 0, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }
DaoUtils.setStatus(stacksTipHeight, proposalEvent);
const propStatus = proposalEvent.status?.name;

let errorMessage:string|undefined;
let txId: string;
$: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;

$: amount = balanceAtHeight;
const castVote = async (vfor:boolean) => {
    const deployer = CONFIG.VITE_DOA_DEPLOYER;
    if (amount === 0 || amount < 1 ) {
      errorMessage = 'Minimum voting power is 1 STX';
      return;
    }
    if (amount > balanceAtHeight) {
      errorMessage = 'Maximum voting power is ' + balanceAtHeight + ' STX';
      return;
    }
    let forCV = trueCV()
    if (!vfor) {
      forCV = falseCV()
    }
    // const amountUSTX = ChainUtils.toOnChainAmount(amount)
    const amountUSTX = ChainUtils.toOnChainAmount(amount)
    const amountCV = uintCV(amountUSTX)
    const proposalCV = contractPrincipalCV(proposalEvent.contractId.split('.')[0], proposalEvent.contractId.split('.')[1])
    await openContractCall({
        network: getStacksNetwork(),
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: proposalEvent.votingContract.split('.')[1],
        functionName: 'vote',
        functionArgs: [amountCV, forCV, proposalCV],
        onFinish: data => {
          txId = data.txId
          console.log('finished contract call!', data);
          //ChainUtils.updateVoters();
          localStorage.setItem('VOTED_FLAG', JSON.stringify(proposalEvent.contractId));
          goto(`/dao/voting/badge/${proposalEvent.contractId}`);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
}

$: canVote = propStatus === 'voting' && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight;
if (balanceAtHeight === 0 || balanceAtHeight < 1) {
  canVote = false;
}
if (proposalEvent.contractId.indexOf('edp015-sip-015-activation') > -1) {
  canVote = false;
}
onMount(async () => {
  await tick();
  amount = balanceAtHeight;
})

</script>

{#if canVote}
<div class="" >
  <div class="flex justify-center">
    <!--
    <h4  class={'text-2xl mb-5 text-' + proposalEvent.status?.color}>Cast Your Vote</h4>
    <div class="text-sm">
      <p>Enter the voting power and cast your vote.</p>
      <p>Your voting power is the balance you had in the account when voting started - you can vote with anything up to this amount (the minimum voting power is 1 stx). 
      </p>
    </div>
    -->
    {#if !txId}
    <div class="flex flex-col gap-y-5 w-full md:w-1/2">
        <div class="flex flex-col gap-y-1">
          <div class="w-full flex justify-center">
            <input class="w-1/2 rounded-lg p-2 text-black border-gray-800" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"/>
          </div>
          {#if amount < balanceAtHeight}
          <div class="d-flex justify-content-end form-text text-small">
            <a class="text-white" href="/" on:click|preventDefault={() => {amount = balanceAtHeight; errorMessage = undefined}}><u>maximum voting power</u></a>
          </div>
          {/if}
          <p class="text-sm mt-5">
            Your snapshot balance at block <span class="text-bold">{FormatUtils.fmtNumber(proposalEvent.proposalData?.startBlockHeight)}</span> was <span class="text-bold">{balanceAtHeight}</span> STX.
          </p>
        </div>
      {#if balanceAtHeight >= 1}
      <div class="flex justify-around">
        <div>
          <button on:click={() => {errorMessage = undefined; castVote(true)}} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 font-normal rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
            Yes to Nakamoto
          </button>
        </div>
        <div>
          <button on:click={() => {errorMessage = undefined; castVote(false)}} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-danger-01 px-4 py-2 font-normal rounded-xl border border-danger-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
            No to Nakamoto
          </button>
        </div>
      </div>
      {:else}
      <div class="mt-3 text-small text-danger  text-center">Not enough balance in this account - must be at least 1 stx</div>
      {/if}
      {#if errorMessage}
        <div class="mt-3 text-small text-danger  text-center">{errorMessage}</div>
      {/if}
    </div>
    {:else}
    <div class="my-5">
      <div>Your vote is being counted - thank you.</div>
      <div><a href={explorerUrl} target="_blank">Track progress on the explorer</a></div>
    </div>
    {/if}
  </div>
</div>
{:else}
  {#if propStatus === 'concluded' || propStatus === 'voting ended'}
    <div class="bg-card p-5 text-white" >
      <div class="row">
        <h4  class={'text-' + proposalEvent.status?.color}>Voting Over</h4>
        <div class="text-small">Voting window on this proposal has closed.</div>
      </div>
    </div>
  {:else if propStatus === 'commencing soon' || propStatus === 'voting'}
    <div></div>
  {:else if propStatus !== 'failed' && propStatus !== 'passed'}
    <div class="bg-card p-5 text-white" >
      <div class="row">
        <h4  class={'text-' + proposalEvent.status?.color}>Unable to to Vote</h4>
        <div class="text-small">Need at least 1 STX in your account at time proposal was submitted.</div>
      </div>
    </div>
  {/if}
{/if}

<style>
</style>
