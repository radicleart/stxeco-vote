<script lang="ts">
	import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

const reorder = (field:string) => {
	dispatch('reorder_events', { field });
}

</script>

<div class="w-full pb-2 grid grid-cols-3 md:grid-cols-5 my-4 text-sm font-semibold text-white border-b border-white">
	<div class="w-[20px] md:inline-flex hidden"><a href="/" class="pointer text-bloodorange" on:click|preventDefault={() => reorder('eventIndex')}>Index</a></div>
	<div class=" "> <a href="/" class="pointer text-bloodorange" on:click|preventDefault={() => reorder('event')}>event</a></div>
	<div class="col-span-2 max:w-1/5">stacker</div>
	<div class="md:inline-flex hidden"><a href="/" class="pointer text-bloodorange" on:click|preventDefault={() => reorder('balance')}>balance</a></div>
	<!--<div class="text-end whitespace-nowrap">Actions</div>-->
</div>
