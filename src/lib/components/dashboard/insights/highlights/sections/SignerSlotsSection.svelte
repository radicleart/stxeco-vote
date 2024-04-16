
<script lang="ts">

export let slots:any;
export let page:number;

</script>

<div class="text-sm flex flex-col">
	<div class="py-2 text-xs">
		<p>Page: {page}</p>
		<div class="grid grid-cols-4">
			<div class="col-span-3">Signer</div>
			<div class="col-span-1">Slots</div>
			{#each slots as slot}
			<div class="col-span-3">
				<div>{(slot.signer)}</div>
			</div>
			<div class="col-span-1">
				<div>{slot.numSlots}</div>
			</div>
			{/each}
		</div>
	</div>
</div>
