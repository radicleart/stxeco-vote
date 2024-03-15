<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import StackerDashboard from '$lib/components/all-voters/analysis/StackerDashboard.svelte';

	let address:string;
	let inited = false;

	onMount(async () => {
		address = $page.params.slug
		inited = true
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

{#if inited}
<StackerDashboard {address} cycle={78} />
{/if}