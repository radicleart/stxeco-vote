<script>
	import { goto } from '$app/navigation';
	import Section1 from '$lib/components/homepage/Section1.svelte'
	import Section2 from '$lib/components/homepage/Section2.svelte'

	goto('/proposals')
</script>
	  
	<svelte:head>
		<title>Ecosystem DAO</title>
		<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
	</svelte:head>
	
	<Section1 homepage={true}/>
	<!-- <div class="container">
	  <Section2/>
	</div> -->
	