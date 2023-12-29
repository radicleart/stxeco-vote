<script lang="ts">
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import Invoice from './Invoice.svelte';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent } from '$types/stxeco.type';
import { Button } from 'flowbite-svelte';
import { openSTXTransfer } from '@stacks/connect';
import { goto } from '$app/navigation';

export let proposalEvent: ProposalEvent;

let yesAddress:string;
let noAddress:string;
let showStxTransfer = false;
let txId: string;

const castVote = async (vfor:boolean) => {
  await openSTXTransfer({
    amount: '1',
    recipient: (vfor) ? yesAddress : noAddress,
      onFinish: data => {
        txId = data.txId
        console.log('finished contract call!', data);
        localStorage.setItem('VOTED_FLAG', JSON.stringify(proposalEvent.contractId));
        goto(`/dao/voting/badge/${proposalEvent.contractId}`);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
  });
}

onMount(async () => {
  const addresses = $sbtcConfig.soloPoolData?.poolAddresses!
  yesAddress = addresses.yAddress as string
  noAddress = addresses.nAddress as string
})
</script>
<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
  <h2 class="text-2xl">Voting for Community Pool Stackers</h2>
  <p class="text-warning-500">Send 0.000001 STX from your <span class="font-bold">stacking wallet</span></p>
  <p>Voters who are Stacking in a community pool must send a minimal amount of STX (~1 uSTX) 
    from their Stacking address to an address representing a ‘Yes to Nakamoto’ vote or an 
    address representing a ‘No to Nakamoto’’ vote.</p>
    <div class="flex justify-between">
      <p class="w-full break-words">If stacking with web wallet address {($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)}
      <a class="text-primary-500 break-words" href="/" on:click|preventDefault={() => showStxTransfer = !showStxTransfer}>click here</a></p>
    </div>
    {#if !showStxTransfer}
    <div class="w-full flex lg:flex-row flex-col  gap-4">
      <div class=""><Invoice address={yesAddress} voteFor={true} /></div>
      <div class=""><Invoice address={noAddress} voteFor={false} /></div>
    </div>
    {:else}
    <div class="flex justify-around">
      <div>
        <Button on:click={() => {castVote(true)}} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 font-normal text-black rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
          Yes to Nakamoto
        </Button>
      </div>
      <div>
        <Button on:click={() => {castVote(false)}} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-danger-01 px-4 py-2 font-normal text-black rounded-xl border border-danger-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
          No to Nakamoto
        </Button>
      </div>
    </div>
    {/if}
  </div>
