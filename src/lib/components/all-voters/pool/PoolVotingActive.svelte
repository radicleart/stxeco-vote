<script lang="ts">
	import Banner from "$lib/components/shared/Banner.svelte";
import NakamotoBackground from "$lib/components/shared/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/components/shared/NakamotoShield.svelte";
	import type { ProposalEvent } from "$types/stxeco.type";
	import PoolVotingActiveQr from "./PoolVotingActiveQR.svelte";

  export let proposal: ProposalEvent;

</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    <div class="">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Voting as Pool Stackers (Method 2)</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
        <p>Voters who are stacking in a pool send a dust amount of STX (~1 micro stx) <span class="text-black">from the stacks
          address they registered with the pool</span>. The dust amount is sent to either:</p>
        <ul class="list-disc pl-6 mb-5">
          <li>an address representing the “Yes to Nakamoto Release”</li>
          <li>an address representing the “No to Nakamoto Release”.</li>
        </ul>
      </div>
      <div class="rounded-lg py-6 space-y-3 max-w-xl">
        <Banner bannerType={'warning'} message={'Be sure to send from the Stacks address you registered with the pool!'} />
      </div>
    </div>

    <NakamotoBackground />
    <NakamotoShield />
</div>
</div>

<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
  <div class="p-8 bg-[#121314] rounded-2xl">
    <h3 class="text-3xl text-white">Cast your vote</h3>
  </div>
  <PoolVotingActiveQr {proposal}/>
</div>
