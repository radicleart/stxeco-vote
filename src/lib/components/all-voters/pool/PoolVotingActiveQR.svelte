<script lang="ts">
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import Invoice from './Invoice.svelte';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent } from '$types/stxeco.type';
import { openSTXTransfer } from '@stacks/connect';
import { goto } from '$app/navigation';
import NakamotoResultsBackground from '$lib/components/shared/NakamotoResultsBackground.svelte';

export let proposal: ProposalEvent;

let yesAddress:string;
let noAddress:string;
let showStxTransfer = true;
let txId: string;

const castVote = async (vfor:boolean) => {
  await openSTXTransfer({
    amount: '1',
    recipient: (vfor) ? yesAddress : noAddress,
      onFinish: data => {
        txId = data.txId
        console.log('finished contract call!', data);
        localStorage.setItem('VOTED_FLAG', JSON.stringify(proposal.contractId));
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
  <div class="flex justify-around">
    <div>
      <button on:click={() => {castVote(true)}} class="w-full cursor-pointer md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2  text-white bg-black rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
        Vote yes
      </button>
    </div>
  </div>
</div>

<div class="p-8 bg-[#F4F3F0] rounded-2xl">
  <Invoice address={noAddress} voteFor={false} />
  <div class="flex justify-around z-50">
    <div>
      <button on:click={() => {castVote(false)}} class="w-full cursor-pointer md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2  text-white bg-black rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
        Vote no
      </button>
    </div>
  </div>
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

