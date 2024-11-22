<script lang="ts">
	import DaoUtils from '$lib/service/DaoUtils';
	import { onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import VoteResults2Table from './VoteResults2Table.svelte';
	import AddressLookup from '../all-voters/AddressLookup.svelte';
	import { Tooltip } from 'flowbite-svelte';
	import { csvMaker } from '$lib/utils';
	import type { VoteEvent, VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { isCoordinator } from '$lib/proposals';

	export let proposal: VotingEventProposeProposal;
	export let bitcoinVotes: Array<VoteEvent> = [];
	export let stacksVotes: Array<VoteEvent> = [];

	let votes: Array<VoteEvent> = [];
	let allVotes: Array<VoteEvent> = [];

	let includeZeros = false;
	let showVotes = false;
	let showAddressLookup = false;
	let componentKey = 0;
	let sortDir = '';
	let sortField = 'voter';
	let inited = false;

	const download = () => {
		const csvVotes = [];
		for (const vote of votes) {
			csvVotes.push({
				voter: vote.voter,
				txid: vote.submitTxId,
				for: vote.for,
				total: vote.amount,
				locked: vote.amountLocked
			});
		}
		csvMaker(csvVotes, 'nakamoto-solo-votes.csv');
	};

	const reorder = (sf: string) => {
		sortField = sf;
		sortDir = sortDir === '-' ? '' : '-';
		componentKey++;
	};

	const openAddressLookup = () => {
		showAddressLookup = !showAddressLookup;
		showVotes = false;
	};

	const toggleVotes = async () => {
		showVotes = !showVotes;
	};

	const filterVotes = async () => {
		if (includeZeros) {
			votes = allVotes;
		} else {
			votes = allVotes?.filter((o: VoteEvent) => o.amount > 0) || [];
		}
		showVotes = true;
	};

	onMount(async () => {
		includeZeros = true; // double negative here!
		votes = bitcoinVotes.concat(stacksVotes);
		if (proposal) inited = true;
	});

	$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

{#if inited}
	<Tooltip class="w-auto !font-extralight !bg-black z-20" triggeredBy="#analysis-label">
		Toggle between all votes and eligible votes - some pool and solo votes were submitted by
		non-stackers.
	</Tooltip>

	{#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
		<div class="flex justify-between">
			<a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => toggleVotes()}
				>{#if !showVotes}Show{:else}Hide{/if} transaction details</a
			>
			<div class="flex gap-x-1 me-10">
				<div>
					<a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => download()}
						>to csv</a
					>
				</div>
			</div>
		</div>
	{/if}

	{#if showVotes}
		<!--
		<div class="grid grid-cols-6 w-full justify-evenly mt-6 border-b border-gray-300 pb-3 mb-3">
			<div class="col-span-2">
				<a href="/" class="pointer w-1/2" on:click|preventDefault={() => reorder('voter')}>Voter</a>
			</div>
			<div>
				<a href="/" class="pointer" on:click|preventDefault={() => reorder('amount')}>Power</a>
			</div>
			<div>
				<a href="/" class="pointer" on:click|preventDefault={() => reorder('burnBlockHeight')}
					>Height</a
				>
			</div>
			<div>
				<a href="/" class="pointer" on:click|preventDefault={() => reorder('for')}>For/Against</a>
			</div>
			<div>
				<a href="/" class={'text-lg text-gray-400'} on:click|preventDefault={() => download()}
					>to csv</a
				>
			</div>
		</div>
		-->
		{#key componentKey}
			<VoteResults2Table {votes} />
		{/key}
	{/if}
	{#if showAddressLookup}
		<AddressLookup
			lookupMode={true}
			walletAddress={$sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress}
		/>
	{/if}
{/if}
