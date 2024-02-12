<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { sbtcConfig } from '$stores/stores';
	import { page } from '$app/stores';
	import { CONFIG } from '$lib/config';
	import DaoUtils from '$lib/service/DaoUtils';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import ChainUtils from '$lib/service/ChainUtils';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT, getDaoVotesByProposal, getPoolAndSoloVotesByProposal } from '$lib/dao_api';
	import { ProposalStage, type ProposalEvent, type VoteEvent } from '$types/stxeco.type';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import DaoResults from '$lib/components/all-voters/dao-voting/DaoResults.svelte';
	import PoolResults from '$lib/components/all-voters/pool/PoolResults.svelte';
	import SoloResults from '$lib/components/all-voters/solo/SoloResults.svelte';
	import { goto } from '$app/navigation';
	import Placeholder from '$lib/components/all-voters/Placeholder.svelte';
	import VoteResultsOverview from '$lib/components/all-voters/VoteResultsOverview.svelte';
	import HoldingResults from '$lib/components/all-voters/HoldingResults.svelte';
	import { isCoordinator } from '$lib/sbtc_admin';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';

	let soloVotes:Array<VoteEvent>;
	let poolVotes:Array<VoteEvent>;
	let daoVotes:Array<VoteEvent>;
	let countTotal:number = 0;
	let componentKey:number = 0;
	let method:number = -1;
	let errorReason:string|undefined;
	let proposal:ProposalEvent;
	let balanceAtHeight:number = 0;
	let proposalNotFound = false;
	let activeFlag = false;
	let approved = false;
	let inited = false;

	const changeMethod = async (e:any, newMethod:number) => {
    	e.preventDefault();
		method = newMethod
		$page.url.searchParams.set('method', '' + method)
		goto(`?${$page.url.searchParams.toString()}`);
		const getMeTo = document.getElementById("tabs-header");
		await tick();
  		if (getMeTo) getMeTo.scrollTo({behavior: 'smooth'});
		return false;
	}

	const blockSinceEnd = () => {
		return $sbtcConfig.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT
	}

	const isApproved = () => {
		approved = $sbtcConfig.stacksInfo?.burn_block_height > NAKAMOTO_VOTE_STOPS_HEIGHT
	}

	const voteConcluded = () => {
		if (!proposal || !proposal.proposalData) return false
		if (isCoordinator($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)) return true
		if (method === 3) return proposal.stage === ProposalStage.CONCLUDED
		else {
			return $sbtcConfig.stacksInfo?.burn_block_height > NAKAMOTO_VOTE_STOPS_HEIGHT
		}
	}

	onMount(async () => {
		method = Number($page.url.searchParams.get('method')) || 3
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposal = event;
			const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
			const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
			DaoUtils.setStatus(method, burnHeight, stacksTipHeight, proposal);
			daoVotes = await getDaoVotesByProposal(event.contractId) || [];
			const allVotes = await getPoolAndSoloVotesByProposal(event.contractId)
			poolVotes = allVotes.poolVotes || [];
			soloVotes = allVotes.soloVotes || [];
			countTotal = daoVotes.length + poolVotes.length + soloVotes.length
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

		if (CONFIG.VITE_NETWORK === 'mainnet' && !isCoordinator($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)) {
			proposalNotFound = true
			activeFlag = false
		}
		inited = true
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">

	{#if inited}

		<ProposalHeader {proposal} method={1} />
		<div class="flex flex-col w-full my-8">
			<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
		  
			  <div class="">
				{#if blockSinceEnd() > 0}
				<div class="mb-3 max-w-md">
					<h2 class="text-[#131416] text-2xl mb-3">Voting ended</h2>
				  <p>Voting ended {blockSinceEnd()} blocks ago</p>
				  <p>{countTotal} unique addresses took part in the vote. Detailed results are displayed below.</p>
				</div>
				{:else}
				<div class="mb-3 max-w-md">
					<h2 class="text-[#131416] text-2xl mb-3">Voting in progress</h2>
					<p>Voting ends in {- blockSinceEnd()} blocks</p>
					<p>{countTotal} unique addresses took part in the vote. Detailed results are displayed below.</p>
				</div>
				{/if}
				</div>
		  
			  <NakamotoBackground />
			  <NakamotoShield />
			</div>
		  </div>
		  
		{#if voteConcluded()}
		<div id="tabs-header">
			<VoteResultsOverview {approved} />
		</div>
		<div >
		<Tabs  style="underline" contentClass="py-4">
			{#key componentKey}
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
					open={method === 1} on:keyup={(e) => changeMethod(e, 1)} title="Solo Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<SoloResults {proposal} {soloVotes} />
				</div>
        	</TabItem>
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
			open={method === 2} on:keyup={(e) => changeMethod(e, 2)} title="Pool Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<PoolResults {proposal} {poolVotes} />
				</div>
            </TabItem>
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
					open={method === 3} on:keyup={(e) => changeMethod(e, 3)} title="Non Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<DaoResults {proposal} {daoVotes} />
				</div>
            </TabItem>
			{/key}
        </Tabs>
		</div>
		{:else}
		<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
			<div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
				<HoldingResults />
			</div>
		</div>
		{/if}

	{:else}
	<Placeholder />
	{/if}

</div>
