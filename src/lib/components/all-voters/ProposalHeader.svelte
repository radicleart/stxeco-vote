<script lang="ts">
import { fmtNumber } from '$lib/utils';
import { ProposalStage, type ProposalEvent } from '$types/stxeco.type';
import Preamble from './Preamble.svelte';

export let proposal:ProposalEvent;
let showDetails = false;
</script>

<div class="mt-8 inline-block pt-2 pb-1 px-6 rounded-2xl border border-[#131416]/[12%]">
		<div class="flex items-center gap-2">
			<span class="w-2 h-2 rounded-full bg-bloodorange"></span>
			<p class="font-mono text-xs uppercase tracking-wider text-bloodorange">
			{#if proposal.stage === ProposalStage.PARTIAL_FUNDING || proposal.stage === ProposalStage.UNFUNDED}
				Funding in progress
			{:else}
				Vote in progress
			{/if}
			</p>
		</div>
		{#if proposal.stage === ProposalStage.PARTIAL_FUNDING || proposal.stage === ProposalStage.UNFUNDED}
		<span class="font-mono text-[#131416] text-xs uppercase tracking-wider">Awaiting funding</span>
		{:else}
		<span class="font-mono text-[#131416] text-xs uppercase tracking-wider">Ends at block {fmtNumber(proposal.proposalData.endBlockHeight)}</span>
		{/if}
</div>
<div class="sm:flex sm:items-center sm:justify-between mt-6">
	<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4">
		<a href="https://github.com/stacksgov/sips/pull/155/files#diff-f54db5667e06bf510f4dfd4e8c0169c309558f037c2fc758759dc74a6bd9679c" class="py-2 px-4 rounded-md" target="_blank">
			SIP-021 - Nakamoto Release
			<svg class="inline" width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M34.8958 27.6042L37.5 25C40.9518 21.5482 40.9518 15.9518 37.5 12.5C34.0482 9.04822 28.4518 9.04822 25 12.5L22.3958 15.1042" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M15.1042 22.3958L12.5 25C9.04822 28.4518 9.04822 34.0482 12.5 37.5C15.9518 40.9518 21.5482 40.9518 25 37.5L27.6042 34.8958" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M29.6875 20.3125L20.3125 29.6875" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</a>
	</h1>

	<button on:click={() => (showDetails = !showDetails)} class="text-sm font-mono uppercase inline-flex items-center bg-transparent gap-2 px-4 py-2  text-[#0A0A0B]/[0.64] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
		<!-- Show/Hide toggle -->
		Show details <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
			<path fill-rule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clip-rule="evenodd" />
		</svg>
	</button>
</div>

{#if showDetails}
<Preamble {proposal} />
{/if}
