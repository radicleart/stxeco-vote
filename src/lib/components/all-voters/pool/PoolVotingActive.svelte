<script lang="ts">
	import Banner from "$lib/ui/Banner.svelte";
  import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
	import type { VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import PoolVotingActiveQr from "./PoolVotingActiveQR.svelte";

	export let proposal:VotingEventProposeProposal;
  let revealAddresses = false;
</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    <div class="">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Voting for Stackers</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
        <p>Stackers can vote by sending a dust stacks transaction (~1 micro stx) from your <span class=" font-bold text-blue-700">stacking
          account</span>. Express your vote by sending to either:</p>
        <ul class="list-disc pl-6 mb-5">
          <li>an address representing the “Yes to the proposal”</li>
          <li>an address representing the “No to this proposal.</li>
        </ul>
      </div>
      <div class="rounded-lg py-6 space-y-3 max-w-xl">
        <Banner bannerType={'warning'} message={'Transactions sent from addresses that are not stacking (solo or pool), will not count as votes!'} />
      </div>
      <button on:click={() => {revealAddresses = !revealAddresses}} class="space-y-3 max-w-xl text-sm font-mono uppercase block w-full px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
        Click to reveal voting addresses
      </button>
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
  <PoolVotingActiveQr {proposal}/>
</div>
{/if}