<script lang="ts">
	import Banner from "$lib/ui/Banner.svelte";
	import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
	import { getConfig } from "$stores/store_helpers";
	import { getDaoVotesByProposalAndVoter } from "$lib/dao_api";
	import ChainUtils from "$lib/service/ChainUtils";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";
	import { sessionStore } from "$stores/stores";
	import BallotBox from "./DaoVotingBallotBox.svelte";
	import { onMount } from 'svelte';
	import { isLoggedIn } from "@mijoco/stx_helpers/dist/account";
	import { ProposalStage, type ProposalEvent } from "@mijoco/stx_helpers/dist/index";

  export let proposal: ProposalEvent;
	export let adjustBal:number
  const votes: any[] = []
  let voted = 0;
  let balanceAtHeight = 0;
  let votedPower = 0;
  let inited = false;

	onMount(async () => {
      const daoVotes = await getDaoVotesByProposalAndVoter(proposal.contractId, $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)
      if (daoVotes && daoVotes.length > 0) {
        daoVotes.forEach((o:any) => {
          if (o) votes.push(o)
          const amountVoted = Number(o.amount)
          if (o.for) {
            votedPower += amountVoted
          } else {
            votedPower += amountVoted
          }
          voted++
        });
        balanceAtHeight = ChainUtils.toOnChainAmount(adjustBal) - votedPower
				balanceAtHeight = (balanceAtHeight)
      } else {
				balanceAtHeight = ChainUtils.toOnChainAmount(adjustBal)
      }
      balanceAtHeight = ChainUtils.fromMicroAmount(balanceAtHeight)
      inited = true

	});

</script>

{#if inited}
<div>
  <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
    <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
      <div class="flex flex-col gap-y-2 bg-warning-01">
        <div class="mb-4">
          <h2 class="text-[#131416] text-2xl mb-3">Voting as Non Stackers (Method 3)</h2>
        </div>
        <div class="mb-4 rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
          <p>Vote with your liquid STX balance using your Leather / Xverse wallet.</p>
          {#if !isLoggedIn()}
          <p>Connect your wallet to vote!</p>
          {/if}
        </div>
    
        {#if voted > 0}
        <div class="mb-3 max-w-xl">
          <Banner bannerType={'warning'} message={'Account has voted with ' + fmtMicroToStx(votedPower) + ' stx. <a href="/dao/proposals/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.bdp001-sip-021-nakamoto/badge?method=3" >collect your badge here!</a>'} />
        </div>
        {/if}

        {#if balanceAtHeight > 0}
        <div>
          {#if proposal && proposal.stage === ProposalStage.ACTIVE}
          <BallotBox {proposal} {balanceAtHeight}/>
          {/if}
        </div>
        {:else}
          {#if voted === 0 && isLoggedIn()}
          <div class="mb-3 max-w-xl">
            <Banner bannerType={'danger'} message={'Account not eligible to vote. Your balance when voting began (at block ' + fmtNumber(proposal.proposalData.startBlockHeight) + ') was 0 STX.'} />
          </div>
          {/if}
        {/if}
      </div>

      <NakamotoBackground />
      <NakamotoShield />
    </div>
  </div>
</div>
{/if}