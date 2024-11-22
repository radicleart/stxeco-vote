<script lang="ts">
	import { CheckCircleSolid, XSolid } from 'flowbite-svelte-icons';
	import { sessionStore } from '$stores/stores';
	import { getSummaryNodao, NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao_api';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { onMount } from 'svelte';
	import type { ProposalData } from '@mijoco/stx_helpers/dist/dao';

	type Results2Summary = {
		bSumAg: number;
		bSumFor: number;
		bTotalAg: number;
		bTotalFor: number;
		lockedPercent: string;
		proposalData: ProposalData;
		sSumAg: number;
		sSumFor: number;
		sTotalAg: number;
		sTotalFor: number;
		totalLockedAg: number;
		totalLockedFor: number;
		totalLockedPower: number;
		totalUnlockedAg: number;
		totalUnlockedFor: number;
		totalUnlockedPower: number;
		uniqueAccounts: number;
		unlockedPercent: string;
	};

	export let proposal: VotingEventProposeProposal;
	let approved = true;
	let summary: Results2Summary;
	let unlockedP: number;
	let lockedP: number;
	let customMajority: number;

	let poolPercent = '0';
	let soloPercent = '0';

	const blockSinceEnd = () => {
		return $sessionStore.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT;
	};

	onMount(async () => {
		//daoSummary = await getDaoSummary(proposal.proposal);
		summary = await getSummaryNodao(proposal.proposal);
		summary.proposalData = proposal.proposalData;
		lockedP = Number(summary.lockedPercent);
		unlockedP = Number(summary.unlockedPercent);
		customMajority = proposal.proposalData.customMajority / 100;
		approved = Number(summary.lockedPercent) > customMajority;
	});
</script>

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0 align-top">
	<!--
	<div class="p-8 stretch bg-[#1c671b] rounded-2xl self-start">
	  	<h3 class="text-3xl text-white font-extralight">Vote passed</h3>
	</div>
	-->
	{#if summary}
		<div class="p-8 bg-success-01 col-span-3 bg-[#1c671b] rounded-2xl border-error-600 relative">
			{#if soloPercent !== 'NaN'}
				<div class="flex md:flex-row flex-col gap-y-3 justify-between mb-5 text-white">
					<div class="w-1/4"><span class="text-4xl font-extrabold">Locked</span></div>
					<div class="grow">
						<span class="text-4xl font-extrabold">{summary.lockedPercent} %</span>
					</div>
					<div>
						{#if Number(summary.lockedPercent) >= customMajority}
							<CheckCircleSolid class="w-10 h-10 text-white " />
						{:else}
							<XSolid class="w-10 h-10 text-red-500" />
						{/if}
					</div>
				</div>
			{/if}

			{#if summary.unlockedPercent !== 'NaN'}
				<div class="flex md:flex-row flex-col gap-y-3 justify-between mb-5 text-white">
					<div class="w-1/4"><span class="text-4xl font-extrabold">Unlocked</span></div>
					<div class="grow">
						<span class="text-4xl font-extrabold">{summary.unlockedPercent} %</span>
					</div>
					<div>
						{#if lockedP >= customMajority}
							<CheckCircleSolid class="w-10 h-10 text-white " />
						{:else}
							<XSolid class="w-10 h-10 text-red-500" />
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
