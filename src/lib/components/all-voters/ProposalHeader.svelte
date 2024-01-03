<script lang="ts">
import type { ProposalEvent } from '$types/stxeco.type';
import { goto } from '$app/navigation';
import { Button } from 'flowbite-svelte'
import Preamble from '$lib/components/all-voters/Preamble.svelte';
import { sbtcConfig } from '$stores/stores';
import { openContractCall } from '@stacks/connect';
import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
import { CONFIG } from '$lib/config';
	import { explorerTxUrl } from '$lib/utils';

export let proposalEvent: ProposalEvent;
let showPreamble = false;
let txId:string|undefined;
let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
const proposalData = proposalEvent.proposalData || { votesFor: 0, votesAgainst: 0, concluded: false, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }

const concludeVote = async () => {
    const deployer = CONFIG.VITE_DOA_DEPLOYER;
    const proposalCV = contractPrincipalCV(proposalEvent.contractId.split('.')[0], proposalEvent.contractId.split('.')[1])
    await openContractCall({
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: proposalEvent.votingContract.split('.')[1],
        functionName: 'conclude',
        functionArgs: [proposalCV],
        onFinish: data => {
          txId = data.txId
          console.log('finished contract call!', data);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
}
</script>

<div class="flex flex-col gap-y-1">
  <h1 class={'text-primary-500 text-4xl'}>
    {proposalEvent.proposalMeta?.title || 'Unknown'}
  </h1>
  <div class="mb-5">
    <p class="flex justify-between gap-x-5 text-sm text-gray-600">      
      <a class="inline " href="/" on:click|preventDefault={() => showPreamble = !showPreamble}>{#if showPreamble}&lt;{:else}&gt;{/if} proposal details</a>
      <!-- <a class="inline " href="/" on:click={() => goto(`/dao/proposals/${proposalEvent.contractId}`)}>results</a> -->
    </p>
  </div>
  {#if showPreamble}
  <div class="w-full flex-col gap-y-2">
    <div class="flex flex-col border-[0.5px] border-gray-500 rounded-lg p-2 sm:p-5 overflow-hidden bg-gray-1000">
      <div class="mt-4"><Preamble proposal={proposalEvent} /></div>
    </div>
  </div>
  {/if}
</div>
