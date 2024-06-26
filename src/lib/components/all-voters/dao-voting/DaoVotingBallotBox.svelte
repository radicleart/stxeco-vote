<script lang="ts">
    import ChainUtils from '$lib/service/ChainUtils';
    import DaoUtils from '$lib/service/DaoUtils';
    import { goto } from "$app/navigation";
    import FormatUtils from '$lib/service/FormatUtils';
    import {tick, onMount} from 'svelte';
    import { PostConditionMode, contractPrincipalCV, falseCV, trueCV, uintCV } from '@stacks/transactions';
    import { openContractCall, showContractCall } from '@stacks/connect';
    import { sessionStore } from '$stores/stores';
	import Banner from '$lib/ui/Banner.svelte';
	import type { ProposalEvent } from '@mijoco/stx_helpers/dist/index';
	import { isLoggedIn } from '@mijoco/stx_helpers/dist/account';
	import { getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';

    export let proposal: ProposalEvent;
    export let balanceAtHeight:number = 0;

    const stacksTipHeight = $sessionStore.stacksInfo?.stacks_tip_height | 0;
		const burnHeight = $sessionStore.stacksInfo?.burn_block_height | 0;
		DaoUtils.setStatus(3, burnHeight, stacksTipHeight, proposal);

    let errorMessage:string|undefined;
    let txId: string;
    let canVote = true;
    $: explorerUrl = getConfig().VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + getConfig().VITE_NETWORK;

    $: amount = balanceAtHeight;
    const castVote = async (vfor:boolean) => {
        const deployer = getConfig().VITE_DOA_DEPLOYER;
        if (!isLoggedIn()) {
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
        await showContractCall({
            network: getStacksNetwork(getConfig().VITE_NETWORK),
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
              localStorage.setItem('VOTED_TXID_3', JSON.stringify({txId}));
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
    const lookupTransaction = async (txId:string) => {
      const url = getConfig().VITE_STACKS_API + '/extended/v1/tx/' + txId;
      try {
        const response = await fetch(url);
        const val = await response.json();
        return val;
      } catch (err) {
        console.log('callContractReadOnly4: ', err);
      }
    }

    onMount(async () => {
      if (localStorage.getItem('VOTED_TXID_3')) {
		    const txIdObj = localStorage.getItem('VOTED_TXID_3');
		    if (txIdObj) {
          const potentialTxId = (JSON.parse(txIdObj)).txId
          const tx = await lookupTransaction(potentialTxId);
          if (tx && tx.tx_status === 'pending' && tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) {
            txId = potentialTxId
          } else {
            if (tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) {
              localStorage.removeItem('VOTED_TXID_3');
            }
          }
        }
	    }
      amount = balanceAtHeight;
    })

    </script>


<div>
  <div class="flex flex-col gap-y-4">
    <div class="text-xl">
      Snapshot balance
    </div>
    {#if txId}
    <div class="mb-3 max-w-xl">
      <Banner bannerType={'warning'} message={'Your vote is in the mempool and should be confirmed soon. See <a href="'+explorerUrl+'" target="_blank">explorer!</a>'} />
    </div>
    {:else}
    <div class="mb-3 max-w-xl">
      <Banner bannerType={'warning'} message={'No STX will be spent by voting but you will pay a gas fee.'} />
    </div>
    <div class="w-full flex flex-col justify-start">
      <input class="w-1/2 rounded-lg p-2 text-black border-gray-800" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"/>
      <p class="text-sm mt-5">
        Your snapshot balance at block <span class="text-bold">{FormatUtils.fmtNumber(proposal.proposalData?.startBlockHeight)}</span> was <span class="text-bold">{balanceAtHeight}</span> STX.
      </p>
    </div>
    <div class="w-full flex justify-start gap-x-4">
      <button on:click={() => {errorMessage = undefined; castVote(true)}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
        VOTE YES
      </button>
      <button on:click={() => {errorMessage = undefined; castVote(false)}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5 bg-danger-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
        VOTE NO
      </button>
    </div>
    {#if errorMessage}
    <div class="w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
    {/if}
  </div>
</div>
