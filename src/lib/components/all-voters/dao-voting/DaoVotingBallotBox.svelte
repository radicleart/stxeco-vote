<script lang="ts">
    import ChainUtils from '$lib/service/ChainUtils';
    import { goto } from "$app/navigation";
    import FormatUtils from '$lib/service/FormatUtils';
    import { onMount } from 'svelte';
    import { PostConditionMode, contractPrincipalCV, falseCV, trueCV, uintCV } from '@stacks/transactions';
    import { showContractCall } from '@stacks/connect';
    import { sessionStore } from '$stores/stores';
    import Banner from '$lib/ui/Banner.svelte';
    import type { VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
    import { isLoggedIn } from '@mijoco/stx_helpers/dist/account';
    import { getStacksNetwork, getTransaction } from '@mijoco/stx_helpers/dist/stacks-node';
    import { getConfig } from '$stores/store_helpers';
	  import { explorerTxUrl, getAddressId } from '$lib/utils';

    export let proposal:VotingEventProposeProposal;
    export let balanceAtHeight:number = 0;

    let errorMessage:string|undefined;
    let txId: string;
    let canVote = true;
    $: explorerUrl = explorerTxUrl(txId);

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
        const proposalCV = contractPrincipalCV(proposal.proposal.split('.')[0], proposal.proposal.split('.')[1])
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
              localStorage.setItem('VOTED_FLAG' + getAddressId(), JSON.stringify(proposal.proposal));
              localStorage.setItem('VOTED_TXID_3' + getAddressId(), JSON.stringify({txId}));
              //goto(`/dao/proposals/${proposal.proposal}/badge`);
              window.location.reload()
            },
            onCancel: () => {
              console.log('popup closed!');
            }
        });
    }

    if (balanceAtHeight === 0 || balanceAtHeight < 1) {
      canVote = false;
    }
    const lookupTransaction = async (txId:string) => {
      return await getTransaction(getConfig().VITE_STACKS_API, txId)
    }

    onMount(async () => {
      if (localStorage.getItem('VOTED_TXID_3' + getAddressId())) {
		    const txIdObj = localStorage.getItem('VOTED_TXID_3' + getAddressId());
		    if (txIdObj) {
          const potentialTxId = (JSON.parse(txIdObj)).txId
          const tx = await lookupTransaction(potentialTxId);
          if (tx && tx.tx_status === 'pending' && tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) {
            txId = potentialTxId
          } else {
            if (tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) {
              localStorage.removeItem('VOTED_TXID_3' + getAddressId());
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
      <button on:click={() => {errorMessage = undefined; castVote(true)}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5  px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
        VOTE YES
      </button>
      <button on:click={() => {errorMessage = undefined; castVote(false)}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
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
