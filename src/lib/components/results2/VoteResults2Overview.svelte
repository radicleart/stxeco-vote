<script lang="ts">
	import NakamotoResultsBackground from '../../ui/NakamotoResultsBackground.svelte';
	import tick from '$lib/assets/tick.png';
	import cross from '$lib/assets/cross.png';
	import { sessionStore } from '$stores/stores';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao_api';
	import { onMount } from 'svelte';
	import type { VoteEvent } from '@mijoco/stx_helpers/dist/dao';
	import { isVoting } from '$lib/proposals';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { fmtNumberStacksFloor } from '$lib/utils';

	export let bitcoinVotes: Array<VoteEvent> = [];
	export let stacksVotes: Array<VoteEvent> = [];
	export let proposal: VotingEventProposeProposal;

	let lockedPercent = '0';
	let unlockedPercent = '0';

	let bSumFor = bitcoinVotes.filter((o) => o.for).length;
	let bSumAg = bitcoinVotes.filter((o) => !o.for).length;
	let sSumFor = stacksVotes.filter((o) => o.for && o.amountLocked > 0).length;
	let sSumAg = stacksVotes.filter((o) => !o.for && o.amountLocked > 0).length;

	let totalLockedFor: number;
	let totalLockedAg: number;
	let totalUnlockedFor: number;
	let totalUnlockedAg: number;

	onMount(async () => {
		const bTotalFor = bitcoinVotes.filter((o) => o.for).reduce((n, { amount }) => n + amount, 0);
		const bTotalAg = bitcoinVotes.filter((o) => !o.for).reduce((n, { amount }) => n + amount, 0);
		const sTotalFor = stacksVotes.filter((o) => o.for).reduce((n, { amount }) => n + amount, 0);
		const sTotalAg = stacksVotes.filter((o) => !o.for).reduce((n, { amount }) => n + amount, 0);
		const sUnlockedFor = stacksVotes
			.filter((o) => o.for)
			.reduce((n, { amountUnlocked }) => n + amountUnlocked, 0);
		const sUnlockedAg = stacksVotes
			.filter((o) => !o.for)
			.reduce((n, { amountUnlocked }) => n + amountUnlocked, 0);
		const sLockedFor = stacksVotes
			.filter((o) => o.for)
			.reduce((n, { amountLocked }) => n + amountLocked, 0);
		const sLockedAg = stacksVotes
			.filter((o) => !o.for)
			.reduce((n, { amountLocked }) => n + amountLocked, 0);

		bSumFor = bitcoinVotes.filter((o) => o.for).length;
		bSumAg = bitcoinVotes.filter((o) => !o.for).length;
		sSumFor = stacksVotes.filter((o) => o.for && o.amount > 0).length;
		sSumAg = stacksVotes.filter((o) => !o.for && o.amount > 0).length;

		totalLockedFor = bTotalFor + sLockedFor;
		totalLockedAg = bTotalAg + sLockedAg;
		const totalLockedPower = totalLockedFor + totalLockedAg;
		lockedPercent = ((totalLockedFor / totalLockedPower) * 100).toFixed(4);

		totalUnlockedFor = sUnlockedFor;
		totalUnlockedAg = sUnlockedAg;
		const totalUnlockedPower = totalUnlockedFor + totalUnlockedAg;
		unlockedPercent = ((totalUnlockedFor / totalUnlockedPower) * 100).toFixed(4);
	});
</script>

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0 align-top">
	<div class="p-8 stretch bg-[#121314] rounded-2xl self-start">
		<h3 class="text-3xl text-white font-extralight">Vote results</h3>
	</div>

	<div class="p-8 bg-primary-01 col-span-2 bg-[#F4F3F0] rounded-2xl border-error-600 relative">
		<div class="flex justify-between mb-5">
			<div></div>
			<div><span class="text-4xl font-extrabold"></span></div>
		</div>
		<div class="flex justify-between mb-5">
			<div>
				<span class=""
					>{#if !isVoting(proposal)}Voting has closed{:else}Voting in progress{/if}</span
				>
			</div>
			<div>
				<p>
					{fmtNumberStacksFloor(totalLockedFor + totalUnlockedFor)} for, {fmtNumberStacksFloor(
						totalLockedAg + totalUnlockedAg
					)} against
				</p>
			</div>
		</div>
		<div class="flex justify-between">
			<div class="w-1/2"><span class="text-4xl font-extrabold">Locked Stacks</span></div>
			<div><span class="text-4xl font-extrabold">{lockedPercent} %</span></div>
			<div>
				{#if Number(lockedPercent) >= 70}<img alt="correct" src={tick} />{:else}<img
						alt="correct"
						src={cross}
					/>{/if}
			</div>
		</div>
		<div class="flex justify-between">
			<div class="w-1/2"><span class="text-4xl font-extrabold">Unlocked Stacks</span></div>
			<div><span class="text-4xl font-extrabold">{unlockedPercent} %</span></div>
			<div>
				{#if Number(unlockedPercent) >= 70}<img alt="correct" src={tick} />{:else}<img
						alt="correct"
						src={cross}
					/>{/if}
			</div>
		</div>
	</div>
</div>
