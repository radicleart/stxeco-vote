<script lang="ts">
	import { getBalanceAtHeight } from "$lib/bridge_api";
	import Banner from "$lib/components/shared/Banner.svelte";
	import NakamotoBackground from "$lib/components/shared/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/components/shared/NakamotoShield.svelte";
	import { CONFIG } from "$lib/config";
	import { getDaoVotesByProposalAndVoter } from "$lib/dao_api";
	import ChainUtils from "$lib/service/ChainUtils";
	import { loggedIn } from "$lib/stacks_connect";
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";
	import { sbtcConfig } from "$stores/stores";
  import { ProposalStage, type ProposalEvent } from "$types/stxeco.type";
	import BallotBox from "./DaoVotingBallotBox.svelte";
	import { onMount } from 'svelte';

  export let proposal: ProposalEvent;
	let balanceAtHeight:number
  const votes: any[] = []
  let voted = 0;
  let votedPower = 0;
  let inited = false;

	onMount(async () => {
    let adjustBal = 0
			try {
				const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposal.proposalData.startBlockHeight);
				adjustBal = Number(response.stx.balance) - Number(response.stx.locked)
			} catch (e:any) {
				adjustBal = 0;
			}
      const daoVotes = await getDaoVotesByProposalAndVoter(proposal.contractId, $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)
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
        balanceAtHeight = adjustBal - votedPower
				balanceAtHeight = ChainUtils.fromMicroAmount(balanceAtHeight)
      } else {
				balanceAtHeight = ChainUtils.fromMicroAmount(adjustBal)
      }
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
          {#if !loggedIn()}
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
          {#if voted === 0 && loggedIn()}
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