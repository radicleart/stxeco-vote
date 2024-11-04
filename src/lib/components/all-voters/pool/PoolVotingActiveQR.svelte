<script lang="ts">
	import { onMount } from 'svelte';
	import Invoice from './Invoice.svelte';
	import { sessionStore } from '$stores/stores';
	import { openSTXTransfer } from '@stacks/connect';
	import { isLoggedIn } from '@mijoco/stx_helpers/dist/account';
	import { getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers';
	import { fmtNumber, getAddressId } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import ChainUtils from '$lib/service/ChainUtils';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';

	const dispatch = createEventDispatcher();

	export let proposal: VotingEventProposeProposal;
	let stackerData = proposal.stackerData!;
	export let lockedBalanceAtHeight: number;
	export let totalBalanceAtHeight: number;

	let height =
		proposal.stackerData?.heights?.stacksStart || proposal.proposalData?.startBlockHeight;

	let showStxTransfer = false;
	let txId: string;
	let errorMessage: string | undefined;
	let vforCurrent: boolean;
	let inited = false;

	const castVote = async (vfor: boolean) => {
		if (!isLoggedIn()) {
			vforCurrent = vfor;
			errorMessage = 'Please connect your wallet to vote';
			return;
		}
		await openSTXTransfer({
			amount: '1',
			network: getStacksNetwork(getConfig().VITE_NETWORK),
			recipient: vfor ? stackerData.stacksAddressYes : stackerData.stacksAddressNo,
			onFinish: (data) => {
				txId = data.txId;
				console.log('finished contract call!', data);
				localStorage.setItem('VOTED_FLAG' + getAddressId(), JSON.stringify(proposal.proposal));
				localStorage.setItem('VOTED_TXID_2' + getAddressId(), txId);
				//window.location.reload()
				//goto(`/dao/proposals/${proposal.proposal}/badge`);
				dispatch('voting_event', { txId, event: 'pool' });
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	};

	onMount(async () => {
		let locked = $sessionStore.keySets[getConfig().VITE_NETWORK].tokenBalances?.stx?.locked;
		locked = Number(locked);
		if (locked && locked > 0) showStxTransfer = true;
		inited = true;
	});
</script>

{#if inited}
	<div>
		{#if isLoggedIn()}
			{#if totalBalanceAtHeight <= 0}
				<div class="text-sm text-warning-700 mb-4">
					Your balance at block height {fmtNumber(height)} was 0 - ie no voting power from the connected
					wallet.
				</div>
			{:else}
				<div class="text-sm mb-4">
					Total voting power (in connected account): {ChainUtils.fromMicroAmount(
						totalBalanceAtHeight
					)} STX (of which locked:
					{ChainUtils.fromMicroAmount(lockedBalanceAtHeight)})
				</div>
			{/if}
		{/if}
		<div class="flex flex-col gap-x-3 gap-y-8">
			<div class="w-full pt-8 px-8 bg-[#F4F3F0] rounded-2xl">
				{#if isLoggedIn() && totalBalanceAtHeight > 0}
					<div class="mb-8">
						<button
							on:click={() => {
								castVote(true);
							}}
							class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50"
						>
							Vote yes
						</button>
						{#if errorMessage && vforCurrent}
							<div class="mt-3 w-full flex justify-start gap-x-4">
								{errorMessage}
							</div>
						{/if}
					</div>
				{/if}
				<div class="mb-5">Or, send from stacking address in desktop wallet</div>
				<Invoice address={stackerData.stacksAddressYes} voteFor={true} />
			</div>

			<div class="w-full pt-8 px-8 bg-[#F4F3F0] rounded-2xl">
				{#if isLoggedIn() && totalBalanceAtHeight > 0}
					<div class="mb-8">
						<button
							on:click={() => {
								castVote(false);
							}}
							class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50"
						>
							Vote no
						</button>
						{#if errorMessage && !vforCurrent}
							<div class="mt-3 w-full flex justify-start gap-x-4">
								{errorMessage}
							</div>
						{/if}
					</div>
				{/if}
				<div class="mb-5">Or, send from stacking address in desktop wallet</div>
				<Invoice address={stackerData.stacksAddressNo} voteFor={false} />
			</div>
		</div>
	</div>
{/if}
