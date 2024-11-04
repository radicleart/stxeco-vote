<script lang="ts">
	import NakamotoResultsBackground from '../../ui/NakamotoResultsBackground.svelte';
	import tick from '$lib/assets/tick.png';
	import cross from '$lib/assets/cross.png';
	import { sessionStore } from '$stores/stores';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao_api';
	import { onMount } from 'svelte';
	import type { ResultsSummary } from '@mijoco/stx_helpers/dist/index';

	export let approved = false;
	export let poolSummary: any;
	export let soloSummary: any;
	export let daoSummary: ResultsSummary;
	export let poolVoting;
	export let soloVoting;

	let poolPercent = '0';
	let soloPercent = '0';
	let daoPercent = '0';

	const blockSinceEnd = () => {
		return $sessionStore.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT;
	};

	onMount(async () => {
		let stxFor = poolSummary.votesFor?.total || 0;
		let stxAgainst = poolSummary.votesAgn?.total || 0;
		let stxPower = stxFor + stxAgainst;

		poolPercent = ((stxFor / stxPower) * 100).toFixed(4);

		stxFor = soloSummary.votesFor?.total || 0;
		stxAgainst = soloSummary.votesAgn?.total || 0;
		stxPower = stxFor + stxAgainst;

		soloPercent = ((stxFor / stxPower) * 100).toFixed(4);

		if (daoSummary) {
			const votesFor = daoSummary.summary.find((o) => o._id.event === 'vote' && o._id.for);
			const votesAgn = daoSummary.summary.find((o) => o._id.event === 'vote' && !o._id.for);
			stxFor = daoSummary.proposalData.votesFor;
			stxAgainst = daoSummary.proposalData.votesAgainst;
			stxPower = stxFor + stxAgainst;
			daoPercent = ((stxFor / stxPower) * 100).toFixed(4);
		}
	});
</script>

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0 align-top">
	<div class="p-8 stretch bg-[#121314] rounded-2xl self-start">
		<h3 class="text-3xl text-white font-extralight">Vote results</h3>
	</div>
	{#if blockSinceEnd() > 0}
		<div class="p-8 bg-primary-01 col-span-2 bg-[#F4F3F0] rounded-2xl border-error-600 relative">
			<div class="flex justify-between mb-5">
				<div></div>
				<div><span class="text-4xl font-extrabold"></span></div>
			</div>
			<div class="flex justify-between mb-5">
				<div><span class="">Voting has closed</span></div>
			</div>
			{#if soloVoting}
				<div class="flex justify-between mb-5">
					<div><span class="text-4xl font-extrabold">Solo Stackers</span></div>
					<div><span class="text-4xl font-extrabold">{soloPercent} %</span></div>
					<div>
						{#if Number(soloPercent) >= 80}<img alt="correct" src={tick} />{:else}<img
								alt="correct"
								src={cross}
							/>{/if}
					</div>
				</div>
			{/if}
			{#if poolVoting}
				<div class="flex justify-between mb-5">
					<div><span class="text-4xl font-extrabold">Pool Stackers</span></div>
					<div><span class="text-4xl font-extrabold">{poolPercent} %</span></div>
					<div>
						{#if Number(poolPercent) >= 80}<img alt="correct" src={tick} />{:else}<img
								alt="correct"
								src={cross}
							/>{/if}
					</div>
				</div>
			{/if}
			{#if daoSummary}
				<div class="flex justify-between mb-2">
					<div><span class="text-4xl font-extrabold">Non-Stackers</span></div>
					<div><span class="text-4xl font-extrabold">{daoPercent} %</span></div>
					<div>
						{#if Number(daoPercent) >= 66}<img alt="correct" src={tick} />{:else}<img
								alt="correct"
								src={cross}
							/>{/if}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="p-8 bg-primary-01 col-span-2 bg-[#F4F3F0] rounded-2xl border-error-600 relative">
			{#if approved}
				<div class="flex justify-between mb-5">
					<div><img alt="correct" src={tick} /></div>
					<div><span class="text-4xl font-extrabold">YES</span></div>
				</div>
				<div class="flex justify-between">
					<div><span class="">Proposal failed to pass</span></div>
				</div>
			{:else}
				<div class="flex justify-between mb-5">
					<div><img alt="correct" src={cross} /></div>
					<div><span class="text-4xl font-semibold">NO</span></div>
				</div>
				<div class="flex flex-col">
					<div><span class="">Proposal failed to pass</span></div>
					<div>
						<span class="">Check below for the detailed breakdown on each voting method</span>
					</div>
				</div>
			{/if}
			<NakamotoResultsBackground />
		</div>
	{/if}
</div>
