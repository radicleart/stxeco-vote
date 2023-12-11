<script lang="ts">
  import { onMount } from 'svelte';
	import { CONFIG } from '$lib/config';
	import { goto } from '$app/navigation';

  // fetch/hydrate data from local storage
	
	onMount(async () => {
		goto('/dao/voting/' + CONFIG.VITE_DOA_PROPOSAL + '?method=3')
	})

</script>

<svelte:head>
  <title>Ecosystem DAO - SIP Voting</title>
  <meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

