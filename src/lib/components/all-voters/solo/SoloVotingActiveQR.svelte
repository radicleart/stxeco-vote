<script lang="ts">
  import { onMount } from 'svelte';
  import Invoice from './Invoice.svelte';
  import { sbtcConfig } from '$stores/stores';
  import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
  import SoloResults from './SoloResults.svelte';

  export let proposal: ProposalEvent;
  let yesAddress:string;
  let noAddress:string;
  let showSourceModal: boolean;

  onMount(async () => {
    const addresses = $sbtcConfig.soloPoolData?.soloAddresses!
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



<!-- <div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
	<div class="flex justify-between">
    <h2 class="text-2xl">Voting for Solo Stackers</h2>
		<a href="/" on:click|preventDefault={() => showSourceModal = !showSourceModal}>show results</a>
	</div>
  <p class="text-warning-500">Send a dust BTC transaction from your bitcoin reward wallet</p>
  <p>Voters who are Stacking on their own must send a dust amount of BTC (~6,000 sats) from their
    PoX reward address to an address representing a ‘Yes to Nakamoto’ vote or an address
    representing a No to Nakamoto’ vote.</p>
  <div class="w-full flex md:flex-row flex-col  gap-4">
    <div><Invoice address={yesAddress} voteFor={true} /></div>
    <div><Invoice address={noAddress} voteFor={false} /></div>
  </div>
</div> -->

<!-- {#if showSourceModal}
  <div>
    <SoloResults proposal={proposalEvent} />
  </div>
{/if} -->
