<script lang="ts">
	import Banner from "$lib/ui/Banner.svelte";
	import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import { BitcoinNetworkType, sendBtcTransaction, type Recipient } from "sats-connect";
	import SoloVotingActiveQr from "./SoloVotingActiveQR.svelte";
	import { isLeather, isLoggedIn } from "@mijoco/stx_helpers/dist/account";
	import { daoStore } from "$stores/stores_dao";

  const addresses = $daoStore.soloPoolData?.soloAddresses!

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
              address: (vfor) ? addresses.yAddress : addresses.nAddress,
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
      address: (vfor) ? addresses.yAddress : addresses.nAddress,
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
        <h2 class="text-[#131416] text-2xl mb-3">Voting for Stackers</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
        <p>Voters who are stacking on their own must send a dust amount of BTC (~6000 sats) from their PoX Bitcoin reward address to either:</p>
        <ul class="list-disc pl-6">
          <li>an address representing the “Yes to Nakamoto Release”</li>
          <li>an address representing the “No to Nakamoto Release”.</li>
        </ul>
      </div>
      <div class="rounded-lg py-6 space-y-3 max-w-xl">
        <Banner bannerType={'warning'} message={'Be sure to send from the bitcoin address you registered as your reward address!'} />
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
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
      <div class="mt-3 w-full flex justify-start gap-x-4">
        {errorMessage}
      </div>
      {/if}
      {/if}
    </div>
  </div>

    <NakamotoBackground />
    <NakamotoShield />
  </div>
</div>

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
  <div class="p-8 bg-[#121314] rounded-2xl">
    <h3 class="text-3xl text-white">Cast your vote</h3>
  </div>
  <SoloVotingActiveQr/>
</div>
