<script lang="ts">
  import { onMount } from 'svelte';
  import Invoice from './Invoice.svelte';
	import NakamotoResultsBackground from '$lib/ui/NakamotoResultsBackground.svelte';
	import { daoStore } from '$stores/stores_dao';

  let yesAddress:string;
  let noAddress:string;
  let inited = false;
  let addresses:any;


  onMount(async () => {
    addresses = $daoStore.soloPoolData?.soloAddresses!
    yesAddress = addresses.yAddress as string
    noAddress = addresses.nAddress as string
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