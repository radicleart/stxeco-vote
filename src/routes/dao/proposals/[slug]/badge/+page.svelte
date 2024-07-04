<script lang="ts">
import { page } from "$app/stores";
import { onMount } from 'svelte';
import DaoUtils from '$lib/service/DaoUtils';
import { sessionStore } from "$stores/stores";
import ProposalHeader from "$lib/components/all-voters/ProposalHeader.svelte";
import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
import NakamotoShield from "$lib/ui/NakamotoShield.svelte";
import BadgeClaim from "$lib/components/all-voters/badge/BadgeClaim.svelte";
import { ProposalStage, type VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";
import { goto } from "$app/navigation";
import { daoStore } from "$stores/stores_dao";
import { isLoggedIn } from "@mijoco/stx_helpers/dist/account";
import { getCurrentProposalLink, getProposalLatest, isVoting } from "$lib/proposals";
import { Placeholder } from "@mijoco/stx_components";

let proposal:VotingEventProposeProposal|undefined;

onMount(async () => {
	proposal = await getProposalLatest($page.params.slug)
})
</script>


<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

{#if proposal}
  <div class="py-6 mx-auto max-w-7xl md:px-6">

    <ProposalHeader {proposal}/>

    <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
      <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
        {#if isLoggedIn()}
        <div class="flex flex-col gap-y-2 bg-warning-01">
          <div class="flex flex-col gap-y-5 bg-warning-01">
            <h1 class="text-4xl">Thank you for your vote!</h1>
            <p class="text-lg">You are now part of Stacks history 🎉🟧</p>
            <BadgeClaim/>
          </div>
        </div>
        {:else}
        <div class="flex flex-col gap-y-2 bg-warning-01">
          <div class="flex flex-col gap-y-5 bg-warning-01">
            <h1 class="text-4xl">Thank you for voting!</h1>
            <p class="text-base">Connect your wallet to continue.</p>
          </div>
        </div>
        {/if}

        <NakamotoBackground />
        <NakamotoShield />
      </div>
    </div>
  </div>
{:else}
<Placeholder message={'Vote info loading'} link={getCurrentProposalLink()}/>
{/if}
