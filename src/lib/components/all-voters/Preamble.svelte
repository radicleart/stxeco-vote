<script lang="ts">
import type { ProposalEvent } from '$types/stxeco.type';
import { explorerAddressUrl } from '$lib/utils';
import { CONFIG } from '$lib/config';

export let proposal:ProposalEvent;
const proposalMeta = proposal.proposalMeta;
</script>

<div class="py-10 px-10 mt-4 md:px-12 bg-[#0A0A0B] text-white rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
	<div>
		<dl class="divide-y divide-white/10">
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">DAO</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{proposalMeta.dao || 'Ecosystem DAO'}</dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">Title</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(proposal.contractId)} target="_blank">{proposalMeta.title}</a></dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">Author(s)</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{proposalMeta.author}</dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">Synopsis</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{proposalMeta.synopsis}</dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">Description</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{proposalMeta.description}</dd>
			</div>
			{#if proposal.votingContract}
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">Voting contract</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(proposal.votingContract)} target="_blank">{proposal.votingContract.split('.')[1]}</a></dd>
			</div>
			{/if}
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">Funding contract</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(CONFIG.VITE_DOA_DEPLOYER + '.' + CONFIG.VITE_DOA_FUNDED_SUBMISSION_EXTENSION)} target="_blank">{CONFIG.VITE_DOA_FUNDED_SUBMISSION_EXTENSION}</a></dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm leading-6 text-white">Proposal contract</dt>
				<dd class="mt-1 text-sm leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(proposal.contractId)} target="_blank">{proposal.contractId.split('.')[1]}</a>-update</dd>
			</div>
		</dl>
	</div>
</div>
