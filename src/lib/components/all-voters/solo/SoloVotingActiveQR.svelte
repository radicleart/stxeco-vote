<script lang="ts">
  import { onMount } from 'svelte';
  import Invoice from './Invoice.svelte';
  import { sbtcConfig } from '$stores/stores';
	import NakamotoResultsBackground from '$lib/components/shared/NakamotoResultsBackground.svelte';
	import { isLeather, loggedIn } from '$lib/stacks_connect';
	import { CONFIG } from '$lib/config';
	import { sendBtcTransaction, type Recipient, BitcoinNetworkType } from 'sats-connect';

  export let showPaymentButtons:boolean;
  let yesAddress:string;
  let noAddress:string;
  let inited = false;
  let errorMessage: string|undefined;
  let vforCurrent: boolean;
  let addresses:any;

const castVote = async (vfor:boolean) => {
  if (!loggedIn()) {
    vforCurrent = vfor
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
              network: CONFIG.VITE_NETWORK,
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
          type: (CONFIG.VITE_NETWORK === 'mainnet') ? BitcoinNetworkType.Mainnet : BitcoinNetworkType.Testnet,
        },
        recipients: [recipients],
        senderAddress: $sbtcConfig.keySets[CONFIG.VITE_NETWORK].cardinal,
      },
      onFinish: (response: any) => {
        alert(response);
      },
      onCancel: () => alert("Canceled"),
    };

    await sendBtcTransaction(sendBtcOptions);
  }

  onMount(async () => {
    addresses = $sbtcConfig.soloPoolData?.soloAddresses!
    yesAddress = addresses.yAddress as string
    noAddress = addresses.nAddress as string
    inited = true
  })
</script>

{#if inited}
{#if showPaymentButtons}
  <div class="p-8 bg-[#F4F3F0] rounded-2xl">
    <Invoice address={yesAddress} voteFor={true} />
    <button on:click={() => {castVote(true)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
      Vote yes
    </button>
    {#if errorMessage && vforCurrent}
    <div class="mt-3 w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
  </div>

  <div class="p-8 bg-[#F4F3F0] rounded-2xl">
    <Invoice address={noAddress} voteFor={false} />
    <button on:click={() => {castVote(false)}} class="text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
      Vote no
    </button>
    {#if errorMessage && !vforCurrent}
    <div class="mt-3 w-full flex justify-start gap-x-4">
      {errorMessage}
    </div>
    {/if}
  </div>
{:else}

<div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
  <Invoice address={yesAddress} voteFor={true} />
  <NakamotoResultsBackground />
</div>

<div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
  <Invoice address={noAddress} voteFor={false} />
  <NakamotoResultsBackground />
</div>
{/if}
{/if}