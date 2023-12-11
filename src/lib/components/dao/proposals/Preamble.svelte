<script lang="ts">
import type { ProposalEvent } from '$types/stxeco.type';
import arr from '$lib/assets/png-assets/stx_eco_directional_arrow.png'

export let proposal:ProposalEvent;
const proposalMeta = proposal.proposalMeta;
</script>

<div class="">
	<div class="grid grid-cols-4 justify-evenly gap-y-2">
		<div class={'col-span-1'}><p class={'text-primary-500'}>DAO</p></div>
		<div class={'col-span-3'}><p class="text-white">{proposalMeta.dao}</p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Title</p></div>
		<div class={'col-span-3'}><p class="text-white">{proposalMeta.title}</p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Author(s)</p></div>
		<div class={'col-span-3'}><p class="text-white">{proposalMeta.author}</p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Synopsis</p></div>
		<div class={'col-span-3'}><p class="text-white">{proposalMeta.synopsis}</p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Description</p></div>
		<div class={'col-span-3'}><p class="text-white">{@html proposalMeta.description}</p></div>
	</div>
</div>
