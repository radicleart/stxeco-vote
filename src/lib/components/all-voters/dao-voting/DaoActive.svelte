<script lang="ts">
	import ChainUtils from '$lib/service/ChainUtils';
	import { onMount } from 'svelte';
	import PropBallotBox from '$lib/components/dao/voting/PropVotingBallotBox.svelte';
	import SnapBallotBox from '$lib/components/dao/voting/SnapVotingBallotBox.svelte';
	import Modal from '$lib/shared/Modal.svelte';
	import ClaritySytaxHighlighter from '$lib/shared/ClaritySytaxHighlighter.svelte';
	import DaoRules from '$lib/components/dao/proposals/DaoRules.svelte';
	import DaoUtils from '$lib/service/DaoUtils';
	import { ProposalStage, type ProposalEvent, type VoteEvent } from '$types/stxeco.type';
	import { sbtcConfig } from '$stores/stores';
	import { CONFIG } from '$lib/config';
	import { page } from '$app/stores';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import { loggedIn } from '$lib/stacks_connect';
	import DaoResults from './DaoResults.svelte';

	export let proposalEvent: ProposalEvent;
	export let balanceAtHeight:number
	export let daoVotes:Array<VoteEvent>;

	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let showSourceModal: boolean;
	let showRulesModal: boolean;
	$: closeModal = () => {
		showSourceModal = false;
		showRulesModal = false;
	};
	let propStatus = proposalEvent.status?.name;
	let executiveProposalsValid:boolean;
	let color:string;
	let endBlock:number;
	let sourceCode: string | undefined;

	const scrollTo = () => {
		const getMeTo = document.getElementById('voting-section');
		if (getMeTo) getMeTo.scrollIntoView({ behavior: 'smooth' });
	};

	const init = () => {
		const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height || 0;
		endBlock = (proposalEvent.proposalData.endBlockHeight || 0) - stacksTipHeight;
		sourceCode = proposalEvent.contract.source;
		executiveProposalsValid = false;
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
			DaoUtils.setStatus($sbtcConfig.stacksInfo.stacks_tip_height, proposalEvent);
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

<div class=" rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
	<div class="flex justify-between">
		<h2 class="text-2xl ">Voting through Ecosystem DAO</h2>
		<a href="/" on:click|preventDefault={() => showSourceModal = !showSourceModal}>show results</a>
	</div>
	<p class="">Vote with your liquid STX balance using your <span class="font-bold">Leather / Xverse wallet</span> </p>
	<p class="text-warning-500">No STX is spent by voting but you will pay a gas fee.</p>
	{#if loggedIn()}
	{#if propStatus === 'voting'}
		{#if proposalEvent.proposalData && proposalEvent.votingContract === CONFIG.VITE_DOA_PROPOSAL_VOTING_EXTENSION}
		<PropBallotBox {proposalEvent} />
		{:else if proposalEvent.proposalData && proposalEvent.votingContract === CONFIG.VITE_DOA_SNAPSHOT_VOTING_EXTENSION}
		<SnapBallotBox {proposalEvent} {balanceAtHeight} />
		{:else}
		<SnapBallotBox {proposalEvent} {balanceAtHeight} />
		{/if}
		{#if proposalEvent.stage === ProposalStage.PROPOSED && stacksTipHeight < proposalEvent.proposalData.startBlockHeight}
		Voting starts in {proposalEvent.proposalData.startBlockHeight - stacksTipHeight} blocks
		{/if}
	{:else if proposalEvent.stage === ProposalStage.PARTIAL_FUNDING || proposalEvent.stage === ProposalStage.UNFUNDED}
		<a href={'/dao/proposals/' + proposalEvent.contractId} >Fund this proposal</a>
	{:else}
		<a href={'/dao/proposals/' + proposalEvent.contractId} >Goto result page</a>
	{/if}

	{:else}
	<div class="flex flex-col gap-y-4">
		<p class="text-warning-500">Connect your wallet to vote</p>
	</div>
	{/if}

	{#if daoVotes && showSourceModal}
	<div>
		<DaoResults proposal={proposalEvent} {daoVotes} />
	</div>
	{/if}
</div>
  
