<script lang="ts">
import { onMount } from 'svelte';
import { poolStackerAddresses } from '../vote_helper';
import { CONFIG } from '$lib/config';
import Invoice from './Invoice.svelte';

let yesAddress:string;
let noAddress:string;

const doClicked = () => {

}

onMount(async () => {
  const addresses = poolStackerAddresses(CONFIG.VITE_NETWORK)
  yesAddress = addresses.yAddress as string
  noAddress = addresses.nAddress as string
})

</script>
<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
  <h2 class="text-4xl">Voting for Community Pool Stackers</h2>
  <p class="text-warning-500">Send 0.000001 STX from your <span class="font-bold">stacking wallet</span></p>
  <p>Voters who are Stacking in a community pool must send a minimal amount of STX (~1 uSTX) 
    from their Stacking address to an address representing a ‘Yes to Nakamoto’ vote or an 
    address representing a ‘No to Nakamoto’’ vote.</p>
  <div class="w-full flex md:flex-row flex-col  gap-4">
    <div class=""><Invoice address={yesAddress} voteFor={true} /></div>
    <div class=""><Invoice address={noAddress} voteFor={false} /></div>
  </div>
</div>
