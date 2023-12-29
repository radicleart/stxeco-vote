<script lang="ts">
import { onMount } from 'svelte';
import Invoice from './Invoice.svelte';
import { sbtcConfig } from '$stores/stores';
import type { ProposalEvent, VoteEvent } from '$types/stxeco.type';
import SoloResults from './SoloResults.svelte';

export let proposalEvent: ProposalEvent;
let yesAddress:string;
let noAddress:string;
let showSourceModal: boolean;

onMount(async () => {
  const addresses = $sbtcConfig.soloPoolData?.soloAddresses!
  yesAddress = addresses.yAddress as string
  noAddress = addresses.nAddress as string
})

</script>
<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
	<div class="flex justify-between">
    <h2 class="text-2xl">Voting for Solo Stackers</h2>
		<a href="/" on:click|preventDefault={() => showSourceModal = !showSourceModal}>show results</a>
	</div>
  <p class="text-warning-500">Send a dust BTC transaction from your <span class="font-bold">bitcoin reward wallet</span></p>
  <p>Voters who are Stacking on their own must send a dust amount of BTC (~6,000 sats) from their 
    PoX reward address to an address representing a ‘Yes to Nakamoto’ vote or an address 
    representing a No to Nakamoto’ vote.</p>
  <div class="w-full flex md:flex-row flex-col  gap-4">
    <div class=""><Invoice address={yesAddress} voteFor={true} /></div>
    <div class=""><Invoice address={noAddress} voteFor={false} /></div>
  </div>
</div>
{#if showSourceModal}
<div>
  <SoloResults proposal={proposalEvent} />
</div>
{/if}
