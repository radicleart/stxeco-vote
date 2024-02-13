<script lang="ts">
  import { onMount } from 'svelte';
  import Invoice from './Invoice.svelte';
  import { sbtcConfig } from '$stores/stores';
	import NakamotoResultsBackground from '$lib/components/shared/NakamotoResultsBackground.svelte';

  let yesAddress:string;
  let noAddress:string;
  let inited = false;

  onMount(async () => {
    const addresses = $sbtcConfig.soloPoolData?.soloAddresses!
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