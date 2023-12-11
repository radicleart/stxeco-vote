<script lang="ts">
import { onMount } from 'svelte';
import { soloStackerAddresses } from '../vote_helper';
import { CONFIG } from '$lib/config';
import Invoice from './Invoice.svelte';

let yesAddress:string;
let noAddress:string;

const doClicked = () => {

}

onMount(async () => {
  const addresses = soloStackerAddresses(CONFIG.VITE_NETWORK)
  yesAddress = addresses.yAddress as string
  noAddress = addresses.nAddress as string
})

</script>
<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
  <h2 class="text-4xl">Voting for Solo Stackers</h2>
  <p class="text-warning-500">Send a dust BTC transaction from your <span class="font-bold">bitcoin reward wallet</span></p>
  <p>Voters who are Stacking on their own must send a dust amount of BTC (~6,000 sats) from their 
    PoX reward address to an address representing a ‘Yes to Nakamoto’ vote or an address 
    representing a No to Nakamoto’ vote.</p>
  <div class="w-full flex md:flex-row flex-col  gap-4">
    <div class=""><Invoice address={yesAddress} voteFor={true} /></div>
    <div class=""><Invoice address={noAddress} voteFor={false} /></div>
  </div>
</div>
