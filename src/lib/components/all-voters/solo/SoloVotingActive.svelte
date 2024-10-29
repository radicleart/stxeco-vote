<script lang="ts">
	import Banner from "$lib/ui/Banner.svelte";
	import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import { BitcoinNetworkType, sendBtcTransaction, type Recipient } from "sats-connect";
	import SoloVotingActiveQr from "./SoloVotingActiveQR.svelte";
	import { isLeather, isLoggedIn } from "@mijoco/stx_helpers/dist/account";
	import { createEventDispatcher, onMount } from "svelte";
	import type { VotingEventProposeProposal } from "@mijoco/stx_helpers";
	import NakamotoResultsBackground from "$lib/ui/NakamotoResultsBackground.svelte";
	import Invoice from "./Invoice.svelte";
	import Switch from '$lib/assets/SwitchArrows.svelte';

	const dispatch = createEventDispatcher();
  let revealAddresses = true;
	export let proposal:VotingEventProposeProposal;
  let showOnPanel = false;

  const toggleVoting = () => {
    if (isLoggedIn()) {
      showPaymentButtons = !showPaymentButtons
    }
  }

  const toggleMethod = (method:number) => {
    dispatch('toggle_voting_method', {method})
  }

  const addresses = proposal.stackerData!

  const castVote = async (vfor:boolean) => {
    if (!isLoggedIn()) {
      errorMessage = 'Please connect your wallet to vote';
      return;
    }
    if (isLeather()) {
      await castVoteLeather(vfor)
    } else {
      await castVoteXverse(vfor)
    }
  }

  const castVoteLeather = async (vfor:boolean) => {
    (window as any).btc?.request('sendTransfer', {
              address: (vfor) ? addresses?.bitcoinAddressYes : addresses?.bitcoinAddressNo,
              amount: 6000,
              network: getConfig().VITE_NETWORK,
            })
            .then((resp: any) => {
              dispatch("voting_event", {txId: resp, event: 'pool'});
              console.log({ sucesss: resp });
            })
            .catch((error: any) => {
              console.log({ error });
            });
  }

  const castVoteXverse = async(vfor:boolean) => {
    const recipients:Recipient = {
      address: (vfor) ? addresses.bitcoinAddressYes : addresses.bitcoinAddressNo,
      amountSats: 6000n
    }
    const sendBtcOptions = {
      payload: {
        network: {
          type: (getConfig().VITE_NETWORK === 'mainnet') ? BitcoinNetworkType.Mainnet : BitcoinNetworkType.Testnet,
        },
        recipients: [recipients],
        senderAddress: $sessionStore.keySets[getConfig().VITE_NETWORK].cardinal,
      },
      onFinish: (response: any) => {
        alert(response);
      },
      onCancel: () => alert("Canceled"),
    };

    await sendBtcTransaction(sendBtcOptions);
  }

  let errorMessage: string|undefined;
  let showPaymentButtons = false;

  let yesAddress:string;
  let noAddress:string;
  let inited = false;


  onMount(async () => {
    yesAddress = addresses.bitcoinAddressYes as string
    noAddress = addresses.bitcoinAddressNo as string
    inited = true
  })

</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    <div class="">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Bitcoin Voting (Solo Stackers Only!)</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 ">
        <p>Voters who are stacking on their own can vote by sending a dust amount of bitcoin (~6000 sats).</p>
        <p>Express your vote by sending a bitcoin transaction to either;</p>
        <ul class="list-disc pl-6 mb-5">
          <li>an address representing "Yes" to the proposal</li>
          <li>an address representing "No" to this proposal</li>
        </ul>
        <div class="rounded-lg relative bg-[#E6E4E2] py-3">
          <p><a class="underline hover:text-blue-500" href="/" on:click|preventDefault={() => {toggleMethod(2)}}>Prefer to vote with a stacks transaction ?</a></p>
        </div>
      </div>
      <div class="rounded-lg py-6 space-y-3 ">
        <Banner bannerType={'warning'} message={'Be sure to send the transaction from the same address that is registered as your reward address!'} />
      </div>

      <div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
        <div class="p-8 bg-[#121314] rounded-2xl">
          <h3 class="text-3xl text-white mb-5">Cast your vote</h3>
          {#if isLoggedIn() && showOnPanel}
          <p class="mt-0 text-white text-sm">If you're stacking rewards are sent to the connected wallet <a href="/" on:click|preventDefault={() => showPaymentButtons = !showPaymentButtons} class="underline">click here</a></p>
          {/if}
        </div>
        <div class="col-span-2">
          <div class="mb-5">
            {#if isLoggedIn()}
            <a class="inline-block relative top-[8px]" href="/" on:click|preventDefault={() => {toggleVoting()}}><Switch/></a>
            {#if showPaymentButtons}
            <a class="underline inline-block relative top-[5px]" href="/" on:click|preventDefault={() => {toggleVoting()}}>Send from connected wallet</a>
            {:else}
            <a class="underline inline-block relative top-[5px]" href="/" on:click|preventDefault={() => {toggleVoting()}}>Send from stacking address</a>
            {/if}
            {/if}
          </div>
            <div class="flex flex-col md:flex-row gap-x-3 gap-y-3">

              <div class="w-full pt-8 px-8 bg-[#fff] rounded-2xl relative">
                {#if showPaymentButtons}
                <div class="mb-8">
                  <button on:click={() => {castVote(true)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
                    Vote yes
                  </button>
                </div>
                {:else}
                <!--<div class="mb-5">
                  Send from your reward address
                </div>-->
                <Invoice address={yesAddress} voteFor={true} />
                <NakamotoResultsBackground />
                {/if}
              </div>
              <div class="w-full pt-8 px-8 bg-[#fff] rounded-2xl relative">
                {#if showPaymentButtons}
                <div class=" mb-8">
                  <button on:click={() => {castVote(false)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
                    Vote no
                  </button>
                </div>
                {:else}
                <!--
                <div class="mb-5">
                  Send from your reward address
                </div>-->
                <Invoice address={noAddress} voteFor={false} />
                <NakamotoResultsBackground />
                {/if}
              </div>
            </div>
          </div>

    
      </div>
    </div>
  </div>
</div>
