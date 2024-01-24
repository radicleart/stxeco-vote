<script lang="ts">
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import Invoice from './Invoice.svelte';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent } from '$types/stxeco.type';
import { Button } from 'flowbite-svelte';
import { openSTXTransfer } from '@stacks/connect';
import { goto } from '$app/navigation';

export let proposal: ProposalEvent;

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
        localStorage.setItem('VOTED_FLAG', JSON.stringify(proposal.contractId));
        goto(`/dao/voting/badge/${proposal.contractId}`);
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
<div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
  <Invoice address={yesAddress} voteFor={true} />

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="absolute left-1/2 -translate-x-1/2 bottom-0 w-[360px] h-auto" viewBox="0 0 360 212">
    <mask id="mask0_105_5377" width="374" height="212" x="-6" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
      <g stroke="#fff" clip-path="url(#clip0_105_5377)">
        <path d="M319.5 212V0M271.5 212V0M223.5 212V0M175.5 212V0M127.5 212V0M79.5 212V0M31.5 212V0"/>
      </g>
    </mask>
    <g mask="url(#mask0_105_5377)">
      <mask id="mask1_105_5377" width="374" height="212" x="-6" y="0" maskUnits="userSpaceOnUse" style="mask-type:luminance">
        <rect width="374" height="212" x="368" y="212" fill="url(#paint0_linear_105_5377)" rx=".01" transform="rotate(180 368 212)"/>
      </mask>
      <g mask="url(#mask1_105_5377)">
        <path fill="#131416" fill-opacity=".08" d="M368 212H-6V0h374z"/>
      </g>
    </g>
    <defs>
      <linearGradient id="paint0_linear_105_5377" x1="555" x2="555" y1="212" y2="424" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fff"/>
        <stop offset="1"/>
      </linearGradient>
      <clipPath id="clip0_105_5377">
        <path fill="#fff" d="M368 212H-6V0h374z"/>
      </clipPath>
    </defs>
  </svg>
</div>

<div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
  <Invoice address={noAddress} voteFor={false} />

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="absolute left-1/2 -translate-x-1/2 bottom-0 w-[360px] h-auto" viewBox="0 0 360 212">
    <mask id="mask0_105_5377" width="374" height="212" x="-6" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
      <g stroke="#fff" clip-path="url(#clip0_105_5377)">
        <path d="M319.5 212V0M271.5 212V0M223.5 212V0M175.5 212V0M127.5 212V0M79.5 212V0M31.5 212V0"/>
      </g>
    </mask>
    <g mask="url(#mask0_105_5377)">
      <mask id="mask1_105_5377" width="374" height="212" x="-6" y="0" maskUnits="userSpaceOnUse" style="mask-type:luminance">
        <rect width="374" height="212" x="368" y="212" fill="url(#paint0_linear_105_5377)" rx=".01" transform="rotate(180 368 212)"/>
      </mask>
      <g mask="url(#mask1_105_5377)">
        <path fill="#131416" fill-opacity=".08" d="M368 212H-6V0h374z"/>
      </g>
    </g>
    <defs>
      <linearGradient id="paint0_linear_105_5377" x1="555" x2="555" y1="212" y2="424" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fff"/>
        <stop offset="1"/>
      </linearGradient>
      <clipPath id="clip0_105_5377">
        <path fill="#fff" d="M368 212H-6V0h374z"/>
      </clipPath>
    </defs>
  </svg>
</div>

<!--
<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
  <h2 class="text-2xl">Voting for Community Pool Stackers</h2>
  <p class="text-warning-500">Send 0.000001 STX from your <span>stacking wallet</span></p>
  <p>Voters who are Stacking in a community pool must send a minimal amount of STX (~1 uSTX)
    from their Stacking address to an address representing a ‘Yes to Nakamoto’ vote or an
    address representing a ‘No to Nakamoto’’ vote.</p>
    <div class="flex justify-between">
      <p class="w-full break-words">If stacking with web wallet address {($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)}
      <a class="text-primary-500 break-words" href="/" on:click|preventDefault={() => showStxTransfer = !showStxTransfer}>click here</a></p>
    </div>
    {#if !showStxTransfer}
    <div class="w-full flex lg:flex-row flex-col  gap-4">
      <div><Invoice address={yesAddress} voteFor={true} /></div>
      <div><Invoice address={noAddress} voteFor={false} /></div>
    </div>
    {:else}
    <div class="flex justify-around">
      <div>
        <Button on:click={() => {castVote(true)}} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2  text-black rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
          Yes to Nakamoto
        </Button>
      </div>
      <div>
        <Button on:click={() => {castVote(false)}} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-danger-01 px-4 py-2  text-black rounded-xl border border-danger-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
          No to Nakamoto
        </Button>
      </div>
    </div>
    {/if}
  </div>
-->