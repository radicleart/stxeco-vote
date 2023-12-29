<script lang="ts">
  import Modal from '$lib/shared/Modal.svelte';
  import { CONFIG } from '$lib/config';
  import { openContractCall } from '@stacks/connect';
  import { PostConditionMode, contractPrincipalCV, falseCV, trueCV, uintCV } from '@stacks/transactions';
  import type { ProposalEvent } from '$types/stxeco.type';
	import { sbtcConfig } from '$stores/stores';
	import PropVotingAmount from './PropVotingAmount.svelte';
  
  export let proposalEvent:ProposalEvent;

  const proposalData = proposalEvent.proposalData || { startBlockHeight: 0, endBlockHeight: 0, proposer: '' }
  
  let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
  const tokenBalance = $sbtcConfig.userSettings.govTokens?.userBalance || 0
  const tokenBalanceLocked = $sbtcConfig.userSettings.govTokens?.userLocked || 0;
  
  
  let vfor:boolean;
  let showModal:boolean;
  const toggleModal = (myVote:boolean) => {
    showModal = !showModal;
    vfor = myVote;
  }
  const closeModal = () => {
    showModal = false;
  }
  let amount = 0
  const castVote = async (data:any) => {
      const deployer = CONFIG.VITE_DOA_DEPLOYER;
      showModal = !showModal;
      if (data.amount) amount = data.amount
      const vote = {
        proposalContractId: proposalEvent.contractId,
        amount: amount,
        vfor: vfor
      }
      let forCV = trueCV()
      if (!vote.vfor) {
        forCV = falseCV()
      }
      const amountCV = uintCV(vote.amount)
      const proposalCV = contractPrincipalCV(vote.proposalContractId.split('.')[0], vote.proposalContractId.split('.')[1])
      await openContractCall({
          postConditions: [],
          postConditionMode: PostConditionMode.Deny,
          contractAddress: deployer,
          contractName: 'ede002-proposal-voting',
          functionName: 'vote',
          functionArgs: [amountCV, forCV, proposalCV],
          onFinish: data => {
            console.log('finished contract call!', data);
          },
          onCancel: () => {
            console.log('popup closed!');
          }
      });
  }
  
  const canVote = tokenBalance > tokenBalanceLocked && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight
  </script>
  
  <Modal {showModal} on:click={closeModal}>
    <PropVotingAmount {vfor} on:castVote={castVote} />
    <div slot="title">
      <h3>{proposalEvent.proposalMeta.title}</h3>
    </div>
  </Modal>
  
  <section>
    {#if canVote}
    <div class="row">
      <div class="my-5">
        <div class="flex justify-around">
          <div>
            <button class="btn btn-outline-info" on:click={() => toggleModal(true)}>FOR</button>
          </div>
          <h2>Cast your Vote</h2>
          <div>
            <button class="btn btn-outline-success" on:click={() => toggleModal(false)}>AGAINST</button>
          </div>
        </div>
      </div>
    </div>
    {:else if tokenBalance <= tokenBalanceLocked}
    <div class="row">
      <div class="my-5 text-center">
        <div class="d-flex justify-content-around">
          No unlocked governance tokens
        </div>
      </div>
    </div>
    {/if}
  </section>
  
  <style>
  </style>
  