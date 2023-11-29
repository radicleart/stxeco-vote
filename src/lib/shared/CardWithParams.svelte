
<script type="ts">
	import { goto } from '$app/navigation';
  export let image:string;
  export let title:string;
  export let subtitle:string;
  export let linkName:string;
  export let linkTarget:string;
	const jumpin = () => {
		goto(`${linkTarget}`, { replaceState: false })
	}
  const imgUrl = new URL(image, import.meta.url).href

</script>
<div class="card">
  {#if image}<img src={imgUrl} class="card-img-top" alt={subtitle}>{/if}
  <div class="card-body">
    <h5 class="card-title">{title}</h5>
    <p class="card-text">{@html subtitle}</p>
    <button class="btn btn-light" on:click|preventDefault={() => { jumpin() }}>{linkName}</button>
  </div>
</div>

<style>
  .card{
    min-width: 18rem;
  }
</style>