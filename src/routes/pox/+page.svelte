<script lang="ts">
  import Banner from '$lib/ui/Banner.svelte';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import Cycles from "$lib/components/pox/Cycles.svelte";
	import { onMount } from 'svelte';
	import RewardSlots from '$lib/components/pox/RewardSlots.svelte';
	import PoxEntries from '$lib/components/pox/PoxEntries.svelte';
	import StackerInfo from '$lib/components/pox/StackerInfo.svelte';
	import { sessionStore } from '$stores/stores';
	import type { PoxEntry, PoxInfo } from '@mijoco/stx_helpers/dist/index';
	import { getCurrentProposal, getCurrentProposalLink } from '$lib/proposals';
	import { Placeholder } from '@mijoco/stx_components';

  let poxInfo:PoxInfo;
  let poxEntry:PoxEntry;
	let method:number = 1;

  const stackerInfo = (evt:any) => {
    poxEntry = evt.detail.entry
    method = 2
  }

  const reset = () => {
    method = 1
  }

  onMount(async () => {
    poxInfo = $sessionStore.poxInfo;
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
      <div class="flex flex-col gap-y-2 bg-warning-01">
      <div class="mb-4">
          <h2 class="text-[#131416] text-2xl mb-3">PoX Information</h2>
        </div>
        <div class="mb-3 max-w-xl">
          <Banner bannerType={'warning'} message={'Voting is tied to PoX cycles.'} />
        </div>
        <div class="mb-4 rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
          {#if method === 1}
          <Cycles {poxInfo} />
          {:else if method === 2}
          <StackerInfo {poxInfo} {poxEntry} on:back={reset}/>
          {:else if method === 3}
          <PoxEntries {poxInfo} on:stacker-info={stackerInfo}/>
          {:else if method === 4}
          <RewardSlots {poxInfo} on:back={reset}/>
          {/if}
          <div class="flex justify-end gap-x-4">
            {#if method === 1}
            <div class="">
              <a href="/" on:click|preventDefault={() => method = 2} class="text-sm font-mono uppercase inline-flex items-center bg-[#EEEBE7] px-4 py-2  text-[#27282B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
                Lookup Stacker&nbsp;<span class="text-[#27282B]">-&gt;</span>
              </a>
            </div>
            <div class="">
              <a href="/" on:click|preventDefault={() => method = 3} class="text-sm font-mono uppercase inline-flex items-center bg-[#EEEBE7] px-4 py-2  text-[#27282B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
                PoX Entries&nbsp;<span class="text-[#27282B]">-&gt;</span>
              </a>
            </div>
            <div class="">
              <a href="/" on:click|preventDefault={() => method = 4} class="text-sm font-mono uppercase inline-flex items-center bg-[#EEEBE7] px-4 py-2  text-[#27282B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
                Reward slots&nbsp;<span class="text-[#27282B]">-&gt;</span>
              </a>
            </div>
            {:else if method > 1}
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
  <Placeholder message={'Vote info loading'} link={getCurrentProposalLink()}/>
  {/if}
</div>