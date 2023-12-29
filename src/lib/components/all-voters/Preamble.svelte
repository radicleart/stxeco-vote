<script lang="ts">
import type { ProposalEvent } from '$types/stxeco.type';
import arr from '$lib/assets/png-assets/stx_eco_directional_arrow.png'
	import { explorerAddressUrl } from '$lib/utils';
	import { CONFIG } from '$lib/config';

export let proposal:ProposalEvent;
const proposalMeta = proposal.proposalMeta;
</script>

<div class="">
	<div class="grid grid-cols-4 justify-evenly gap-y-2">
		<div class={'col-span-1'}><p class={'text-primary-500'}>DAO</p></div>
		<div class={'col-span-3'}><p class="text-white">{proposalMeta.dao || 'Ecosystem DAO'}</p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Title</p></div>
		<div class={'col-span-3'}><p class="text-primary-300"><a href={explorerAddressUrl(proposal.contractId)} target="_blank">{proposalMeta.title}</a></p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Author(s)</p></div>
		<div class={'col-span-3'}><p class="text-white">{proposalMeta.author}</p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Synopsis</p></div>
		<div class={'col-span-3'}><p class="text-white">{proposalMeta.synopsis}</p></div>
		<div class={'col-span-1'}><p class={'text-primary-500'}>Description</p></div>
		<div class={'col-span-3'}><p class="text-white">{@html proposalMeta.description}</p></div>
		{#if proposal.votingContract}
		<div class={'col-span-1'}><p class={'text-primary-500'}>Voting Contract</p></div>
		<div class={'col-span-3'}><p class="text-primary-300"><a href={explorerAddressUrl(proposal.votingContract)} target="_blank">{proposal.votingContract.split('.')[1]}</a></p></div>
		{/if}
		<div class={'col-span-1'}><p class={'text-primary-500'}>Funding Contract</p></div>
		<div class={'col-span-3'}><p class="text-primary-300"><a href={explorerAddressUrl(CONFIG.VITE_DOA_DEPLOYER + '.' + CONFIG.VITE_DOA_FUNDED_SUBMISSION_EXTENSION)} target="_blank">{CONFIG.VITE_DOA_FUNDED_SUBMISSION_EXTENSION}</a></p></div>
	</div>
</div>
