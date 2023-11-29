<script>
import Section1 from '$lib/components/homepage/Section1.svelte'
import Section2 from '$lib/components/homepage/Section2.svelte'
import Section3 from '$lib/components/homepage/Section3.svelte'

export /** @type {boolean} */ let homepage;

</script>
  
<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div>
	<Section1 {homepage}/>
	<Section2/>
	<Section3/>
</div>
