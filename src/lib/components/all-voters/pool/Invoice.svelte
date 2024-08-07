<script lang="ts">
  import { onMount, tick } from "svelte";
  import QrCode from "svelte-qrcode"
  import { Icon, ClipboardDocument } from "svelte-hero-icons"
  import { explorerAddressUrl, fmtMicroToStx, fmtSatoshiToBitcoin } from '$lib/utils'
  import LinkToExplorer from '$lib/ui/LinkToExplorer.svelte';
	import { makeFlash } from "@mijoco/stx_helpers/dist/index";

  export let address:string;
  export let voteFor = false;
  // NB Its possible the user paid a different amount to the amount they entered in the UI - ths takes the on chain amount first
  let amount = 1;
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
    return address
  }

  onMount(async () => {
  })
</script>

<div id="clipboard"></div>
{#if valueCopy != null}
  <textarea bind:this={areaDom}>{ valueCopy }</textarea>
{/if}
<div class="relative z-[1]">
  <div class="flex items-start justify-between">
    <div>
      {#if voteFor}
        <div class="flex flex-col gap-5">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1048 40.4977L4.47473 26.3594C3.84176 25.7049 3.84176 24.5703 4.47473 23.9158L9.07436 19.1594C9.70734 18.5049 10.8045 18.5049 11.4375 19.1594L19.0332 27.0576L36.3346 7.5521C36.9675 6.85391 38.0225 6.81028 38.6977 7.46483L43.4661 12.003C44.1413 12.6576 44.1835 13.7485 43.5505 14.4467L20.5523 40.454C19.8772 41.1522 18.78 41.1959 18.1048 40.4977Z" fill="black"/>
          </svg>
          <p class="text-3xl">Yes</p>
        </div>
        {:else}
          <div class="flex flex-col gap-5">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M43.3228 9.37246L38.6275 4.6772C37.7246 3.77427 36.4605 3.77427 35.5576 4.6772L24 16.2348L12.4424 4.6772C11.5395 3.77427 10.0948 3.77427 9.37246 4.6772L4.6772 9.37246C3.77427 10.0948 3.77427 11.5395 4.6772 12.4424L16.2348 24L4.6772 35.5576C3.77427 36.4605 3.77427 37.7246 4.6772 38.6275L9.37246 43.3228C10.0948 44.2257 11.5395 44.2257 12.4424 43.3228L24 31.7652L35.5576 43.3228C36.4605 44.2257 37.7246 44.2257 38.6275 43.3228L43.3228 38.6275C44.2257 37.7246 44.2257 36.4605 43.3228 35.5576L31.7652 24L43.3228 12.4424C44.2257 11.5395 44.2257 10.0948 43.3228 9.37246Z" fill="black"/>
              </svg>
            <p class="text-3xl">No</p>
          </div>
      {/if}
    </div>
    <div class="h-[144px] rounded-lg overflow-hidden border border-sand-300">
      <QrCode value={paymentUri()} size={144} color={'#000'} background={'#fff'} />
    </div>
  </div>

  <div class="mt-8">
    <div class="flex justify-between items-end">
      <p>Send {fmtMicroToStx(amount)} STX to:</p>
      <div class="flex items-center gap-2">
        <LinkToExplorer class="h-8 w-8 bg-black text-white rounded-md flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200" target={explorerAddressUrl(getAddress(true))} />
        <button id="copy-address" type="button" on:click={() => copy()} class="h-8 w-8 bg-black text-white rounded-md flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200">
          <Icon src="{ClipboardDocument}" class="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div id={(voteFor) ? 'address-field-yes' : 'address-field-no'} class="bg-[#121314] px-2 py-2 font-mono text-sm break-words rounded-md text-white mt-2">{getAddress(false)}</div>
    <div class={(showCopy) ? 'text-sm visible' : 'text-sm invisible'}>Copied to clipboard</div>
  </div>
</div>


<!--
<div class="text-white leading-none mt-2 px-1 py-1">
  <div class="block">Vote {(voteFor) ? 'YES' : 'NO'} by sending a tiny amount of STX here.</div>
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
      <div class={(showCopy) ? 'block visible me-4' : 'block invisible me-4'}>copied bitcoin {(voteFor) ? 'vote yes' : 'vote no'} address</div>
      <LinkToExplorer class="h-8 w-8 bg-black text-white rounded-md flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200" target={explorerAddressUrl(getAddress(true))} />
      <button id="copy-address" type="button" on:click={() => copy()} class="h-8 w-8 bg-black text-white rounded-md flex items-center justify-center border border-transparent hover:border-gray-900 transition duration-200">
        <Icon src="{ClipboardDocument}" class="h-5 w-5 text-white" aria-hidden="true" />
      </button>
    </div>
  </div>
</div>
-->