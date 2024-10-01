<script lang="ts">
  import { onMount } from 'svelte';
  import Invoice from './Invoice.svelte';
  import { sessionStore } from '$stores/stores';
  import { openSTXTransfer } from '@stacks/connect';
	import { isLoggedIn } from '@mijoco/stx_helpers/dist/account';
	import { getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers';
	import { getAddressId } from '$lib/utils';
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let proposal:VotingEventProposeProposal;
  export let showPaymentButtons = false;
  let stackerData = proposal.stackerData!

  let showStxTransfer = false;
  let txId: string;
  let errorMessage: string|undefined;
  let vforCurrent: boolean;
  let inited = false;

  const castVote = async (vfor:boolean) => {
    if (!isLoggedIn()) {
      vforCurrent = vfor
      errorMessage = 'Please connect your wallet to vote';
      return;
    }
    await openSTXTransfer({
      amount: '1',
      network: getStacksNetwork(getConfig().VITE_NETWORK),
      recipient: (vfor) ? stackerData.stacksAddressYes : stackerData.stacksAddressNo,
        onFinish: data => {
          txId = data.txId
          console.log('finished contract call!', data);
          localStorage.setItem('VOTED_FLAG' + getAddressId(), JSON.stringify(proposal.proposal));
          localStorage.setItem('VOTED_TXID_2' + getAddressId(), txId);
          //window.location.reload()
          //goto(`/dao/proposals/${proposal.proposal}/badge`);
          dispatch("voting_event", {txId, event: 'pool'});

        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
  }

  onMount(async () => {
    let locked = $sessionStore.keySets[getConfig().VITE_NETWORK].tokenBalances?.stx?.locked
    locked = Number(locked)
    if (locked && locked > 0) showStxTransfer = true

    inited = true
  })
</script>
{#if inited}

  <div class="p-8 bg-[#F4F3F0] rounded-2xl">
    {#if showPaymentButtons}
    <div class="mb-16">
      <button on:click={() => {castVote(true)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
      Vote yes
    </button>
    {#if errorMessage && vforCurrent}
    <div class="mt-3 w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
    </div>
    {/if}

    <div class="mb-5">
      Send from stacking address
    </div>
    <Invoice address={stackerData.stacksAddressYes} voteFor={true} />

  </div>

  <div class="p-8 bg-[#F4F3F0] rounded-2xl">
    {#if showPaymentButtons}
    <div class="mb-16">
    <button on:click={() => {castVote(false)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
      Vote no
    </button>
    {#if errorMessage && !vforCurrent}
    <div class="mt-3 w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
    </div>
    {/if}

    <div class="mb-5">
      Send from stacking address
    </div>
    <Invoice address={stackerData.stacksAddressNo} voteFor={false} />

  </div>
{/if}
