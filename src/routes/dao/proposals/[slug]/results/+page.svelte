<script lang="ts">
	import { onMount } from 'svelte';
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
	import SpaceHolder from '$lib/components/all-voters/SpaceHolder.svelte';

	let soloVotes:Array<VoteEvent>;
	let poolVotes:Array<VoteEvent>;
	let daoVotes:Array<VoteEvent>;
	let method:number = -1;
	let errorReason:string|undefined;
	let proposal:ProposalEvent;
	let balanceAtHeight:number = 0;
	let proposalNotReady = true;
	let activeFlag = false;
	let inited = false;

	onMount(async () => {
		method = Number($page.url.searchParams.get('method')) || 3
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposal = event;
			const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
			DaoUtils.setStatus(stacksTipHeight, proposal);
			daoVotes = await getDaoVotesByProposal(event.contractId);
			const allVotes = await getPoolAndSoloVotesByProposal(event.contractId)
			poolVotes = allVotes.poolVotes;
			soloVotes = allVotes.soloVotes;
			activeFlag = proposal.proposalData && stacksTipHeight >= proposal.proposalData.startBlockHeight
		} else {
			proposalNotReady = true
		}

		if (CONFIG.VITE_NETWORK === 'mainnet') {
			proposalNotReady = true
			activeFlag = false
		}

		try {
			const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposal.proposalData.startBlockHeight);
			balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
		} catch (e:any) {
			balanceAtHeight = 0;
			errorReason = e.message;
		}
		inited = true;
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">

	{#if inited}

		{#if proposal}
		<ProposalHeader {proposal} />
		{/if}

		{#if proposal.stage !== ProposalStage.CONCLUDED}
		<Tabs style="underline" contentClass="py-4">
            <TabItem open={method === 1} on:click={() => goto(`/dao/proposals/${proposal.contractId}/results?method=1`)} title="Solo Stackers">
				<SoloResults {proposal} />
        	</TabItem>
            <TabItem open={method === 2} on:click={() => goto(`/dao/proposals/${proposal.contractId}/results?method=1`)} title="Pool Stackers">
				<PoolResults {proposal} />
            </TabItem>
            <TabItem open={method === 3} on:click={() => goto(`/dao/proposals/${proposal.contractId}/results?method=1`)} title="Non Stackers">
				<DaoResults {proposal} />
            </TabItem>
        </Tabs>
		{:else}
		<DaoInactive {proposal}/>
		{/if}
	{:else}
	<SpaceHolder />
	{/if}

</div>
