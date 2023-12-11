<script lang="ts">
	import { Button } from 'flowbite-svelte'
	import ChainUtils from '$lib/service/ChainUtils';
	import { getNotificationsContext } from 'svelte-notifications';
	import { CONFIG } from '$lib/config';
	import { sbtcConfig } from '$stores/stores';
	import { FungibleConditionCode, PostConditionMode, contractPrincipalCV, makeStandardSTXPostCondition, someCV, uintCV } from '@stacks/transactions';
	import { openContractCall } from '@stacks/connect';
	import type { FundingData, ProposalEvent } from '$types/stxeco.type';
	import { fmtMicroToStx, fmtNumber } from 'sbtc-bridge-lib';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	export let proposal:ProposalEvent;
	const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK]
	
	const { addNotification } = getNotificationsContext();
	const fundingData:FundingData = proposal.funding;
	const fundingMet = fundingData.funding >= fundingData.parameters.fundingCost;
	const balance = $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress;
	const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let proposalDuration = fundingData.parameters.proposalDuration
	let proposalStartDelay = fundingData.parameters.proposalStartDelay
	const startHeightMessage = 'The earliest start for voting is ' + ((proposalStartDelay) / 144).toFixed(2) + ' days after proposal is funded at block ~ ' + (fmtNumber(stacksTipHeight + proposalStartDelay));
	const durationMessage = 'The voting window is ' + (proposalDuration)+ ' blocks, roughly ' + ((proposalDuration) / 144).toFixed(2) + ' days, after voting starts.';
	
	const getSTXMintPostConds = function (amt:number) {
		const postConds = []
		if (!account.stxAddress) return [];
		const amount = amt; // ChainUtils.toOnChainAmount(amt, 0)
		postConds.push(makeStandardSTXPostCondition(
			account.stxAddress,
			FungibleConditionCode.LessEqual,
			amount
		))
		return postConds
	}
	
	let amount = 1;
	let txId: string;
	const color = proposal.status?.color;
	
	const submit = async () => {
		if (amount < 1) {
			addNotification({
				position: 'bottom-right',
				heading: 'Please fix',
				type: 'error',
				description: 'Minimum contribution is 1 STX',
			});
			return
		}
		const fundedProposalExt = CONFIG.VITE_DOA_FUNDED_SUBMISSION_EXTENSION;
		const amountUSTX = ChainUtils.toOnChainAmount(amount);
		const amountCV = uintCV(amountUSTX);
		const customMajorityCV = someCV(uintCV(6600));
		const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
		let functionArgs = [proposalCV, amountCV, customMajorityCV];
		await openContractCall({
			postConditions: getSTXMintPostConds(amountUSTX),
			postConditionMode: PostConditionMode.Deny,
			contractAddress: CONFIG.VITE_DOA_DEPLOYER,
			contractName: fundedProposalExt,
			functionName: 'fund',
			functionArgs: functionArgs,
			onFinish: async (data) => {
				proposal.status = { name: 'submitting', color: '', colorCode: '' },
				txId = data.txId
				proposal.submitTxId = data.txId
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	}

	onMount(async () => {
	})
	
	$: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;
	</script>
	
{#if !fundingMet}
<div class="flex flex-col">
	<h5 class="text-2xl font-normal">
		{fmtMicroToStx(fundingData.parameters.fundingCost - fundingData.funding)} STX needed!
	</h5>
	<div class="w-full flex flex-col gap-y-4">
		<p class="text-sm font-thin">(minimum contribution is 1 STX)</p>
		{#if txId}
			<div>
				<a href={explorerUrl} target="_blank">View on explorer</a>
			</div>
		{/if}
		<form on:submit|preventDefault class="form-inline">
			<div class="w-full flex flex-col gap-y-4">
				<div class="w-full">
					<input class={'text-black w-full h-[40px] py-1 px-2 rounded-lg border border-gray-400'} bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution">
				</div>
				<div class="">
					<Button on:click={() => submit()} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-xl border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
						Fund
					</Button>
				</div>
			</div>
		</form>
		<p class="sub-text">Your current balance is {balance} STX</p>
	</div>
</div>
<div class="" >
	<div class="">
		<p>{startHeightMessage}</p>
		<p>{durationMessage}</p>
	</div>
</div>
{:else}
<div class="flex flex-col gap-y-10">
	<p>Funding target met {fmtMicroToStx(fundingData.funding)} of {fmtMicroToStx(fundingData.parameters.fundingCost)} STX raised</p>
	<p>{startHeightMessage}</p>
	<p>{durationMessage}</p>
</div>
{/if}
	
	<style>
	p {
		color: #ededed;
		padding: 3px;
		margin: 0 !important;
		font-size: 1.0rem;
	}
	.sub-text {
		font-size: 0.95rem;
	}
	</style>
	