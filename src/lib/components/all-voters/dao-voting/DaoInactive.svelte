<script lang="ts">
	import type { ProposalEvent } from '$types/stxeco.type';
	import { Button } from 'flowbite-svelte'
	import { sbtcConfig } from '$stores/stores';
	import { openContractCall } from '@stacks/connect';
	import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
	import { CONFIG } from '$lib/config';
	import { explorerTxUrl } from '$lib/utils';

	export let proposalEvent: ProposalEvent;
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let txId:string|undefined;

	const concludeVote = async () => {
    const deployer = CONFIG.VITE_DOA_DEPLOYER;
    const proposalCV = contractPrincipalCV(proposalEvent.contractId.split('.')[0], proposalEvent.contractId.split('.')[1])
    await openContractCall({
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: proposalEvent.votingContract.split('.')[1],
        functionName: 'conclude',
        functionArgs: [proposalCV],
        onFinish: data => {
          txId = data.txId
          console.log('finished contract call!', data);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
}
</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta
		name="description"
		content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin"
	/>
</svelte:head>

<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
	<p>Voting ended {stacksTipHeight - proposalEvent.proposalData.endBlockHeight} blocks ago.</p>
	{#if txId}
	<div><a href={explorerTxUrl(txId)} target="_blank">Track progress on the explorer</a></div>
	{:else}
	<div class="">Please conclude for votes to be counted.</div>
	<div class="py-4">
	  <Button on:click={() => concludeVote()} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 font-normal text-black rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
		Conclude vote
	  </Button>
	</div>
	{/if}

</div>
  
