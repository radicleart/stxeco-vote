<script lang="ts">
  import JSONTree from 'svelte-json-tree'
	import { getAddressFromHashBytes } from "$lib/utils";
	import type { PoxAddress } from "$types/pox_types";

	export let stackerEvents: Array<any> = []

	const getBitcoinAddress = (poxAddress:PoxAddress):string => {
		const addr = getAddressFromHashBytes(poxAddress.hashBytes, poxAddress.version)
		return addr || 'unknown'
	}


</script>

<div class="mt-0 pt-0 mb-4 border-b">
	<p class="mb-4">pox-3 events emitted relating to address</p>
	{#each stackerEvents as entry}
	<div class="mb-4">
		<h2 class="mb-2">{entry.event}</h2>
		<pre><JSONTree value={entry} /></pre>
	</div>
	{/each}
</div>
