<script lang="ts">
	import Banner from "$lib/ui/Banner.svelte";
  import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
	import type { VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import PoolVotingActiveQr from "./PoolVotingActiveQR.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let proposal:VotingEventProposeProposal;
  let revealAddresses = false;

  const toggleMethod = (method:number) => {
    dispatch('toggle_voting_method', {method})
  }
</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    <div class="">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Voting for Solo and Pool Stackers</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 w-4/5">
        <p>Solo and pool stackers can vote by sending a dust stacks transaction (~1 micro stx)</p>
        <p class="my-3 uppercase">Your vote will not be counted if it is not sent from the same account where your stx is locked.</p>
        <p>Express your vote by sending a stacks transaction to either;</p>
        <ul class="list-disc pl-6 mb-5">
          <li>an address representing “Yes to the proposal”</li>
          <li>an address representing “No to this proposal".</li>
        </ul>
        <div class="rounded-lg relative bg-[#E6E4E2] py-3 w-4/5">
          <p><a href="/" on:click|preventDefault={() => {toggleMethod(1)}}>Prefer to vote with a bitcoin transaction ?</a></p>
          <p><a href="/" on:click|preventDefault={() => {toggleMethod(3)}}>Want to vote with your unstacked stx ?</a></p>
        </div>
      </div>
      <div class="rounded-lg py-6 space-y-3 w-4/5">
        <Banner bannerType={'warning'} message={'Transactions sent from addresses that are not stacking (solo or pool), will not count as votes!'} />
      </div>
      <button on:click={() => {revealAddresses = !revealAddresses}} class="space-y-3  text-sm font-mono uppercase block w-4/5 px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
        I understand, continue
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