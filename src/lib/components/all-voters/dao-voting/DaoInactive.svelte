<script lang="ts">
	import { ProposalStage, type ProposalEvent } from '$types/stxeco.type';
	import { sbtcConfig } from '$stores/stores';
	import { openContractCall } from '@stacks/connect';
	import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
	import { CONFIG } from '$lib/config';
	import { explorerTxUrl } from '$lib/utils';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';

	export let proposal: ProposalEvent;
	export let method = 1
	let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
	let txId:string|undefined;

	const concludeVote = async () => {
    const deployer = CONFIG.VITE_DOA_DEPLOYER;
    const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
    await openContractCall({
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: proposal.votingContract.split('.')[1],
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

<div>
	<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
		<div class="py-10 px-10 md:px-12 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
			<div class="flex flex-col gap-y-12">
				{#if proposal.stage === ProposalStage.INACTIVE || proposal.stage === ProposalStage.CONCLUDED}
					<div class="flex flex-col">
						<p class="text-2xl mb-5">Voting ended</p>
						<!--<p>Voting ended <strong>{stacksTipHeight - proposal.proposalData.endBlockHeight} blocks ago</strong>.</p>-->
						<p>Votes are now being counted.</p>
						<p>Vote results will be displayed as soon as the vote count is over.</p>
						<p>Thank you for your patience.</p>
					</div>
					{#if method === 3 && proposal.stage === ProposalStage.INACTIVE}
					<div>
						<button on:click={() => concludeVote()} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-black text-white px-4 py-2 rounded-xl border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
							Conclude vote
						</button>
					</div>
					{/if}
				{:else}
				<div class="flex flex-col">
					<p class="text-2xl mb-5">Results</p>
					<p>Votes will be counted and the results displayed here after voting ends.</p>
					<p>Thank you for your patience.</p>
				</div>
				{/if}

				{#if txId}
					<div>
						<a href={explorerTxUrl(txId)} target="_blank">Track progress on the explorer</a>
					</div>
				{/if}
			</div>
			<NakamotoBackground />
			<NakamotoShield />
		</div>
	</div>
</div>


