
<script lang="ts">
	import { fmtNumberStacksFloor } from '$lib/utils';

	export let entry:any;

</script>

<div class="text-sm flex flex-col  z-[1]">
	<div class="py-2 text-xs">
		<p class="">Cycle: {entry.cycle}</p>
		<div class="grid grid-cols-4">
			<div class="col-span-3">Signer</div>
			<div class="col-span-1">Weight</div>
			{#each entry.signers as signer}
			<div class="col-span-3">
				<div>{(signer.signer)}</div>
			</div>
			<div class="col-span-1">
				<div>{fmtNumberStacksFloor(signer.weight)}</div>
			</div>
		{/each}
		</div>
	</div>
</div>
