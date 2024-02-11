<script lang="ts">
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import Invoice from './Invoice.svelte';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent } from '$types/stxeco.type';
import { openSTXTransfer } from '@stacks/connect';
import { goto } from '$app/navigation';
import NakamotoResultsBackground from '$lib/components/shared/NakamotoResultsBackground.svelte';
	import { getStacksNetwork, loggedIn } from '$lib/stacks_connect';

export let proposal: ProposalEvent;

let yesAddress:string;
let noAddress:string;
let showStxTransfer = true;
let txId: string;
let errorMessage: string|undefined;
let vforCurrent: boolean;

const castVote = async (vfor:boolean) => {
  if (!loggedIn()) {
    vforCurrent = vfor
    errorMessage = 'Please connect your wallet to vote';
    return;
  }
  await openSTXTransfer({
    amount: '1',
    network: getStacksNetwork(),
    recipient: (vfor) ? yesAddress : noAddress,
      onFinish: data => {
        txId = data.txId
        console.log('finished contract call!', data);
        localStorage.setItem('VOTED_FLAG', JSON.stringify(proposal.contractId));
        localStorage.setItem('VOTED_TXID_2', txId);
        goto(`/dao/proposals/${proposal.contractId}/badge`);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
  });
}

onMount(async () => {
  const addresses = $sbtcConfig.soloPoolData?.poolAddresses!
  const locked = $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stacksTokenInfo?.stx?.locked
  if (locked && locked > 0) showStxTransfer = true
  yesAddress = addresses.yAddress as string
  noAddress = addresses.nAddress as string

})
</script>

{#if showStxTransfer}
  <div class="p-8 bg-[#F4F3F0] rounded-2xl">
    <Invoice address={yesAddress} voteFor={true} />
    <button on:click={() => {castVote(true)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
      Vote yes
    </button>
    {#if errorMessage && vforCurrent}
    <div class="mt-3 w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
  </div>

  <div class="p-8 bg-[#F4F3F0] rounded-2xl">
    <Invoice address={noAddress} voteFor={false} />
    <button on:click={() => {castVote(false)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
      Vote no
    </button>
    {#if errorMessage && !vforCurrent}
    <div class="mt-3 w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
  </div>
{:else}
  <div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
    <Invoice address={yesAddress} voteFor={true} />
    <NakamotoResultsBackground />
  </div>

  <div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
    <Invoice address={noAddress} voteFor={false} />
    <NakamotoResultsBackground />
  </div>
{/if}
