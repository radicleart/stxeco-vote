<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import { CONFIG } from '$lib/config';
	import { goto } from '$app/navigation';


	onMount(async () => {
		goto('/dashboard/address-lookup/' + $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress || 'ST000000000000000000002AMW42H')
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>
