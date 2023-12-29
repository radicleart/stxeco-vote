<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import type { ProposalData, ProposalEvent, VoteEvent } from '$types/stxeco.type';
	import { fmtMicroToStx } from 'sbtc-bridge-lib';
	import DaoResults from './DaoResults.svelte';

	export let proposalEvent: ProposalEvent;
	export let daoVotes:Array<VoteEvent>;

	let proposalData: ProposalData;
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let winning = 'danger';
	let inFavour:number;

	onMount(async () => {
		const pd = proposalEvent.proposalData
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


<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
	<p>Voting ended {stacksTipHeight - proposalEvent.proposalData.endBlockHeight} blocks ago.</p>
	{#if proposalData}
		{#if proposalData.passed}
		<h4 class={'text-2xl mb-5 text-' + proposalEvent.status?.color}>Vote Passed</h4>
		<div class={'mb-4 flex justify-around text-' + winning}>
		<div>
			<span class="text-center">{inFavour}%</span> <span class="text-white"> in favour of this proposal</span>
		</div>
		</div>
		{:else}
		<h4 class={'text-' + proposalEvent.status?.color}>Vote Failed to Pass</h4>
		<div class={'mb-4 flex justify-around text-' + winning}>
		<div>
			<span class="text-center">{100 - inFavour}%</span> <span class="text-white"> against this proposal</span>
		</div>
		</div>
		{/if}
		<div class={'flex justify-around text-' + proposalEvent.status?.color}>
			<div>
			  <p class="text-center">{fmtMicroToStx(proposalData.votesFor)} <span class="text-white">votes for</span></p>
			</div>
			<div>
			  <p class="text-center">{fmtMicroToStx(proposalData.votesAgainst)} <span class="text-white">votes against</span></p>
			</div>
		</div>
	
	{/if}
	<div>
		<DaoResults proposal={proposalEvent} {daoVotes} />
	</div>
</div>
  
