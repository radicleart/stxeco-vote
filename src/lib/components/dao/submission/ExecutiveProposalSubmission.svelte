<script lang="ts">
import { page } from '$app/stores';
import { CONFIG } from '$lib/config';
import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
	import { sbtcConfig } from '$stores/stores';
	import type { DaoData, ProposalEvent } from '$types/stxeco.type';
	import type { SbtcConfig } from '$types/sbtc_config';
	import { isExecutiveTeamMember } from '$lib/sbtc_admin';
	import { onMount } from 'svelte';

export let proposal:ProposalEvent;

const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;

const submit = async () => {
	const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
	let functionArgs = [proposalCV]
	await openContractCall({
		postConditions: [],
		postConditionMode: PostConditionMode.Deny,
		contractAddress: CONFIG.VITE_DOA_DEPLOYER,
		contractName: 'ede004-emergency-proposals',
		functionName: 'emergency-propose',
		functionArgs: functionArgs,
		onFinish: data => {
			sbtcConfig.update((conf:SbtcConfig) => {
				if (!conf.daoData) conf.daoData = {} as DaoData;
				conf.daoData.inFlight = {
					name: 'Emergency signal',
					txid: data.txId
				}
				return conf;
			})
		},
		onCancel: () => {
			console.log('popup closed!');
		}
	});
}

$: executiveTeamMember = false

onMount(async () => {
	executiveTeamMember = (await isExecutiveTeamMember($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)).executiveTeamMember
})

</script>

<section>
	{#if executiveTeamMember}
	<div class="my-5">
		<button class="btn outline-light mr-2 text-info" on:click={() => submit()}>Emergency Proposal</button>
		<p class="text-small">Submit this contract as an emergency proposal - voting ends at block {stacksTipHeight + 144}.</p>
	</div>
	{/if}
</section>

<style>
</style>
