<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton, Tabs, TabItem } from 'flowbite-svelte';
  import { COMMS_ERROR } from '$lib/utils.js'
  import { sbtcConfig } from '$stores/stores';
	import { page } from '$app/stores';
	import ProposalFull from '$lib/components/dao/proposals/ProposalFull.svelte';
	import { CONFIG } from '$lib/config';
	import DaoUtils from '$lib/service/DaoUtils';
	import { getBalanceAtHeight } from '$lib/bridge_api';
	import ChainUtils from '$lib/service/ChainUtils';
	import { ProposalStage, type ProposalEvent } from '$types/stxeco.type';
	import { goto } from '$app/navigation';
	import SoloStackers from '$lib/components/non-dao/solo/SoloStackers.svelte';
	import PoolStackers from '$lib/components/non-dao/pool/PoolStackers.svelte';
	import DaoVoters from '$lib/components/non-dao/dao-voting/DaoVoters.svelte';
	import VotingSchedule from '$lib/components/dao/voting/VotingSchedule.svelte';
	import Preamble from '$lib/components/dao/proposals/Preamble.svelte';
	import { ChevronRight, Icon } from 'svelte-hero-icons';
	import ChevronDown from '$lib/components/shared/ChevronDown.svelte';
	import ChevronUp from '$lib/components/shared/ChevronUp.svelte';

  // fetch/hydrate data from local storage
  let inited = false;
  let method:number = 3;
  let errorReason:string|undefined;
	let proposalEvent:ProposalEvent;
	let balanceAtHeight:number = 0;
	let showPreamble = false;

	onMount(async () => {
		let event:ProposalEvent|undefined = await DaoUtils.getProposal($sbtcConfig.proposals, $page.params.slug);
    if (event) {
      proposalEvent = event;
      DaoUtils.setStatus($sbtcConfig.stacksInfo.stacks_tip_height, proposalEvent);
      console.log(event)
    } else {
      goto('/dao/proposals/propose')
    }

    try {
      method = Number($page.url.searchParams.get('method')) || 3
      if (method !== 1 && method !== 2 && method !== 3) method = 3
      inited = true;
    } catch (err) {
      errorReason = COMMS_ERROR;
    }

    try {
      const response = await getBalanceAtHeight($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress, proposalEvent.proposalData.startBlockHeight);
      balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
    } catch (e:any) {
      balanceAtHeight = 0;
      errorReason = e.message;
    }

	})

</script>

<svelte:head>
  <title>Ecosystem DAO - SIP Voting</title>
  <meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

{#if proposalEvent}
<div class="py-6 mx-auto max-w-7xl md:px-6">
  <div class="flex flex-col w-full my-8">
    <div class="flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
      <div class="">
        <h1 class={'text-primary-500 text-4xl'}>
          {proposalEvent.proposalMeta.title}
        </h1>
        <p class="flex justify-between gap-x-5 text-sm text-gray-600">      
          <a class="inline " href="/" on:click|preventDefault={() => showPreamble = !showPreamble}>{#if showPreamble}&lt;{:else}&gt;{/if} proposal details</a>
          <a class="inline " href="/" on:click={() => goto(`/dao/results/${proposalEvent.contractId}`)}>results</a>
          <VotingSchedule {proposalEvent} />
        </p>
        {#if showPreamble}
        <div class="w-full flex-col gap-y-2">
          <div class="flex flex-col border-[0.5px] border-gray-500 rounded-lg p-2 sm:p-5 overflow-hidden bg-gray-1000">
            <h4 class={'text-2xl text-' + proposalEvent.status?.colorCode}>Proposal</h4>
            <div class="mt-4"><Preamble proposal={proposalEvent} /></div>
          </div>
        </div>
        {/if}
      </div>
      {#if proposalEvent.stage === ProposalStage.PARTIAL_FUNDING || proposalEvent.stage === ProposalStage.UNFUNDED}
        <a href={'/dao/proposals/funding/' + proposalEvent.contractId} >Fund this proposal</a>
      {:else}  
        <Tabs style="underline" contentClass="py-4">
          {#if proposalEvent && !errorReason}
          <TabItem  open={method === 1} on:click={() => goto('/dao/voting/' + proposalEvent.contractId + '?method=1')} title="Solo Stackers">
            <SoloStackers />
          </TabItem>
          <TabItem open={method === 2} on:click={() => goto('/dao/voting/' + proposalEvent.contractId + '?method=2')} title="Pool Stackers">
            <PoolStackers />
          </TabItem>
          <TabItem open={method === 3} on:click={() => goto('/dao/voting/' + proposalEvent.contractId + '?method=3')} title="Liquid STX">
            <DaoVoters {proposalEvent} {balanceAtHeight} />
          </TabItem>
          {:else}
          <TabItem open={true} title="Fetching data">
            <div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
              <Skeleton size="md" />
            </div>
          </TabItem>
          {/if}

        </Tabs>
        {/if}
    </div>
  </div>
</div>

{/if}
