<script lang="ts">
import { page } from "$app/stores";
import { onMount } from 'svelte';
import DaoUtils from '$lib/service/DaoUtils';
import { sbtcConfig } from "$stores/stores";
import { loggedIn } from "$lib/stacks_connect";
import { goto } from "$app/navigation";
import type { ProposalEvent } from "$types/stxeco.type";
import ProposalHeader from "$lib/components/all-voters/ProposalHeader.svelte";
import BadgeClaim from "$lib/components/all-voters/BadgeClaim.svelte";
import NakamotoBackground from "$lib/components/shared/NakamotoBackground.svelte";
import NakamotoShield from "$lib/components/shared/NakamotoShield.svelte";
	import SpaceHolder from "$lib/components/all-voters/SpaceHolder.svelte";

let proposal:ProposalEvent;
let inited = false;
onMount(async () => {
  if (!loggedIn()) {
    goto('/')
    return
  }
  let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
  if (event) {
    proposal = event;
    const stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
    DaoUtils.setStatus(stacksTipHeight, proposal);
    console.log(event)
  } else {
    goto('/')
  }
  inited = true
})
</script>


<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

{#if inited}
  <div class="py-6 mx-auto max-w-7xl md:px-6">
    {#if proposal}
      <ProposalHeader {proposal} />
    {/if}
    <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
      <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

        <div class="mt-6 md:mt-0 flex flex-col gap-y-2 bg-warning-01">
          <div class="mt-6 md:mt-0 flex flex-col gap-y-5 bg-warning-01">
            <h1 class="text-4xl">Thank you for your vote!</h1>
            <p class="text-lg">You are now part of Stacks history 🎉🟧</p>
            <BadgeClaim/>
          </div>
        </div>

        <NakamotoBackground />
        <NakamotoShield />
      </div>
    </div>
  </div>
{:else}
  <SpaceHolder />
{/if}
