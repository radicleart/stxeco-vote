<script lang="ts">
	import arrowDown from '$lib/assets/png-assets/stx_eco_arrow_down.png';
	import ChainUtils from '$lib/service/ChainUtils';
	import { onMount } from 'svelte';
	import VotingSchedule from '$lib/components/dao/voting/VotingSchedule.svelte';
	import PropBallotBox from '$lib/components/dao/voting/PropVotingBallotBox.svelte';
	import SnapBallotBox from '$lib/components/dao/voting/SnapVotingBallotBox.svelte';
	import { goto } from '$app/navigation';
	import EmergencyExecuted from '$lib/components/dao/proposals/EmergencyExecuted.svelte';
	import Modal from '$lib/components/shared/Modal.svelte';
	import ClaritySytaxHighlighter from '$lib/components/shared/ClaritySytaxHighlighter.svelte';
	import DaoRules from '$lib/components/dao/proposals/DaoRules.svelte';
	import Funding from '$lib/components/all-voters/Funding.svelte';
	import ThresholdSubmissionVoting from '$lib/components/dao/submission/ThresholdSubmissionVoting.svelte';
	import EmergencyExecuteSubmission from '$lib/components/dao/submission/EmergencyExecuteSubmission.svelte';
	import ExecutiveProposalSubmission from '$lib/components/dao/submission/ExecutiveProposalSubmission.svelte';
	import Preamble from '$lib/components/all-voters/Preamble.svelte';
	import DaoUtils from '$lib/service/DaoUtils';
	import Countdown from '$lib/components/shared/Countdown.svelte';
	import FormatUtils from '$lib/service/FormatUtils';
	import { ProposalStage, type ProposalEvent } from '$types/stxeco.type';
	import { sbtcConfig } from '$stores/stores';
	import { CONFIG } from '$lib/config';
	import { page } from '$app/stores';
	import { stacksStore } from '$stores/stacksStore';
	import { explorerAddressUrl } from '$lib/utils';
	import VotingRules from './VotingRules.svelte';
	import { fmtMicroToStx, fmtNumber } from 'sbtc-bridge-lib';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import { loggedIn } from '$lib/stacks_connect';

	export let proposalEvent: ProposalEvent;
	export let balanceAtHeight:number
	let showSourceModal: boolean;
	let showRulesModal: boolean;
	$: closeModal = () => {
		showSourceModal = false;
		showRulesModal = false;
	};
	let propStatus = proposalEvent.status?.name;
	let fundedProposalsValid:boolean;
	let executiveProposalsValid:boolean;
	let emergencyProposalsValid:boolean;
	let thresholdProposalsValid:boolean;
	let color:string;
	let endBlock:number;
	let sourceCode: string | undefined;
	let showDetails = false;

	const scrollTo = () => {
		const getMeTo = document.getElementById('voting-section');
		if (getMeTo) getMeTo.scrollIntoView({ behavior: 'smooth' });
	};

	const init = () => {
		const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height || 0;
		endBlock = (proposalEvent.proposalData.endBlockHeight || 0) - stacksTipHeight;
		sourceCode = proposalEvent.contract.source;

		const thresholdProposalExt = proposalEvent.submissionData.contractId.indexOf( 'ede002-threshold-proposal-submission') > -1
		thresholdProposalsValid = thresholdProposalExt; // && thresholdProposalExt.valid;
		fundedProposalsValid = true //&& fundedProposalExt.valid;
		executiveProposalsValid = false;
		emergencyProposalsValid = true;
		color = proposalEvent.status?.color || 'blue';
	}

	onMount(async () => {
		if ($sbtcConfig.proposals) {
			const index = $sbtcConfig.proposals?.findIndex((o) => {
				o.contractId === $page.params.slug;
			});
			if (typeof index === 'number' && index > -1) {
				proposalEvent = $sbtcConfig.proposals[index];
			}
		}
		if (proposalEvent) {
			const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
			const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
			DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposalEvent);

			//if (proposalEvent.contractId.indexOf('edp015-sip-015-activation') > -1) {
			//	goto(`/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.edp-sip-activation`);
			//}
			propStatus = proposalEvent.status?.name || 'unknown';
			if (proposalEvent.proposalData) {
				try {
					const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposalEvent.proposalData.startBlockHeight)
					balanceAtHeight = ChainUtils.fromMicroAmount(
						Number(response.stx.balance) - Number(response.stx.locked)
					);
				} catch (e) {
					balanceAtHeight = 0;
					console.log(e);
				}
			}
		}
	});
</script>

<Modal showModal={showSourceModal || showRulesModal} on:click={closeModal}>
	{#if showSourceModal}
		<div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
	{:else}
		<div class="blog-modal"><DaoRules /></div>
	{/if}
	<div slot="title">
		{#if showSourceModal}
			<h3>Proposal: {proposalEvent.contractId.split('.')[1]}</h3>
		{/if}
	</div>
</Modal>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta
		name="description"
		content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin"
	/>
</svelte:head>

<div class="row">
	{#if proposalEvent.stage === ProposalStage.PARTIAL_FUNDING || proposalEvent.stage === ProposalStage.UNFUNDED}
		<div>
			<h1 class={''}>
				<a href={'/dao/proposals/' + proposalEvent.contractId} >Fund this proposal</a>
			</h1>
		</div>
	{:else}
		<div>
			<h1 class={'text-primary-500 text-4xl'}>
				<span class={'text-primary-300'}>Proposal:</span> {proposalEvent.proposalMeta.title}
			</h1>
		</div>
		{#if loggedIn()}
		<div class="flex flex-col gap-y-4">
			<p>Use your STX balance to represent your vote</p>
			<p>Voters who are Stacking via an exchange or not Stacking at all (and have a STX balance below the Stacking minimum) can connect their wallets to EcosystemDAO and use the amount of STX in their wallet to represent a ‘Yes on 2.1’ vote or a ‘No on 2.1’ vote.</p>
			{#if $sbtcConfig.stacksInfo.stacks_tip_height < proposalEvent.proposalData.startBlockHeight}
			<p class="text-warning-500">Your STX balance is {balanceAtHeight}.</p>
			{:else}
			<p class="text-warning-500">Your STX balance at block height {fmtNumber(proposalEvent.proposalData.startBlockHeight)} was {balanceAtHeight}.</p>
			{/if}
		</div>
		{:else}
		<div class="flex flex-col gap-y-4">
			<p class="text-warning-500">Connect your wallet to vote</p>
		</div>
		{/if}
	{/if}
</div>
<div class="my-5 flex border-t border-b justify-around text-sm">
	<button
		class={'text-primary-700'}
		on:click|preventDefault={() => {
          goto(`/dao/proposals/${proposalEvent.contractId}/badge`);
		}}>badge</button
	>
	<a class={'text-primary-700'} href={explorerAddressUrl(CONFIG.VITE_DOA_DEPLOYER + '.' + CONFIG.VITE_DOA_SNAPSHOT_VOTING_EXTENSION)} target="_blank">explorer</a>
	<a class={'text-primary-700'} href="/" on:click|preventDefault={() => showDetails = !showDetails}>show details</a>
	<button
		class={'text-primary-700'}
		on:click|preventDefault={() => {
			goto(`/dao/proposals`);
		}}>back</button
	>
</div>

{#if showDetails}
<VotingRules {balanceAtHeight} {proposalEvent} />
{/if}

<!--
<div class="d-flex justify-content-center">
	<div>
		<a href="/" class="pointer text-akrobat-thin" on:click|preventDefault={() => scrollTo()}><img class="mx-4" src={arrowDown} alt="Scroll down" width="30" height="auto" /> scroll to
			vote</a>
	</div>
</div>
-->

<div class="flex flex-col md:flex-row gap-10" id="voting-section">
	<div class="w-full md:w-1/2 flex flex-col gap-y-2">
		<div class="flex flex-col border-[0.5px] border-gray-500 rounded-lg p-2 sm:p-5 overflow-hidden bg-gray-1000">
			<h4 class={'text-2xl text-' + proposalEvent.status?.colorCode}>Proposal</h4>
			<VotingSchedule {proposalEvent} />
			<div class="mt-4"><Preamble proposal={proposalEvent} /></div>
		</div>
	</div>
	<div class="w-full md:w-1/2">
		<div>
			{#if propStatus === 'emergexec'}
				<EmergencyExecuted {proposalEvent} />
			{:else if propStatus === 'commencing soon' || propStatus === 'failed' || propStatus === 'passed' || propStatus === 'concluded' || propStatus === 'voting ended' || propStatus === 'voting'}
				{#if proposalEvent.proposalData && proposalEvent.votingContract === CONFIG.VITE_DOA_PROPOSAL_VOTING_EXTENSION}
					<PropBallotBox {proposalEvent} />
				{:else if proposalEvent.proposalData && proposalEvent.votingContract === CONFIG.VITE_DOA_SNAPSHOT_VOTING_EXTENSION}
					<SnapBallotBox {proposalEvent} {balanceAtHeight} />
				{:else}
					<SnapBallotBox {proposalEvent} {balanceAtHeight} />
				{/if}
				{#if !loggedIn()}<div>Connect wallet to vote</div>{/if}
			{:else if propStatus === 'deployed' || propStatus === 'deploying' || propStatus === 'submitted' || propStatus === 'submitting'}
				<div>
					{#if fundedProposalsValid}
						<div>
							<Funding proposal={proposalEvent} />
							<Countdown scaleFactor={1} {endBlock} />
						</div>
					{/if}
					{#if thresholdProposalsValid}
						<div>
							<ThresholdSubmissionVoting proposal={proposalEvent} />
						</div>
					{/if}
					{#if executiveProposalsValid && $sbtcConfig.userSettings.executiveTeamMember}
						<div>
							<ExecutiveProposalSubmission proposal={proposalEvent} />
						</div>
					{/if}
				</div>
			{/if}
			{#if emergencyProposalsValid && $sbtcConfig.userSettings.executiveTeamMember}
				<div class="mb-3">
					<EmergencyExecuteSubmission proposal={proposalEvent} />
				</div>
			{/if}
		</div>
	</div>
</div>
