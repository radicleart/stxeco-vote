<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton, Tabs, TabItem } from 'flowbite-svelte';
  import { COMMS_ERROR } from '$lib/utils.js'
  import { sbtcConfig } from '$stores/stores';
	import ProposalRow from '$lib/components/dao/proposals/rows/ProposalRow.svelte';
	import { ProposalStage, type ProposalEvent } from '$types/stxeco.type';
	import ProposalFundingHeader from '$lib/components/dao/proposals/rows/ProposalFundingHeader.svelte';
	import ProposalVotingHeader from '$lib/components/dao/proposals/rows/ProposalVotingHeader.svelte';
	import ProposalFundingRow from '$lib/components/dao/proposals/rows/ProposalFundingRow.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

  // fetch/hydrate data from local storage
  let inited = false;
  let errorReason:string|undefined;
  let showAll:boolean = true;
  let funding:Array<ProposalEvent>|undefined;
  let open:Array<ProposalEvent>|undefined;
  let closed:Array<ProposalEvent>|undefined;
  let tabStatus = 'funding'
  onMount(async () => {
    try {
      funding = $sbtcConfig.proposals?.filter((o) => o.stage !== ProposalStage.PROPOSED)
      open = $sbtcConfig.proposals?.filter((o) => o.stage === ProposalStage.PROPOSED && !o.proposalData.concluded)
      closed = $sbtcConfig.proposals?.filter((o) => o.stage === ProposalStage.PROPOSED && o.proposalData.concluded)
      if ($page.url.searchParams.has('status')) tabStatus = $page.url.searchParams.get('status') || 'funding'
      inited = true;
    } catch (err) {
      errorReason = COMMS_ERROR;
    }
  })
</script>

<svelte:head>
  <title>sBTC Bridge - Transactions</title>
  <meta name="description" content="A detailed table of all the transactions going through the sBTC Bridge." />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
  <div class="flex flex-col w-full my-8">
    <div class="flex flex-col w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
      <div class="text-4xl font-medium">Proposals</div>
        <Tabs style="underline" contentClass="py-4">
          <TabItem open={tabStatus === 'funding'} on:click={() => goto('/dao/proposals?status=funding')} title="Funding">
            {#if inited}
            <div class="bg-white/5 rounded-md p-4 border border-gray-900">
              {#if funding && funding.length > 0}
              <ProposalFundingHeader/>
              {#each funding as event}
              <ProposalFundingRow {event} />
              {/each}
              {:else}
              None
              {/if}
            </div>
            {:else}
            <Skeleton size="md" />
            {/if}
          </TabItem>
          <TabItem open={tabStatus === 'open'} on:click={() => goto('/dao/proposals?status=open')} title="Open">
            {#if inited}
            <div class="bg-white/5 rounded-md p-4 border border-gray-900">
              {#if open && open.length > 0}
              <ProposalVotingHeader/>
              {#each open as event}
              <ProposalRow {event} />
              {/each}
              {:else}
              None
              {/if}
            </div>
            {:else}
            <Skeleton size="md" />
            {/if}
          </TabItem>
          <TabItem open={tabStatus === 'closed'} on:click={() => goto('/dao/proposals?status=closed')} title="Closed">
            {#if inited}
            <div class="bg-white/5 rounded-md p-4 border border-gray-900">
              {#if closed && closed.length > 0}
              <ProposalVotingHeader/>
              {#each closed as event}
              <ProposalRow {event} />
              {/each}
              {:else}
              None
              {/if}
            </div>
            {:else}
            <Skeleton size="md" />
            {/if}
          </TabItem>
        </Tabs>
    </div>
  </div>
</div>

