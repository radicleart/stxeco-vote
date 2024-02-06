<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Skeleton, Tabs, TabItem } from 'flowbite-svelte';
	import { sbtcConfig } from '$stores/stores';
	import { page } from '$app/stores';
	import { CONFIG } from '$lib/config';
	import DaoUtils from '$lib/service/DaoUtils';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import ChainUtils from '$lib/service/ChainUtils';
	import { getDaoVotesByProposal, getPoolAndSoloVotesByProposal } from '$lib/dao_api';
	import { ProposalStage, type ProposalEvent, type VoteEvent } from '$types/stxeco.type';
	import ProposalHeader from '$lib/components/all-voters/ProposalHeader.svelte';
	import DaoResults from '$lib/components/all-voters/dao-voting/DaoResults.svelte';
	import PoolResults from '$lib/components/all-voters/pool/PoolResults.svelte';
	import SoloResults from '$lib/components/all-voters/solo/SoloResults.svelte';
	import DaoInactive from '$lib/components/all-voters/dao-voting/DaoInactive.svelte';
	import { goto } from '$app/navigation';
	import Placeholder from '$lib/components/all-voters/Placeholder.svelte';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';
	import PoolVotingActiveQr from '$lib/components/all-voters/pool/PoolVotingActiveQR.svelte';
	import VoteResultsOverview from '$lib/components/all-voters/VoteResultsOverview.svelte';
	import VoteResultsRow from '$lib/components/all-voters/VoteResultsRow.svelte';

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
	let inited = false;
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	const tabClass = "bg-lightgray text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"

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

	onMount(async () => {
		method = Number($page.url.searchParams.get('method')) || 3
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposal = event;
			const burn_block_height = $sbtcConfig.stacksInfo.burn_block_height;
			DaoUtils.setStatus(burn_block_height, proposal);
			daoVotes = await getDaoVotesByProposal(event.contractId);
			const allVotes = await getPoolAndSoloVotesByProposal(event.contractId)
			poolVotes = allVotes.poolVotes;
			soloVotes = allVotes.soloVotes;
			countTotal = daoVotes.length + poolVotes.length + soloVotes.length
			activeFlag = proposal.proposalData && stacksTipHeight >= proposal.proposalData.startBlockHeight
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

		if (CONFIG.VITE_NETWORK === 'mainnet') {
			proposalNotFound = true
			activeFlag = false
		}

		if (!proposalNotFound) inited = true;
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">

	{#if inited}

		{#if proposal}
		<ProposalHeader {proposal} method={1} />
		{/if}
		<DaoInactive {proposal}/>
		<!--
		<div>
			<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
				<div class="py-10 px-10 md:px-12 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
					<div class="flex flex-col gap-y-12">
						<div class="flex flex-col gap-y-5">
							<p class="text-2xl mb-5">Voting ended</p>
							<p>Voting ended <span class="font-bold">{stacksTipHeight - proposal.proposalData.endBlockHeight} blocks ago</span>.</p>
							<p><span class="font-extrabold">{countTotal} unique addresses</span> took part in the vote.</p>
							<p>Detailed results are displayed below.</p>
						</div>
					</div>
					<NakamotoBackground />
					<NakamotoShield />
				</div>
			</div>
		</div>
		-->

		{#if proposal.stage !== ProposalStage.CONCLUDED}

		<div id="tabs-header">
			<VoteResultsOverview />
		</div>
		<div >
		<Tabs  style="underline" contentClass="py-4">
			{#key componentKey}
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
					open={method === 1} on:keyup={(e) => changeMethod(e, 1)} title="Solo Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<SoloResults {proposal} />
				</div>
        	</TabItem>
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
			open={method === 2} on:keyup={(e) => changeMethod(e, 2)} title="Pool Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<PoolResults {proposal} />
				</div>
            </TabItem>
            <TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
					open={method === 3} on:keyup={(e) => changeMethod(e, 3)} title="Non Stackers" >
				<div class="bg-lightgray py-8 px-4">
					<DaoResults {proposal} />
				</div>
            </TabItem>
			{/key}
        </Tabs>
		</div>
		{/if}
	{:else if proposalNotFound}
	<div>Proposal not found - please return <a href="/" class="underline">home</a>.</div>
	{:else}
	<Placeholder />
	{/if}

</div>
