<script lang="ts">
	import { getBalanceAtHeight } from "$lib/bridge_api";
	import Banner from "$lib/components/shared/Banner.svelte";
	import NakamotoBackground from "$lib/components/shared/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/components/shared/NakamotoShield.svelte";
	import { CONFIG } from "$lib/config";
	import ChainUtils from "$lib/service/ChainUtils";
	import { sbtcConfig } from "$stores/stores";
  import type { ProposalEvent } from "$types/stxeco.type";
	import BallotBox from "./DaoVotingBallotBox.svelte";
	import { onMount } from 'svelte';

  export let proposal: ProposalEvent;
	let balanceAtHeight:number

	onMount(async () => {
			try {
				const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposal.proposalData.startBlockHeight);
				balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
			} catch (e:any) {
				balanceAtHeight = 0;
			}
	});

</script>

<div class="flex flex-row w-full my-8">
  <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
    <div class="py-10 px-10 md:px-12 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

      <div class="mt-6 md:mt-0 flex flex-col gap-y-2 bg-warning-01">
        <div class="mb-4">
          <h2 class="text-[#131416] text-2xl mb-3">Voting as Non Stackers (Method 3)</h2>
        </div>
        <div class="mb-4 rounded-lg relative bg-[#E6E4E2] px-6 py-8 space-y-3 max-w-xl">
          <p>Instructions:</p>
          <p>Vote with your liquid STX balance using your Leather / Xverse wallet.</p>
        </div>
        <div class="mb-3 max-w-xl">
          <Banner bannerType={'warning'} message={'No STX will be spent by voting but you will pay a gas fee.'} />
        </div>
        <div>
          {#if proposal && typeof proposal.status === 'object'}
          <BallotBox {proposal} {balanceAtHeight}/>
          {/if}
        </div>
      </div>

      <NakamotoBackground />
      <NakamotoShield />
  </div>
  </div>
</div>
