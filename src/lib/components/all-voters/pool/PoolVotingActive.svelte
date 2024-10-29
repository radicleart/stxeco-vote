<script lang="ts">
	import Banner from "$lib/ui/Banner.svelte";
  import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
	import type { VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
	import PoolVotingActiveQr from "./PoolVotingActiveQR.svelte";
	import { createEventDispatcher } from "svelte";
	import { explorerTxUrl } from "$lib/utils";
	import { isLoggedIn } from "@mijoco/stx_helpers/dist/account";
	import VotingPower from "../dao-voting/VotingPower.svelte";
	import Switch from '$lib/assets/SwitchArrows.svelte';

	const dispatch = createEventDispatcher();

	export let proposal:VotingEventProposeProposal;
  export let totalBalanceAtHeight = 0
  export let lockedBalanceAtHeight = 0
  let showOnPanel = false;
  let revealAddresses = true;
  let justVoted = false
  let txId:string
  let showPaymentButtons = false;

  const toggleVoting = () => {
    if (isLoggedIn()) {
      showPaymentButtons = !showPaymentButtons
    }
  }

  const doVotingEvent = (e:any) => {
    txId = e.detail.txId
    justVoted = true
  }

  const toggleMethod = (method:number) => {
    dispatch('toggle_voting_method', {method})
  }
</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    {#if justVoted}
    <div class="">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Thanks for voting !!</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 w-4/5">
        <p>
          Track your vote <a class="underline hover:text-blue-500" target="_blank" href={explorerTxUrl(txId)}>here</a>
        </p>
        <p>
          Results will be posted after voting closes at block {proposal.proposalData.burnEndHeight}
        </p>
      </div>
    </div>

    {:else}

    <div class="">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Stacks Voting</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 ">
        <p>Vote by sending a dust stacks transaction (~1 micro stx) to either;</p>
        <ul class="list-disc pl-6 mb-5">
          <li>an address representing "Yes" to the proposal</li>
          <li>an address representing "No" to this proposal.</li>
        </ul>
        <div class="rounded-lg relative bg-[#E6E4E2] py-3 ">
          <p><a class="underline hover:text-blue-500" href="/" on:click|preventDefault={() => {toggleMethod(1)}}>Prefer to vote with a bitcoin transaction ?</a></p>
        </div>
        {#if isLoggedIn()}
        <div class="mb-8 ">
          <VotingPower {proposal}/>
        </div>
        {/if}
        {#if revealAddresses}
        <div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
          <div class="col-span-1 p-8 bg-[#121314] rounded-2xl">
            <h3 class="text-3xl text-white mb-5">Cast your vote</h3>
            {#if isLoggedIn() && showOnPanel}
            <p class="mt-0 text-white text-sm">To send from connected wallet <a href="/" on:click|preventDefault={() => showPaymentButtons = !showPaymentButtons} class="underline">click here</a></p>
            {/if}
          </div>
          <div class="col-span-2">
            <div class="mb-5">
              {#if isLoggedIn()}
              <a class="inline-block relative top-[8px]" href="/" on:click|preventDefault={() => {toggleVoting()}}><Switch/></a>
              {#if showPaymentButtons}
              <a class="underline inline-block relative top-[5px]" href="/" on:click|preventDefault={() => {toggleVoting()}}>Send from connected wallet</a>
              {:else}
              <a class="underline inline-block relative top-[5px]" href="/" on:click|preventDefault={() => {toggleVoting()}}>Send from stacking address</a>
              {/if}
              {/if}
            </div>
            <div>
              <div class="mb-3 lg:grid lg:gap-8 grid-cols-1 space-y-4 lg:space-y-0">
                <PoolVotingActiveQr {proposal}  {totalBalanceAtHeight} {lockedBalanceAtHeight} {showPaymentButtons} on:voting_event={doVotingEvent}/>
              </div>
            </div>
          </div>
        </div>
        {/if}
      </div>
      <!--
      <div class="rounded-lg py-6 space-y-3 w-4/5">
        <Banner bannerType={'warning'} message={'Send votes from main account(s) to maximise your voting power!'} />
      </div>
      <button on:click={() => {revealAddresses = !revealAddresses}} class="space-y-3  text-sm font-mono uppercase block w-4/5 px-4 py-2 text-white bg-[#131416] rounded-md border border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50">
        I understand, continue
      </button>
      -->
    </div>
    {/if}

</div>
</div>
