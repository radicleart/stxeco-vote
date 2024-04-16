<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import StackerDashboard from '$lib/components/all-voters/analysis/StackerDashboard.svelte';

	let address:string;
	let cycle:number;
	let inited = false;

	onMount(async () => {
		address = $page.params.slug
		cycle = Number($page.params.cycle)
		inited = true
	}) 
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

{#if inited}
<StackerDashboard {address} {cycle} />
{/if}