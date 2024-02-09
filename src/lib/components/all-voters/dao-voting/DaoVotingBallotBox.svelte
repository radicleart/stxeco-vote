<script lang="ts">
    import ChainUtils from '$lib/service/ChainUtils';
    import DaoUtils from '$lib/service/DaoUtils';
    import { goto } from "$app/navigation";
    import FormatUtils from '$lib/service/FormatUtils';
    import {tick, onMount} from 'svelte';
    import { CONFIG } from '$lib/config';
    import { PostConditionMode, contractPrincipalCV, falseCV, trueCV, uintCV } from '@stacks/transactions';
    import { openContractCall } from '@stacks/connect';
    import type { ProposalEvent } from '$types/stxeco.type';
    import { sbtcConfig } from '$stores/stores';
    import { getStacksNetwork, loggedIn } from '$lib/stacks_connect';

    export let proposal: ProposalEvent;
    export let balanceAtHeight:number = 0;

    const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
		const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
		DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposal);

    let errorMessage:string|undefined;
    let txId: string;
    let canVote = true;
    $: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;

    $: amount = balanceAtHeight;
    const castVote = async (vfor:boolean) => {
        const deployer = CONFIG.VITE_DOA_DEPLOYER;
        if (!loggedIn()) {
          errorMessage = 'Please connect your wallet to vote';
          return;
        }
        if (amount === 0 || amount < 1 ) {
          errorMessage = 'Minimum voting power is 1 STX';
          return;
        }
        if (amount > balanceAtHeight) {
          errorMessage = 'Maximum voting power is ' + balanceAtHeight + ' STX (your balance when voting opened)';
          amount = balanceAtHeight;
          return;
        }
        let forCV = trueCV()
        if (!vfor) {
          forCV = falseCV()
        }
        // const amountUSTX = ChainUtils.toOnChainAmount(amount)
        const amountUSTX = ChainUtils.toOnChainAmount(amount)
        const amountCV = uintCV(amountUSTX)
        const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
        await openContractCall({
            network: getStacksNetwork(),
            postConditions: [],
            postConditionMode: PostConditionMode.Deny,
            contractAddress: deployer,
            contractName: proposal.votingContract.split('.')[1],
            functionName: 'vote',
            functionArgs: [amountCV, forCV, proposalCV],
            onFinish: data => {
              txId = data.txId
              console.log('finished contract call!', data);
              //ChainUtils.updateVoters();
              localStorage.setItem('VOTED_FLAG', JSON.stringify(proposal.contractId));
              goto(`/dao/proposals/${proposal.contractId}/badge`);
            },
            onCancel: () => {
              console.log('popup closed!');
            }
        });
    }

    //$: canVote = propStatus === 'voting' && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight;
    if (balanceAtHeight === 0 || balanceAtHeight < 1) {
      canVote = false;
    }

    onMount(async () => {
      await tick();
      amount = balanceAtHeight;
    })

    </script>


<div>
  <div class="flex flex-col gap-y-4">
    <div class="text-xl">
      Snapshot balance
    </div>
    <div class="w-full flex flex-col justify-start">
      <input class="w-1/2 rounded-lg p-2 text-black border-gray-800" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"/>
      <p class="text-sm mt-5">
        Your snapshot balance at block <span class="text-bold">{FormatUtils.fmtNumber(proposal.proposalData?.startBlockHeight)}</span> was <span class="text-bold">{balanceAtHeight}</span> STX.
      </p>
    </div>
    <div class="w-full flex justify-start gap-x-4">
      <button on:click={() => {errorMessage = undefined; castVote(true)}} class="w-[150px] md:inline-flex items-start gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
        VOTE YES
      </button>
      <button on:click={() => {errorMessage = undefined; castVote(false)}} class="w-[150px] md:inline-flex items-start gap-x-1.5 bg-danger-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
        VOTE NO
      </button>
    </div>
    {#if errorMessage}
    <div class="w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
  </div>
</div>
