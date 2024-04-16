<script lang="ts">
	import { stacksStore } from "$stores/stacksStore";
	import { createEventDispatcher, onMount } from "svelte";

	let aggDelegationData:any = $stacksStore.aggDelegationData

	const dispatch = createEventDispatcher();
	export let filterTopic:string|undefined;
	export let filterDelegator:string|undefined;
	const filterTopics = [
		'stack-stx',
		'stack-extend',
		'delegate-stx',
		'delegate-stack-stx',
		'stack-aggregation-commit-indexed',
		'revoke-delegate-stx',
	];

	const changeTopic = async () => {
    	dispatch('change_filter', {filters: {filterTopic}})
  	}

	  const changeDelegator = async () => {
    	dispatch('change_delegator', {filters: {filterDelegator}})
  	}

  $: delegators = () => {
	if (!aggDelegationData.result2 || aggDelegationData.result2.length === 0) return 
	const result2 = aggDelegationData.result2.map((x:any) => x._id.delegator)
	return result2
  }

const reorder = (field:string) => {
	dispatch('reorder_events', { field });
}
onMount(async () => {
})

</script>

<div class="w-full pb-2 grid grid-cols-4 md:grid-cols-7 gap-x-2 my-4">
	<div class="col-span-2">
		<label for="stacking-event">Stacking event:</label>
		<select id="stacking-event" class="text-black h-10 w-full px-3 me-8 border rounded-lg" bind:value={filterTopic} on:change={() => {changeTopic();}}>
			<option class="pe-5" value={''}>All stacking events</option>
			{#each filterTopics as opt}
			  <option value={opt} selected={opt === filterTopic}>{opt}</option>
			{/each}
		</select>
	</div>
	<div class="col-span-2">
		<label for="stacking-event">Pool operator:</label>
		<select id="stacking-event" class="text-black h-10 w-full px-3 me-8 border rounded-lg" bind:value={filterDelegator} on:change={() => {changeDelegator();}}>
			<option class="pe-5" value={''}>All operators</option>
			{#each delegators() as opt}
			  <option value={opt} selected={opt === filterDelegator}>{opt}</option>
			{/each}
		</select>
	</div>
</div>
