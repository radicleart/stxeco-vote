<script lang="ts">
	import NakamotoBackground from "$lib/components/shared/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/components/shared/NakamotoShield.svelte";
	import type { ProposalEvent } from "$types/stxeco.type";
	import PoolVotingActiveQr from "./PoolVotingActiveQR.svelte";

  export let proposal: ProposalEvent;

</script>

<div class="flex flex-col w-full my-8">
  <div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

    <div class="mt-6 md:mt-0">
      <div class="mb-4">
        <h2 class="text-[#131416] text-2xl mb-3">Voting as Pool Stackers (Method 2)</h2>
      </div>
      <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
        <p>Voters who are stacking on their own must send a dust amount of STX (~1 micro stx) from their PoX Bitcoin reward address to either:</p>
        <ul class="list-disc pl-6">
          <li>an address representing the “Yes to Nakamoto Release”</li>
          <li>an address representing the “No to Nakamoto Release”.</li>
        </ul>
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
