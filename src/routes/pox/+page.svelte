<script lang="ts">
	import Placeholder from '$lib/components/all-voters/Placeholder.svelte';
import Banner from '$lib/components/shared/Banner.svelte';
	import Countdown from '$lib/components/shared/Countdown.svelte';
	import NakamotoBackground from '$lib/components/shared/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/components/shared/NakamotoShield.svelte';
	import { getPoxInfo } from '$lib/pox_api';
	import { fmtMicroToStx, fmtNumber } from '$lib/utils';
	import { sbtcConfig } from '$stores/stores';
	import type { PoxInfo } from '$types/pox_types';
	import Cycles from "$lib/components/pox/Cycles.svelte";
	import { onMount } from 'svelte';
	import PoxLookup from '$lib/components/pox/PoxLookup.svelte';

  let poxInfo:PoxInfo;
	let method:number = 1;

  const reset = () => {
    method = 1
  }

  onMount(async () => {
    poxInfo = await getPoxInfo()
  })

</script>

<svelte:head>
  <title>Ecosystem DAO</title>
  <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>


<div class="max-w-7xl md:px-6 py-6 relative mx-auto">
  {#if poxInfo}
    <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
      <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
        <div class="mt-6 md:mt-0 flex flex-col gap-y-2 bg-warning-01">
          <div class="mb-4">
            <h2 class="text-[#131416] text-2xl mb-3">PoX Information</h2>
          </div>
          <div class="mb-3 max-w-xl">
            <Banner bannerType={'info'} message={'Voting is tied to PoX cycles.'} />
          </div>
          <div class="mb-4 rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
            {#if method === 1}
            <Cycles {poxInfo} />
            {:else}
            <PoxLookup {poxInfo} on:back={reset}/>
            {/if}
            <div class="flex justify-end gap-x-4">
              {#if method === 1}
              <div class="">
                <a href="/" on:click|preventDefault={() => method = 2} class="text-sm font-mono uppercase inline-flex items-center bg-[#EEEBE7] px-4 py-2  text-[#27282B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
                  PoX Calculator&nbsp;<span class="text-[#27282B]">-&gt;</span>
                </a>
              </div>
              {/if}
              {#if method === 2}
              <div class="">
                <a href="/" on:click|preventDefault={() => method = 1} class="text-sm font-mono uppercase inline-flex items-center bg-[#EEEBE7] px-4 py-2  text-[#27282B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
                  <span class="text-[#27282B]">&lt;-</span>&nbsp;BACK
                </a>
              </div>
              {/if}
            </div>
          </div>
        </div>

        <NakamotoBackground />
        <NakamotoShield />
      </div>
    </div>
  {:else}
    <Placeholder />
  {/if}
</div>