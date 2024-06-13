<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton, Tabs, TabItem } from 'flowbite-svelte';
  import { COMMS_ERROR } from '$lib/utils.js'
  import { sessionStore } from '$stores/stores';
	import ProposalFundingHeader from '$lib/components/dao/proposals/rows/ProposalFundingHeader.svelte';
	import ProposalVotingHeader from '$lib/components/dao/proposals/rows/ProposalVotingHeader.svelte';
	import ProposalFundingRow from '$lib/components/dao/proposals/rows/ProposalFundingRow.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ProposalClosedRow from '$lib/components/dao/proposals/rows/ProposalClosedRow.svelte';
	import ProposalActiveRow from '$lib/components/dao/proposals/rows/ProposalActiveRow.svelte';
	import DaoUtils from '$lib/service/DaoUtils';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import { daoStore } from '$stores/stores_dao';
	import { ProposalStage, type ProposalEvent } from '@mijoco/stxeco_types';

  // fetch/hydrate data from local storage
  let inited = false;
  let errorReason:string|undefined;
  let funding:Array<ProposalEvent>|undefined;
  let open:Array<ProposalEvent>|undefined;
  let closed:Array<ProposalEvent>|undefined;
  let tabStatus = 'funding'
  onMount(async () => {
    try {
      for (const prop of $daoStore.proposals!) {
        const stacksTipHeight = $sessionStore.stacksInfo?.stacks_tip_height | 0;
			  const burnHeight = $sessionStore.stacksInfo?.burn_block_height | 0;
			  DaoUtils.setStatus(3, burnHeight, stacksTipHeight, prop);
      }
      funding = $daoStore.proposals?.filter((o:any) => o.stage === ProposalStage.PARTIAL_FUNDING || o.stage === ProposalStage.UNFUNDED)
      open = $daoStore.proposals?.filter((o) => o.stage === ProposalStage.PROPOSED || o.stage === ProposalStage.ACTIVE)
      closed = $daoStore.proposals?.filter((o) => o.stage === ProposalStage.INACTIVE || o.stage === ProposalStage.CONCLUDED)
      if ($page.url.searchParams.has('status')) tabStatus = $page.url.searchParams.get('status') || 'funding'
      inited = true;
    } catch (err) {
      errorReason = COMMS_ERROR;
    }
  })
</script>

<svelte:head>
  <title>Transactions</title>
  <meta name="description" content="A detailed table of all the transactions." />
</svelte:head>
<div class="py-6 mx-auto max-w-7xl md:px-6">
  <div>
    <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
      <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

        <div class="flex flex-col gap-y-2">
          <div class="mb-4">
            <h2 class="text-[#131416] text-2xl mb-3">Proposals</h2>
          </div>
          <Tabs style="underline" contentClass="py-4">
            <TabItem open={tabStatus === 'funding'} on:click={() => goto('/dao/proposals?status=funding')} title="Funding">
              {#if inited}
              <div class="bg-white/5 rounded-md p-4">
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
              <div class="bg-white/5 rounded-md p-4">
                {#if open && open.length > 0}
                <ProposalVotingHeader/>
                {#each open as event}
                <ProposalActiveRow {event} />
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
              <div class="bg-white/5 rounded-md p-4">
                {#if closed && closed.length > 0}
                <ProposalVotingHeader/>
                {#each closed as event}
                <ProposalClosedRow {event} />
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

				<NakamotoBackground />
				<NakamotoShield />
      </div>
    </div>
  </div>
</div>
