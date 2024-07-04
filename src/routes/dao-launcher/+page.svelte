<script lang="ts">
	import { onMount } from 'svelte';
	import LaunchTemplate from '$lib/components/dao-launcher/LaunchTemplate.svelte';
	import { isLoggedIn } from '@mijoco/stx_helpers/dist/index';

	onMount(async () => {
	})

</script>

<svelte:head>
  <title>Ecosystem DAO</title>
  <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

{#if isLoggedIn()}
<LaunchTemplate />
{/if}