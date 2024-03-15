<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import { page } from '$app/stores';
	import { CONFIG } from '$lib/config';
	import DaoUtils from '$lib/service/DaoUtils';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import ChainUtils from '$lib/service/ChainUtils';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao_api';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import Placeholder from '$lib/components/all-voters/Placeholder.svelte';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';
	import VoteAnalysis from '$lib/components/all-voters/analysis/VoteAnalysis.svelte';
	import type { ProposalEvent } from '$types/stxeco.type';
	import StackerEvents from '$lib/components/all-voters/analysis/StackerEvents.svelte';
	import { getPoxInfo, getStackerInfo, getStackerInfoLatest } from '$lib/pox_api';
	import StackerContractInfo from '$lib/components/all-voters/analysis/StackerContractInfo.svelte';
	import type { StackerStats } from '$types/pox_types';
	import RewardSlotAnalysis from '$lib/components/all-voters/analysis/RewardSlotAnalysis.svelte';
	import { fmtMicroToStx, fmtNumber } from '$lib/utils';

	export let address:string;
	export let cycle:number;
	let info:StackerStats = {} as StackerStats;

	let errorReason:string|undefined;
	let proposal:ProposalEvent;
	let balanceAtHeight:number = 0;
	let proposalNotFound = false;
	let activeFlag = false;
	let approved = false;
	let inited = false;
	let showVotes = false;
	let showStackerInfo = false;
	let showRewardSlots = false;
	let showPoxEntries = false;
	let showStackerEvents = false;

	const blockSinceEnd = () => {
		return $sbtcConfig.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT
	}

	const isApproved = () => {
		approved = $sbtcConfig.stacksInfo?.burn_block_height > NAKAMOTO_VOTE_STOPS_HEIGHT
	}

	onMount(async () => {
		info = await getStackerInfo(address, cycle)

		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $sbtcConfig.currentProposal.contractId);
		if (event) {
			proposal = event;
			const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
			const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
			DaoUtils.setStatus(1, burnHeight, stacksTipHeight, proposal);
			activeFlag = proposal.proposalData && stacksTipHeight >= proposal.proposalData.startBlockHeight
			isApproved()
		} else {
			proposalNotFound = true
		} 

		try {
			const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposal.proposalData.startBlockHeight);
			balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
		} catch (e:any) {
			balanceAtHeight = 0;
			errorReason = e.message;
		}

		inited = true
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="flex flex-col gap-y-4 mx-auto max-w-7xl md:px-6">

	{#if inited}

	<div class="sm:flex sm:items-center sm:justify-between mt-6">
		<h1 class="text-[#0A0A0B] text-2xl sm:text-4xl sm:-mx-4">
				Stacker information
				<svg class="inline" width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M34.8958 27.6042L37.5 25C40.9518 21.5482 40.9518 15.9518 37.5 12.5C34.0482 9.04822 28.4518 9.04822 25 12.5L22.3958 15.1042" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M15.1042 22.3958L12.5 25C9.04822 28.4518 9.04822 34.0482 12.5 37.5C15.9518 40.9518 21.5482 40.9518 25 37.5L27.6042 34.8958" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M29.6875 20.3125L20.3125 29.6875" stroke="#0A0A0B" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
		</h1>
	
	</div>
	<div class="flex flex-col py-10  px-10 w-full my-8 rounded-2xl bg-[#F4F3F0] ">
		<div class="md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
			<div class="flex flex-col items-stretch justify-items-stretch">
				<div>
					{#if address && address !== 'undefined'}
					<div class="mb-3 max-w-md">
						<h2 class="text-[#131416] text-2xl mb-3 break-words">{address}</h2>
						<p class="">Information is pulled from pox-3 contract and event stream
							as well as from the stx.eco DAO contracts.
						</p>
					</div>
					{:else}
					<p>Enter address to investigate</p>
					{/if}
				</div>
			</div>
			<NakamotoBackground />
			<NakamotoShield />
		</div>

		<div class="my-5 flex flex-col gap-y-3">
			{#if info.votes}
			<div>
				<div class="flex justify-between md:w-1/2 text-2xl border-1 rounded-sm py-2 pe-4">
					<h2 class="">Vote history</h2>
					<a href="/" class="text-2xl" on:click|preventDefault={() => showVotes = !showVotes}>+</a>
				</div>
			</div>
			{#if showVotes}
			<div>
				<p class="">How this address participated in stacks ecosystem voting</p>
				<VoteAnalysis votes={info.votes}/>
			</div>
			{/if}
			{/if}

			{#if info.stackerInfo && info.stackerInfo.length > 0}
			<div>
				<div class="flex justify-between md:w-1/2 text-2xl border-1 rounded-sm py-2 pe-4">
					<h2 class="">Stacker info</h2>
					<a href="/" class="text-2xl" on:click|preventDefault={() => showStackerInfo = !showStackerInfo}>+</a>
				</div>
			</div>
			{#if showStackerInfo}
			<div>
				<p class="">How this address is currently participating in stacking</p>
				<StackerContractInfo stackerInfo={info.stackerInfo[0]} />
			</div>
			{/if}
			{/if}

			{#if info.stackerEvents && info.stackerEvents.length > 0}
			<div>
				<div class="flex justify-between md:w-1/2 text-2xl border-1 rounded-sm py-2 pe-4">
					<h2 class="">Stacking history</h2>
					<a href="/" class="text-2xl" on:click|preventDefault={() => showStackerEvents = !showStackerEvents}>+</a>
				</div>
			</div>
			{#if showStackerEvents}
			<div>
				<p class="">The history of this address in stacking told by stacking events</p>
				<StackerEvents stackerEvents={info.stackerEvents} />
			</div>
			{/if}
			{/if}

			{#if info.poxEntries && info.poxEntries.length > 0}
			<div>
				<div class="flex justify-between md:w-1/2 text-2xl border-1 rounded-sm py-2 pe-4">
					<h2 class="">PoX table entries</h2>
					<a href="/" class="text-2xl" on:click|preventDefault={() => showPoxEntries = !showPoxEntries}>+</a>
				</div>
			</div>
			{#if showPoxEntries}
			<div>
				<p class="">How this address maps to reward slot entries in the cycle {cycle}</p>
				<div class="mt-0 pt-0">
					<p>Pox table entries</p>
					{#each info.poxEntries as entry}
					<div class="text-xs flex  w-full justify-between ">
						<div class="break-words">{address}</div>
						<div class="break-words">Stacker: {entry.stacker}</div>
						<div class="">Cycle: {entry.cycle}</div>
						<div class="">Delegations: {entry.delegations}</div>
						<div class="">Index: {entry.index}</div>
						<div class="">TotalUstx: {fmtNumber(Math.floor(Number(fmtMicroToStx(entry.totalUstx))))}</div>
					</div>
					{/each}
				</div>
			</div>
			{/if}
			{/if}

			{#if info.rewardSlots && info.rewardSlots.length > 0}
			<div>
				<div class="flex justify-between md:w-1/2 text-2xl border-1 rounded-sm py-2 pe-4">
					<h2 class="">Reward slot history</h2>
					<a href="/" class="text-2xl" on:click|preventDefault={() => showRewardSlots = !showRewardSlots}>+</a>
				</div>
			</div>
			{#if showRewardSlots}
			<div>
				<p class="">Entries from pox data map for cycle {$sbtcConfig.poxInfo.current_cycle.id}</p>
				<RewardSlotAnalysis rewardSlots={info.rewardSlots} {address} />
			</div>
			{/if}
			{/if}


	</div>
</div>
		
{:else}
<Placeholder />
{/if}

</div>
