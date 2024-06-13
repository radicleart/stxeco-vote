<script lang="ts">
	import { page } from '$app/stores';
	import { CONFIG } from '$lib/config';
	import { isExecutiveTeamMember } from '$lib/admin';
	import { sessionStore } from '$stores/stores';
	import type { ProposalEvent } from '$types/stxeco.type';
	import { openContractCall } from '@stacks/connect';
	import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';


  let txId: string;
	let contractId = $page.params.contractId;
	export let proposal:ProposalEvent;
  const sigsRequired = (proposal.signals?.parameters.executiveSignalsRequired || 2) - (proposal.signals?.signals || 0)
  $: buttonLabel = (txId) ? "Tx Sent": "SUPPORT PROPOSAL";

  const signalSupport = async () => {
    const deployer = CONFIG.VITE_DOA_DEPLOYER;
    const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
    await openContractCall({
      postConditions: [],
      postConditionMode: PostConditionMode.Deny,
      contractAddress: deployer,
      contractName: 'ede004-emergency-execute',
      functionName: 'executive-action',
      functionArgs: [proposalCV],
      onFinish: data => {
        txId = data.txId;
        console.log('finished contract call!', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  }

  const executiveTeamMember = isExecutiveTeamMember(sessionStore.keySets[CONFIG.VITE_NETWORK].stxAddress)
  const canVote = !proposal.executedAt && executiveTeamMember // && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight
  $: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;
</script>

<section>
{#if canVote}
	<div class="bg-card p-5 text-white">
    <div class="row">
      <div>
        <h4>Emergency Execute</h4>
        <div class="text-small">Signal support for this proposal via multisig voting by executive team.</div>
        <p class="mt-5">{proposal.signals?.signals} of {sigsRequired} signal(s) received so far.</p>
        {#if !txId}<button class="btn btn-outline-success" on:click={() => signalSupport()}>{buttonLabel}</button>{/if}
      </div>
      {#if txId}
      <div>
        <a href={explorerUrl} target="_blank">View on explorer</a>
      </div>
      {/if}
    </div>
  </div>
{/if}
</section>

<style>
  p {
	color: #ededed;
}

</style>
