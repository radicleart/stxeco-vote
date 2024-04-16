
<script lang="ts">

export let slots:any;

</script>

<div class="text-sm flex flex-col">
	<div class="py-2 text-xs">
		<div class="grid grid-cols-5">
			<div class="col-span-3">Signer</div>
			<div class="col-span-1">∑</div>
			<div class="col-span-1">%</div>
			{#each slots as slot}
			<div class="col-span-3">
				<div>{(slot.signer)}</div>
			</div>
			<div class="col-span-1">
				<div>{slot.accumulated}</div>
			</div>
			<div class="col-span-1">
				<div>{slot.percentage}</div>
			</div>
			{/each}
		</div>
	</div>
</div>
