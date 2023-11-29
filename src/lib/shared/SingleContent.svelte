<script>
	import createClient from '$lib/prismicio'; // Update this path if necessary
	import  * as prismicH from '@prismicio/helpers';
	
	export let page;
	const client = createClient()
	const document = client.getSingle(page)
  </script>
  
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Ecosystem DAO" />
</svelte:head>

<section>
	{#await document}
	<p>Loading...</p>
  {:then prismicResponse}
  {@html prismicH.asHTML(prismicResponse.data.content)}
  <!--
	<h1>{prismicH.asText(prismicResponse.data.title)}</h1>
	{@html prismicH.asHTML(prismicResponse.data.tagline)}
	{@html prismicH.asImageSrc(prismicResponse.data['homepage-image'])}
  -->
  {:catch error}
  <pre>{document}</pre>
  <pre>{error.message}</pre>
  {/await}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
