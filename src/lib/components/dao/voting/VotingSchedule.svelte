<script lang="ts">
import FormatUtils from '$lib/service/FormatUtils';
import ChainUtils from '$lib/service/ChainUtils';
import Countdown from '$lib/shared/Countdown.svelte'
import { openContractCall } from '@stacks/connect';
import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
import { CONFIG } from '$lib/config';
import type { ProposalEvent } from '$types/stxeco.type';
import { sbtcConfig } from '$stores/stores';
import { Button } from 'flowbite-svelte'
	import { getStacksNetwork } from '$lib/stacks_connect';

export let proposalEvent: ProposalEvent;
let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
const proposalData = proposalEvent.proposalData || { votesFor: 0, votesAgainst: 0, concluded: false, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }
const endBH = proposalData.endBlockHeight - proposalData.startBlockHeight
const currentBH = stacksTipHeight - proposalData.startBlockHeight
$: currentBHN = (currentBH / endBH) * 100
let txId: string;
$: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;


const inFavour = (proposalData && (proposalData.votesFor + proposalData.votesAgainst) > 0) ? Number(((proposalData.votesFor / (proposalData.votesFor + proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
let winning = 'danger';
if (inFavour > 80) {
  winning = 'success';
}

const concludeVote = async () => {
    const deployer = CONFIG.VITE_DOA_DEPLOYER;
    const proposalCV = contractPrincipalCV(proposalEvent.contractId.split('.')[0], proposalEvent.contractId.split('.')[1])
    await openContractCall({
        network: getStacksNetwork(),
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

    {#if stacksTipHeight >= proposalData.endBlockHeight}
      {#if proposalData.concluded && proposalData.passed}
        <h4 class={'text-2xl mb-5 text-' + proposalEvent.status?.color}>Vote Passed</h4>
        <div class={'mb-4 flex justify-around text-' + winning}>
          <div>
            <span class="text-center">{inFavour}%</span> <span class="text-white"> in favour of this proposal</span>
          </div>
        </div>
      {:else if proposalData.concluded && !proposalData.passed}
        <h4 class={'text-' + proposalEvent.status?.color}>Vote Failed to Pass</h4>
        <div class={'mb-4 flex justify-around text-' + winning}>
          <div>
            <span class="text-center">{100 - inFavour}%</span> <span class="text-white"> against this proposal</span>
          </div>
        </div>
      {:else}
        {#if txId}
        <div>Votes are being counted.</div>
        <div><a href={explorerUrl} target="_blank">Track progress on the explorer</a></div>
        {:else}
        <div>Please conclude for votes to be counted.</div>
        <div class="py-4">
          <Button on:click={() => concludeVote()} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2  text-black rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
            Conclude vote
          </Button>
        </div>
        {/if}
      {/if}
      <div class={'flex justify-around text-' + proposalEvent.status?.color}>
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesFor)} <span class="text-white">votes for</span></p>
        </div>
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesAgainst)} <span class="text-white">votes against</span></p>
        </div>
      </div>
    {:else if stacksTipHeight < proposalData.startBlockHeight}
      <div class="text-xs flex justify-between">
        <div>Voting starts at {FormatUtils.fmtNumber(proposalData.startBlockHeight)} in {proposalData.startBlockHeight - stacksTipHeight} blocks</div>
      </div>
    {:else}
      <div class="text-xs flex justify-between">
        <div>{ FormatUtils.fmtNumber(proposalData.endBlockHeight - $sbtcConfig.stacksInfo.stacks_tip_height) } blocks</div>
        <div><Countdown endBlock={proposalData.endBlockHeight - stacksTipHeight} /></div>
      </div>
    {/if}