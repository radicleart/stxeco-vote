<script>
import createClient from '$lib/prismicio'; // Update this path if necessary
import  * as prismicH from '@prismicio/helpers';

export let docType;
export let uid;
const client = createClient()
const document = client.getByUID(docType, uid);
const isText = (/** @type {any} */ tabContent) => {
	let ans = false;
	for (let o of tabContent) {
		if (o.text.indexOf('</div>') > -1) {
			ans = true;
			break;
		}
	}
	return ans;
}
const filter = (text) => {
	text = text.replaceAll('<h2>', '<h2 class="text-info">');
	text = text.replaceAll('<strong>', '<h4 class="text-info">');
	text = text.replaceAll('</strong>', '</h4>');
	text = text.replaceAll('</i>', '</strong>');
	text = text.replaceAll('<i>', '<strong>');
	return text.replaceAll('<li>', '<li class="mb-4">');
}
</script>
  
<section>
	{#await document}
	<p>Loading...</p>
  {:then prismicResponse}
	{#if isText(prismicResponse.data.tab_content)}
  		{@html prismicH.asText(prismicResponse.data.tab_content)}
	{:else}
		{@html filter(prismicH.asHTML(prismicResponse.data.tab_content))}
	{/if}
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
</style>
