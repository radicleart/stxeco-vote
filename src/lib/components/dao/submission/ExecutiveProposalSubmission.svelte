<script lang="ts">
import { page } from '$app/stores';
import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
	import { sessionStore } from '$stores/stores';
	import { isExecutiveTeamMember } from '$lib/admin';
	import { onMount } from 'svelte';
	import type { InFlight, ProposalEvent } from '@mijoco/stx_helpers/dist/index';
	import type { DaoStore, SessionStore } from '$types/local_types';
	import { daoStore } from '$stores/stores_dao';
	import { getConfig } from '$stores/store_helpers';

export let proposal:ProposalEvent;

const stacksTipHeight = $sessionStore.stacksInfo.stacks_tip_height;

const submit = async () => {
	const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
	let functionArgs = [proposalCV]
	await openContractCall({
		postConditions: [],
		postConditionMode: PostConditionMode.Deny,
		contractAddress: getConfig().VITE_DOA_DEPLOYER,
		contractName: 'ede004-emergency-proposals',
		functionName: 'emergency-propose',
		functionArgs: functionArgs,
		onFinish: data => {
			daoStore.update((conf:DaoStore) => {
				if (!conf.daoData) conf.daoData = {} as InFlight;
				conf.daoData = {
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
	executiveTeamMember = (await isExecutiveTeamMember($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)).executiveTeamMember
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
