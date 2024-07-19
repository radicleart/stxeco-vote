<script lang="ts">
	import { fmtNumber } from "$lib/utils";
  import { getConfig } from "$stores/store_helpers";
	import { sessionStore } from "$stores/stores";
	import { fetchBlockAtHeight } from "@mijoco/btc_helpers/dist/index";
	import type { PoxCycleInfo, PoxInfo } from "@mijoco/stx_helpers/dist/pox_types";
	import { getPoxCycleInfoRelative } from "@mijoco/stx_helpers/dist/pox/index";
	import { onMount } from "svelte";
	import { ArrowLeft, ArrowRight, Icon } from "svelte-hero-icons";
	import { page } from "$app/stores";
	import { isCoordinator } from "$lib/proposals";
	import { syncPoxEntriesByCycle, syncRewardCycleEvents } from "$lib/pox_api";

  export let poxInfo:PoxInfo
  export let cycle:number

  let currentBurnHeight:number = $sessionStore.stacksInfo.burn_block_height;
  let currentBlock:any;
  let poxInfoCycle:PoxCycleInfo;

  let newCycle:number = cycle;

  const fetchCycle = async () => {
    $page.url.searchParams.set('cycle', '' + newCycle)
    history.pushState({}, '', $page.url);
    poxInfoCycle = await getPoxCycleInfoRelative(getConfig().VITE_STACKS_API, getConfig().VITE_MEMPOOL_API, getConfig().VITE_POX_CONTRACT_ID, newCycle, currentBurnHeight)
  }

  const readPoxEntries = async () => {
    const entries = await syncPoxEntriesByCycle(newCycle)
  }

  const readRewardCycleEvents = async () => {
    syncRewardCycleEvents()

  }

  const fetchNext = async () => {
    newCycle++
    await fetchCycle()
  }

  const fetchPrevious = async () => {
    newCycle--
    await fetchCycle()
  }


	onMount(async () => {
    cycle = (cycle > 0) ? cycle : poxInfo.reward_cycle_id;
    newCycle = cycle;
    currentBlock = await fetchBlockAtHeight(getConfig().VITE_MEMPOOL_API, $sessionStore.stacksInfo.burn_block_height)
    await fetchCycle()
  })
</script>

<div class="my-5 bg-sand-300 rounded-md p-3">
  <div class="row">
    <div>
      <div class="w-full flex flex-col justify-start my-4">
        <label for="token-name" class="w-auto">Current cycle: {cycle}, current block height: {fmtNumber(currentBurnHeight)}</label>
        <div class="w-1/2 flex justify-start my-4">
          <div class="me-2 grow flex flex-col">
            <div class="me-2 flex">
              <input id="token-name" class="w-full rounded-lg p-2 text-black border-gray-800" bind:value={newCycle} type="text" aria-describedby="tokenName"/>
              <button on:click={() => {fetchCycle()}} class="ms-3 w-auto text-white justify-start bg-black items-start gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
                go
              </button>
            </div>
            <div class=" flex justify-start gap-x-5 my-2">
              <div>
                <button on:click={() => {fetchPrevious()}} class=" text-white  ">
                  <Icon src={ArrowLeft} width={20} height={20} class="text-black "/>
                </button>
              </div>
              <div>
                <button on:click={() => {fetchNext()}} class=" text-white ">
                  <Icon src={ArrowRight} width={20} height={20} class="text-black "/>
                </button>
              </div>
            </div>
        </div>
        </div>
      </div>

      <div class="mt-4">
        <h1 class="text-2xl">Cycle information</h1>
      </div>

      {#if (cycle === newCycle)}
      <div class="w-full flex flex-col justify-start my-4">
        
      </div>
      {:else if (cycle - newCycle) < 0}
      <div class="w-full flex flex-col justify-start my-4">
        Cycle {newCycle}: {newCycle - cycle} cycles in the future
      </div>
      {:else}
      <div class="w-full flex flex-col justify-start my-4">
        Cycle {newCycle}: {cycle - newCycle} cycles in the past
      </div>
      {/if}

      {#if poxInfoCycle}
      <div class="w-full flex justify-start my-4">
        <div class="w-1/4">Cycle starts: {fmtNumber(poxInfoCycle.firstBlockHeight)}</div><div class="w-1/2">~ {new Date(poxInfoCycle.firstBlockTime)}</div> 
      </div>
      <div class="w-full flex justify-start my-4">
        <div class="w-1/4">Cycle ends:&nbsp;&nbsp; {fmtNumber(poxInfoCycle.lastBlockHeight)}</div><div class="w-1/2">~ {new Date(poxInfoCycle.lastBlockTime)}</div> 
      </div>


      {#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
      <div class="w-full flex justify-start my-4">
        <div class="w-1/4"><a href="/" on:click|preventDefault={() => readPoxEntries()}>Sync pox entries for cycle {newCycle}</a></div> 
      </div>
      <div class="w-full flex justify-start my-4">
        <div class="w-1/4"><a href="/" on:click|preventDefault={() => readRewardCycleEvents()}>Sync reward cycle events</a></div> 
      </div>
      {/if}


      {/if}

    </div>
  </div>
</div>