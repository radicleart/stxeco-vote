<script lang="ts">
	import NakamotoResultsBackground from "../../ui/NakamotoResultsBackground.svelte";
	import tick from '$lib/assets/tick.png'
	import cross from '$lib/assets/cross.png'
	import { sessionStore } from "$stores/stores";
	import { getPoolAndSoloVotesByProposal, getSummary, NAKAMOTO_VOTE_STOPS_HEIGHT } from "$lib/dao_api";
	import type { ResultsSummary, VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import { onMount } from "svelte";
	import { getDaoSummary } from "$lib/voting-non-stacker";

	export let proposal:VotingEventProposeProposal;
	let approved = true;
	let summary:ResultsSummary;
	let daoSummary:ResultsSummary;

	let poolPercent= '0'
	let soloPercent = '0'
	let daoPercent = '0'
	let daoAccountsFor = 0
	let daoAccountsAgainst = 0

	const blockSinceEnd = () => {
		return $sessionStore.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT
	}

	const doCount = () => {
		let votesFor = summary.summary.find((o) => o._id.event === 'pool-vote' && o._id.for)
		let votesAgn = summary.summary.find((o) => o._id.event === 'pool-vote' && !o._id.for)
		let stxFor = votesFor?.total || 0
		let stxAgainst = votesAgn?.total || 0
		let stxPower = stxFor + stxAgainst

		poolPercent = ((stxFor / stxPower) * 100).toFixed(4)

		votesFor = summary.summary.find((o) => o._id.event === 'solo-vote' && o._id.for)
		votesAgn = summary.summary.find((o) => o._id.event === 'solo-vote' && !o._id.for)
		stxFor = votesFor?.total || 0
		stxAgainst = votesAgn?.total || 0
		stxPower = stxFor + stxAgainst

		soloPercent = ((stxFor / stxPower) * 100).toFixed(4)

		votesFor = daoSummary.summary.find((o) => o._id.event === 'vote' && o._id.for)
		votesAgn = daoSummary.summary.find((o) => o._id.event === 'vote' && !o._id.for)
		stxFor = daoSummary.proposalData.votesFor
		stxAgainst = daoSummary.proposalData.votesAgainst
		stxPower = stxFor + stxAgainst
		daoAccountsFor = votesFor?.count || 0
		daoAccountsAgainst = votesAgn?.count || 0
		daoPercent = ((stxFor / stxPower) * 100).toFixed(4)
	}

	onMount(async () => {
		daoSummary = await getDaoSummary(proposal.proposal)
		summary = await getSummary(proposal.proposal)
		summary.proposalData = proposal.proposalData
		const allVotes = await getPoolAndSoloVotesByProposal(proposal.proposal)
		doCount()
	})


</script>

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0 align-top ">
	<!--
	<div class="p-8 stretch bg-[#1c671b] rounded-2xl self-start">
	  	<h3 class="text-3xl text-white font-extralight">Vote passed</h3>
	</div>
	-->
	{#if blockSinceEnd() > 0}
	<div class="p-8 bg-success-01 col-span-3 bg-[#1c671b] rounded-2xl border-error-600 relative">
		
		{#if soloPercent !== 'NaN'}
		<div class="flex justify-between mb-5 text-white">
			<div><span class="text-4xl font-extrabold">Solo Stackers</span></div>
			<div><span class="text-4xl font-extrabold">{soloPercent} %</span></div>
			<div>{#if Number(soloPercent) >= 80}<img alt="correct" src={tick}/>{:else}<img alt="correct" src={cross}/>{/if}</div>
		</div>
		{/if}

		{#if poolPercent !== 'NaN'}
		<div class="flex justify-between mb-5 text-white">
			<div><span class="text-4xl font-extrabold">Pool Stackers</span></div>
			<div><span class="text-4xl font-extrabold">{poolPercent} %</span></div>
			<div>{#if Number(poolPercent) >= 80}<img alt="correct" src={tick}/>{:else}<img alt="correct" src={cross}/>{/if}</div>
		</div>
		{/if}

		{#if daoPercent !== 'NaN'}
		<div class="flex justify-between mb-2 text-white">
			<div><span class="text-4xl font-extrabold">Non Stackers</span></div>
			<div><span class="text-4xl font-extrabold">{daoPercent} %</span></div>
			<div>{#if Number(daoPercent) >= 66}<img alt="correct" src={tick}/>{:else}<img alt="correct" src={cross}/>{/if}</div>
		</div>
		{/if}
	</div>
	{:else}
	<div class="p-8 bg-primary-01 col-span-2 bg-[#1c671b] rounded-2xl border-error-600 relative">
		{#if approved}
		<div class="flex justify-between mb-5">
			<div><img alt="correct" src={tick}/></div>
			<div><span class="text-4xl font-extrabold">YES</span></div>
		</div>
		<div class="flex justify-between">
			<div><span class="">Proposal failed to pass</span></div>
		</div>
		{:else}
		<div class="flex justify-between mb-5">
			<div><img alt="correct" src={cross}/></div>
			<div><span class="text-4xl font-semibold">NO</span></div>
		</div>
		<div class="flex flex-col">
			<div><span class="">Proposal failed to pass</span></div>
			<div><span class="">Check below for the detailed breakdown on each voting method</span></div>
		</div>
		{/if}
		<NakamotoResultsBackground />
	</div>
	{/if}
</div>
