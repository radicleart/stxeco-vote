<script lang="ts">
  import { onMount, tick } from "svelte";
  import QrCode from "svelte-qrcode"
  import { Icon, ClipboardDocument } from "svelte-hero-icons"
  import { fmtSatoshiToBitcoin } from '$lib/utils'
  import LinkToExplorer from '$lib/components/shared/LinkToExplorer.svelte';
  import { makeFlash } from "$lib/stacks_connect";
  import { explorerBtcAddressUrl } from '$lib/utils'

  export let address:string;
  export let voteFor = false;
  // NB Its possible the user paid a different amount to the amount they entered in the UI - ths takes the on chain amount first
  let amount = 546;
  let copied = false;
  let valueCopy:string|undefined;
  let areaDom:any;
  let showCopy = false;

  /**
  const copy = async () => {
    let ele= 'address-field-yes'
    if (!voteFor) ele += '-no'
    let nameProp = paymentUri();
    let clippy = {
      target: document.getElementById('clipboard')!,
      props: { name: nameProp },
    }
    const app = new CopyClipboard(clippy);
    app.$destroy();
    makeFlash(document.getElementById(ele))
    copied = true;
  }*/
  const copy = async () => {
    showCopy = true
    let value = paymentUri();
    valueCopy = value;
    await tick();
    areaDom.focus();
    areaDom.select();
    let message = 'Copying text was successful';
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        message = 'Copying text was unsuccessful';
      }
    } catch (err) {
      message = 'Oops, unable to copy';
    }

    // we can notifi by event or storage about copy status
    console.log(message);
    valueCopy = undefined;
    let ele= 'address-field-yes'
    if (!voteFor) ele = 'address-field-no'
    makeFlash(document.getElementById(ele))
    setTimeout(function() {
      showCopy = false
    }, 4000)
  }

  const getOuterClasses = ():string => {
    let baseClasses = 'flex justify-between rounded-lg border-[0.2px]  p-3 gap-y-8 '
    if (!voteFor) {
      baseClasses += ' border-danger-400 bg-danger-01'
    } else {
      baseClasses += ' border-success-400 bg-success-01'
    }
    return baseClasses
  }

  $: getAddress = (full:boolean):string => {
    return address
  }

  const paymentUri = () => {
    let uri = 'bitcoin:' + address;
    uri += '?amount=' + fmtSatoshiToBitcoin(amount)
    uri += '&label=' + encodeURI('Deposit BTC to mint sBTC on Stacks')
    return uri
  }

  onMount(async () => {
  })
</script>

<div id="clipboard"></div>
{#if valueCopy != null}
  <textarea bind:this={areaDom}>{ valueCopy }</textarea>
{/if}

<div class="text-white leading-none mt-2 px-2 py-1">
  <div class="block font-bold">Vote {(voteFor) ? 'YES' : 'NO'} by sending (dust) {fmtSatoshiToBitcoin(amount)} here.</div>
</div>
<div class={getOuterClasses()}>
  <div class="h-[144px] max:w-1/2 rounded-lg overflow-hidden mr-4 border border-gray-600">
    <QrCode value={paymentUri()} size={144} color={'#000'} background={'#fff'} />
  </div>
  <div class="w-1/2 flex-1 flex flex-col justify-between">
    <div class="flex items-center justify-between text-white pl-3 pr-2 py-2 gap-x-1 rounded-md border border-gray-800 bg-gray-1000/75">
      <div id={(voteFor) ? 'address-field-yes' : 'address-field-no'} class="grow text-1xl p-1 break-words w-full">{getAddress(false)}</div>
    </div>
    <div class="flex justify-end gap-1 gap-x-1 mt-1">
      <div class={(showCopy) ? 'block font-bold visible me-4' : 'block font-bold invisible me-4'}>copied bitcoin {(voteFor) ? 'vote yes' : 'vote no'} address</div>
      <LinkToExplorer class="h-8 w-8 bg-black text-white rounded-md flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200" target={explorerBtcAddressUrl(getAddress(true))} />
      <button id="copy-address" type="button" on:click={() => copy()} class="h-8 w-8 bg-black text-white rounded-md flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200">
        <Icon src="{ClipboardDocument}" class="h-5 w-5 text-white" aria-hidden="true" />
      </button>
    </div>
  </div>
</div>
