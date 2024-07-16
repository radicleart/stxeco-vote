<script lang="ts">
  import { onMount } from 'svelte';
  import Invoice from './Invoice.svelte';
	import NakamotoResultsBackground from '$lib/ui/NakamotoResultsBackground.svelte';
	import type { StackerProposalData } from '@mijoco/stx_helpers';

  export let addresses:StackerProposalData;

  let yesAddress:string;
  let noAddress:string;
  let inited = false;


  onMount(async () => {
    yesAddress = addresses.bitcoinAddressYes as string
    noAddress = addresses.bitcoinAddressNo as string
    inited = true
  })
</script>

{#if inited}

<div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
  <Invoice address={yesAddress} voteFor={true} />
  <NakamotoResultsBackground />
</div>

<div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
  <Invoice address={noAddress} voteFor={false} />
  <NakamotoResultsBackground />
</div>
{/if}