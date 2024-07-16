<script lang="ts">
	import { explorerAddressUrl } from '$lib/utils';
	import type { ProposalMeta } from '@mijoco/stx_helpers/dist/index';

	export let votingContract:string|undefined;
	export let submissionContract:string|undefined;
	export let contractId:string;
	export let proposalMeta:ProposalMeta;
</script>

<div class="px-8 py-8 sm:py-10 sm:px-10 mt-4 md:px-12 bg-[#0A0A0B] text-white rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
	<div>
		<dl class="divide-y divide-white/10">
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">DAO</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{proposalMeta.dao || 'Ecosystem DAO'}</dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">Title</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(contractId)} target="_blank">{proposalMeta.title}</a></dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">Author(s)</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{@html proposalMeta.author}</dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">Synopsis</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{@html proposalMeta.synopsis}</dd>
			</div>
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">Description</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0">{@html proposalMeta.description}</dd>
			</div>
			{#if votingContract}
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">Voting contract</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(votingContract)} target="_blank">{votingContract.split('.')[1]}</a></dd>
			</div>
			{/if}
			{#if submissionContract}
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">Funding contract</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(submissionContract)} target="_blank">{submissionContract.split('.')[1]}</a></dd>
			</div>
			{/if}
			<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-md leading-6 text-white">Proposal contract</dt>
				<dd class="mt-1 text-md leading-6 text-sand-300 sm:col-span-2 sm:mt-0"><a href={explorerAddressUrl(contractId)} target="_blank">{contractId.split('.')[1]}</a></dd>
			</div>
		</dl>
	</div>
</div>
