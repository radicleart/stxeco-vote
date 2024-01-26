<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import type { ProposalData, ProposalEvent, VoteEvent } from '$types/stxeco.type';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';

	export let proposal: ProposalEvent;

	let proposalData: ProposalData;
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let winning = 'danger';
	let inFavour:number;

	onMount(async () => {
		const pd = proposal.proposalData
		inFavour = (pd && (pd.votesFor + pd.votesAgainst) > 0) ? Number(((pd.votesFor / (pd.votesFor + pd.votesAgainst)) * 100).toFixed(2)) : 0;
		if (inFavour > 80) {
			winning = 'success';
		}
		proposalData = pd
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
			<div class="flex flex-col gap-y-12">
				<div class="flex flex-col">
					<p class="text-2xl mb-5">Voting ended</p>
					<p>Voting ended <strong>{stacksTipHeight - proposal.proposalData.endBlockHeight} blocks ago</strong>.</p>
				</div>

				<p class="text-lg">Vote results can be found <a class="text-warning-900 underline" href={`/dao/proposals/${proposal.contractId}/results`}>here</a>.</p></div>
			<NakamotoBackground />
			<NakamotoShield />
		</div>
	</div>
</div>
