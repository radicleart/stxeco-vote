<script lang="ts">
	import { onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { fmtMicroToStx, fmtNumber } from '$lib/utils';

	export let proposal:VotingEventProposeProposal;

	let burnHeight = $sessionStore.stacksInfo.burn_block_height;

	onMount(async () => {
	});
</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta
		name="description"
		content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin"
	/>
</svelte:head>


<div>
	<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
		<div class="py-10 px-10 md:px-12 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
			
			<div class="">
				<div class="mb-4">
					<h2 class="text-[#131416] text-2xl mb-3">Voting ended</h2>
				</div>
				<div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
					<p>Voting ended <strong>{fmtNumber(burnHeight - proposal.proposalData.burnEndHeight)} blocks ago</strong>.</p>
					<p class="text-lg">Vote results can be found <a class="text-warning-900 underline" href={`/dao/proposals/${proposal.proposal}/results`}>here</a></p>
				</div>
			</div>
			
			<NakamotoBackground />
			<NakamotoShield />
		</div>
	</div>
</div>
