<script lang="ts">
	import { page } from '$app/stores';
	import RangeSlider from "svelte-range-slider-pips";
	import { PostConditionMode, contractPrincipalCV, uintCV } from '@stacks/transactions';
	import { openContractCall } from '@stacks/connect';
	import { sessionStore } from '$stores/stores';
	import type { InFlight, ProposalEvent } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import type { DaoStore, SessionStore } from '@mijoco/stx_helpers/dist/index';
	import { daoStore } from '$stores/stores_dao';
	
	export let proposal:ProposalEvent;
	
	const stacksTipHeight = $sessionStore.stacksInfo.stacks_tip_height;
	let minStartHeight = 100 //Number($settings.daoProperties?.find((o) => o.id === 'minimum-proposal-start-delay')?.value) + 1 || 0;
	let maxStartHeight = 200 //Number($settings.daoProperties?.find((o) => o.id === 'maximum-proposal-start-delay')?.value) || 100;
	const startHeightMessage = 'Currently at block ' + stacksTipHeight + '. Earliest start for voting is block ' + (stacksTipHeight + minStartHeight) + ' ~ ' + (minStartHeight / 144).toFixed(2) + ' days and latest is ' + (stacksTipHeight + maxStartHeight) + ' ~ ' + (maxStartHeight / 144).toFixed(2) + ' days.';
	
	let propStart = minStartHeight + stacksTipHeight+ 1
	$: startHeight = [minStartHeight + stacksTipHeight+ 1];
	const changeToken = (choice: { detail: { value: number; }; }) => {
		startHeight = [choice.detail.value]
		propStart = startHeight[0]
	}
	const submit = async () => {
		proposal.proposalData.startBlockHeight = propStart
		const startHeight = uintCV(propStart)
		const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
		let functionArgs = [proposalCV, startHeight]
		await openContractCall({
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: getConfig().VITE_DOA_DEPLOYER,
			contractName: 'ede002-threshold-proposal-submission',
			functionName: 'propose',
			functionArgs: functionArgs,
			onFinish: data => {
				daoStore.update((conf:DaoStore) => {
					if (!conf.daoData) conf.daoData = {} as InFlight;
					conf.daoData = {
						name: 'Propose',
						txid: data.txId
					}
					return conf;
				})
			},
			onCancel: () => {
				console.log('popup closed!');
			},
		});
	}
	const postData = async (url:string, data:any) => {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		return response.json(); 
	}
	
	const percentageBal = 10; //$settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance');
	const canSubmit = true; //percentageBal?.value.value || false;
	</script>
	
	<section>
		<div class="container my-5">
			<div>
				<label for="status-name">{startHeightMessage}</label>
				<div class="w-100">
					<RangeSlider pips float bind:values={startHeight} min={minStartHeight + stacksTipHeight + 1} max={maxStartHeight + stacksTipHeight} on:change={changeToken} />
				</div>
				<div class="w-100 d-flex justify-content-between">
					<div class="sl-2 text-warning">
						<span data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title={startHeightMessage}>earliest</span>
					</div>
					<div class="sr-2 text-warning">
						<span data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title={startHeightMessage}>latest</span>
					</div>
				</div>
				<div class="py-3 w-100">
					<label for="status-name">Voting starts at block { (Number(startHeight[0])) } ~ { (startHeight[0] / 144).toFixed(2) } days.</label>
				</div>
			</div>
			<div>
				{#if canSubmit}
				<button class="btn outline-light mr-2 text-info" on:click={() => submit()}>Submit Threshold Proposal</button>
				{:else}
				Unable to submit proposals
				{/if}
			</div>
		</div>
	</section>
	
	<style>
	</style>
	