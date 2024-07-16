<script lang="ts">
	import Countdown from "$lib/ui/Countdown.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import { fetchBlockAtHeight } from "@mijoco/btc_helpers/dist/index";
	import { getPoxInfo, getStacksHeightFromBurnBlockHeight, type PoxInfo, type VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import { onMount } from "svelte";


  let currentBurnHeight:number = $sessionStore.stacksInfo.burn_block_height;
  let currentBlock:any;
  let newHeight:number = currentBurnHeight;
  let bitcoinBlock:any;
  let stacksBlock:any;
  $: blockHeightDiff = (newHeight - currentBurnHeight)

  const fetchBitcoinBlock = async () => {
    try {
      bitcoinBlock = await fetchBlockAtHeight(getConfig().VITE_MEMPOOL_API, newHeight)
      stacksBlock = await getStacksHeightFromBurnBlockHeight(getConfig().VITE_STACKS_API, newHeight)
    } catch (err:any) {
    }
    if (!bitcoinBlock) {
      const blocksToMine = newHeight - currentBurnHeight
      bitcoinBlock = {
        timestamp: currentBlock.timestamp + (blocksToMine * 10 * 60),
      }
    }
  }

	onMount(async () => {
    currentBlock = await fetchBlockAtHeight(getConfig().VITE_MEMPOOL_API, newHeight)
    fetchBitcoinBlock()
  })
</script>

<div class="my-5 bg-sand-300 rounded-md p-3">
  <div class="row">
    <div>

      <div class="w-full flex flex-col justify-start my-4">
        <label for="token-name" class="w-auto">Current bitcoin height {currentBurnHeight}:</label>
        <div class="w-full flex justify-start my-4">
          <div class="me-2"><input id="token-name" class="rounded-lg p-2 text-black border-gray-800" bind:value={newHeight} type="text" aria-describedby="tokenName"/></div>
          <button on:click={() => {fetchBitcoinBlock()}} class="w-auto text-white bg-black justify-startc items-start gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
            go
          </button>
      </div>
      </div>

      {#if bitcoinBlock}
      {#if (currentBurnHeight - newHeight) < 0}
      <div class="w-full flex flex-col justify-start my-4">
        {newHeight - currentBurnHeight} blocks in the future
      </div>
      {/if}
      <div class="w-full flex flex-col justify-start my-4">
        {new Date(bitcoinBlock.timestamp * 1000)}
      </div>
      {/if}

      {#if stacksBlock && stacksBlock > -1}
      <div class="w-full flex flex-col justify-start my-4">
        Stacks block height: {stacksBlock}
      </div>
      {/if}

    </div>
  </div>
</div>