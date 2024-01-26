<script lang="ts">
	import { CONFIG } from '$lib/config';
	import { sbtcConfig } from '$stores/stores';
	import { FungibleConditionCode, PostConditionMode, contractPrincipalCV, makeStandardSTXPostCondition, someCV, uintCV } from '@stacks/transactions';
	import { openContractCall } from '@stacks/connect';
	import type { FundingData, ProposalEvent } from '$types/stxeco.type';
	import { fmtMicroToStx, fmtNumber } from 'sbtc-bridge-lib';
	import { onMount } from 'svelte';
	import { getStacksNetwork, loggedIn } from '$lib/stacks_connect';
	import { goto } from '$app/navigation';
	import { processProposalContracts } from '$lib/sbtc_admin';
	import DaoUtils from '$lib/service/DaoUtils';
	import Proposed from './Proposed.svelte';
	import Placeholder from './Placeholder.svelte';

	export let proposal:ProposalEvent;
	let errorMessage:string|undefined;
	let inited = false;
	const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK]

	let amount = 500000;
	let txId: string|undefined;

	let fundingData:FundingData;
	let fundingMet = false;
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let proposalDuration = 0
	let proposalStartDelay = 0
	let startHeightMessage = 'The earliest start for voting is in ';
	let durationMessage = 'The voting window is ';
	let paramStartDelay = 6;
	let paramDuration = 144 //proposalDuration;

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

	const submitOriginal = async () => {
		if (amount < 500000) {
			return
		}
		//const amountUSTX = ChainUtils.toOnChainAmount(amount);
		const amountCV = uintCV(amount);
		const customMajorityCV = someCV(uintCV(6600));
		const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
		let functionArgs = [proposalCV, amountCV, customMajorityCV];
		await openContractCall({
			network: getStacksNetwork(),
			postConditions: getSTXMintPostConds(amount),
			postConditionMode: PostConditionMode.Deny,
			contractAddress: 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z',
			contractName: 'ede008-funded-proposal-submission-v5',
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

	const submitFlexible = async () => {
        if (!loggedIn()) {
          errorMessage = 'Please connect your wallet to vote';
          return;
        }
        if (paramStartDelay < 6 ) {
          errorMessage = 'Start delay minimum is 6 blocks';
          return;
        }
        if (paramStartDelay > 500 ) {
          errorMessage = 'Start delay maximum is 500 blocks';
          return;
        }
        if (paramDuration < 144 ) {
          errorMessage = 'Duration minimum is 144 blocks';
          return;
        }
        if (paramDuration > 5000 ) {
          errorMessage = 'Duration maximum is 5000 blocks';
          return;
        }
		if (amount < 500000) {
			errorMessage = 'Half a STX required to fund';
			return;
		}
		//const amountUSTX = ChainUtils.toOnChainAmount(amount);
		const amountCV = uintCV(amount);
		const paramStartDelayCV = uintCV(paramStartDelay);
		const paramDurationCV = uintCV(paramDuration);
		const customMajorityCV = someCV(uintCV(6600));
		const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
		let functionArgs = [proposalCV, paramStartDelayCV, paramDurationCV, amountCV, customMajorityCV];
		await openContractCall({
			network: getStacksNetwork(),
			postConditions: getSTXMintPostConds(amount),
			postConditionMode: PostConditionMode.Deny,
			contractAddress: CONFIG.VITE_DOA_DEPLOYER,
			contractName: CONFIG.VITE_DOA_FUNDED_SUBMISSION_EXTENSION,
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
		const processResult = await processProposalContracts(proposal.contractId)
		const refreshedProposal = processResult.find((o:ProposalEvent) =>  o.contractId === proposal.contractId )
		if (refreshedProposal) proposal = refreshedProposal; 
		DaoUtils.setStatus(stacksTipHeight, proposal)
		fundingData = proposal.funding;
		if (!fundingData) {
			goto('/dao/proposals/propose')
			return;
		}
		fundingMet = fundingData && fundingData.funding >= fundingData.parameters.fundingCost;
		stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
		proposalDuration = fundingData.parameters.proposalDuration
		proposalStartDelay = fundingData.parameters.proposalStartDelay
		startHeightMessage = 'The earliest start for voting is in ' + proposalStartDelay + ' blocks ' + ((proposalStartDelay) / 144).toFixed(2) + ' days after proposal is funded at block ~ ' + (fmtNumber(stacksTipHeight + proposalStartDelay));
		durationMessage = 'The voting window is ' + (proposalDuration)+ ' blocks, roughly ' + ((proposalDuration) / 144).toFixed(2) + ' days, after voting starts.';
		paramStartDelay = 6;
		paramDuration = 144 //proposalDuration;
		inited = true
	})

	$: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;
</script>

{#if inited}
{#if !fundingMet}
  
<div class="mt-6 md:mt-0 flex flex-col gap-y-2 bg-warning-01">
  
	<h1 class="text-2xl">
		Fund proposal : {fmtMicroToStx(fundingData.parameters.fundingCost - fundingData.funding)} STX needed!
	</h1>
	<div class="mt-6 w-full flex flex-col gap-y-4">
		<div>
			<div>
				<p>{startHeightMessage}</p>
				<p>{durationMessage}</p>
			</div>
			<p class="text-sm font-thin">(minimum contribution is 0.5 STX)</p>
			{#if txId}
				<div>
					<a href={explorerUrl} target="_blank">View on explorer</a>
				</div>
			{/if}
		</div>
		<form on:submit|preventDefault class="form-inline">
			<div class="w-full flex flex-col gap-y-4">
				<div class="w-full">
					<div class={'text-white bg-gray-500 readonly w-full text-xs py-1 px-2 rounded-lg border border-gray-400'} aria-describedby="Contribution">
						{proposal.contractId}
					</div>
				</div>
				<div class="w-full">
					<label class="block" for="start-block">start on or after block</label>
					<input bind:value={paramStartDelay} type="number" id="start-block" class={'text-black w-60 h-[40px] py-1 px-2 rounded-lg border border-gray-400'} aria-describedby="Contribution">
				</div>
				<div class="w-full">
					<label class="block" for="duration-block">voting open for minimum {paramDuration} blocks</label>
					<input bind:value={paramDuration} type="number" id="duration-block" class={'text-black w-60 h-[40px] py-1 px-2 rounded-lg border border-gray-400'} aria-describedby="Contribution">
				</div>
				<div class="w-full">
					<label class="block" for="Contribution">funding required is {fundingData.parameters.fundingCost} uSTX</label>
					<input bind:value={amount} type="number" id="Contribution" class={'text-black w-60 h-[40px] py-1 px-2 rounded-lg border border-gray-400'} aria-describedby="Contribution">
				</div>
				<div>
					<button on:click={() => {submitFlexible()}} class="w-52 justify-center items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
						Fund proposal
					  </button>
				</div>
				{#if errorMessage}<div>{errorMessage}</div>{/if}
			</div>
		</form>
	</div>
</div>
{:else}
<Proposed {proposal} />
{/if}
{:else}
<Placeholder />
{/if}
