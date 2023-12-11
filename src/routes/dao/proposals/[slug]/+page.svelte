	<script lang="ts">
	import ChainUtils from '$lib/service/ChainUtils';
	import {onMount} from 'svelte'
	import DaoUtils from '$lib/service/DaoUtils';
	import { ProposalStage, type ProposalEvent } from '$types/stxeco.type';
	import { sbtcConfig } from '$stores/stores';
	import { CONFIG } from '$lib/config';
	import { page } from '$app/stores';
	import ProposalFull from '$lib/components/dao/proposals/ProposalFull.svelte';
	import { goto } from '$app/navigation';
	import { getBalanceAtHeight } from '$lib/bridge_api';
		
	let proposalEvent:ProposalEvent;
	let balanceAtHeight:number
	
	onMount(async () => {
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
		if (event) {
			proposalEvent = event;
			DaoUtils.setStatus($sbtcConfig.stacksInfo.stacks_tip_height, proposalEvent);
			console.log(event)
		} else {
			goto('/dao/proposals/propose')
		}

		try {
			const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposalEvent.proposalData.startBlockHeight);
			balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
		} catch (e) {
			balanceAtHeight = 0;
			console.log(e)
		}
	})
	</script>
	
	<svelte:head>
		<title>Ecosystem DAO</title>
		<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
	</svelte:head>
	
<div class="py-6 mx-auto max-w-4xl md:px-6 ">
	<div class="flex flex-col w-full my-8 max-w-4xl">
		<div class="flex flex-col gap-y-4 w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
			{#if !proposalEvent}
			<div class="cols-12"><h1 class={'text-warning-500 text-2xl'}><span class={'strokeme-info'}>SIP Voting is Coming Soon</span></h1></div>
			<div class="cols-12">
				<p class="strapline">The proposal for SIP (Stacks Upgrade) will be deployed soon.</p>
				<p class="strapline">Voting will end roughly 4 weeks after the proposal opens.</p>
			</div>
			{:else}
				<ProposalFull {proposalEvent} {balanceAtHeight} />
			{/if}
		</div>
	</div>
</div>
