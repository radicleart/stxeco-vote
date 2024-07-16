<script lang="ts">
	import Banner from "$lib/ui/Banner.svelte";
	import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import { BitcoinNetworkType, sendBtcTransaction, type Recipient } from "sats-connect";
	import SoloVotingActiveQr from "./SoloVotingActiveQR.svelte";
	import { isLeather, isLoggedIn } from "@mijoco/stx_helpers/dist/account";
	import { createEventDispatcher } from "svelte";
	import type { VotingEventProposeProposal } from "@mijoco/stx_helpers";

	const dispatch = createEventDispatcher();
  let revealAddresses = false;
	export let proposal:VotingEventProposeProposal;

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
    window.btc?.request('sendTransfer', {
              address: (vfor) ? addresses?.bitcoinAddressYes : addresses?.bitcoinAddressNo,
              amount: 6000,
              network: getConfig().VITE_NETWORK,
            })
            .then((resp: any) => {
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

</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    <div class="">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Solo Stacker Bitcoin Voting</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 w-4/5">
        <p>Voters who are stacking on their own can vote by sending a dust amount of bitcoin (~6000 sats).</p>
        <p class="uppercase">To count as a valid the vote must be sent from the same 
          address that your rewards are sent to. If your wallet rotates sending addresses or if 
          unsure please 
          <a class="underline" href="/" on:click|preventDefault={() => {toggleMethod(2)}}>vote with a stacks transaction</a>.
        </p>
        <p>Express your vote by sending a bitcoin transaction to either;</p>
        <ul class="list-disc pl-6 mb-5">
          <li>an address representing “Yes to the proposal”</li>
          <li>an address representing “No to this proposal"</li>
        </ul>
        <div class="rounded-lg relative bg-[#E6E4E2] py-3">
          <p><a href="/" on:click|preventDefault={() => {toggleMethod(2)}}>Prefer to vote with a stacks transaction ?</a></p>
          <p><a href="/" on:click|preventDefault={() => {toggleMethod(3)}}>Want to vote with your unstacked stx ?</a></p>
        </div>
      </div>
      <div class="rounded-lg py-6 space-y-3 w-4/5">
        <Banner bannerType={'warning'} message={'Be sure to send the transaction from the same address that is registered as your reward address!'} />
      </div>
      <button on:click={() => {revealAddresses = !revealAddresses}} class="space-y-3  text-sm font-mono uppercase block w-4/5 px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
        I understand, continue
      </button>
      {#if revealAddresses}
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 w-4/5">
        <p>If your bitcoin reward address is the connected wallet address <a href="/" on:click|preventDefault={() => showPaymentButtons = !showPaymentButtons} class="underline">click here</a></p>

          {#if showPaymentButtons}
          <div class="flex gap-x-2">
            <div class=" w-1/2">
              <button on:click={() => {castVote(true)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
                Vote yes
              </button>
            </div>
            <div class=" w-1/2">
              <button on:click={() => {castVote(false)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
                Vote no
              </button>
            </div>
          </div>
          {#if errorMessage}
          <div class="mt-3 w-full flex justify-start gap-x-4">{errorMessage}</div>
          {/if}
          {/if}
      </div>
      {/if}
    </div>
    <NakamotoBackground />
    <NakamotoShield />
  </div>
</div>
{#if revealAddresses}
<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
  <div class="p-8 bg-[#121314] rounded-2xl">
    <h3 class="text-3xl text-white">Cast your vote</h3>
  </div>
  <SoloVotingActiveQr {addresses}/>
</div>
{/if}