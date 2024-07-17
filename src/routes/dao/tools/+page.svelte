<script lang="ts">
	import { getPoxInfo, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { onMount, tick } from 'svelte';
	import { getAllProposals, isCoordinator } from '$lib/proposals';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import Banner from '$lib/ui/Banner.svelte';
	import BlockHeightConvertor from '$lib/components/dao-launcher/tools/BlockHeightConvertor.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import RewardCycleConvertor from '$lib/components/dao-launcher/tools/RewardCycleConvertor.svelte';
	import EpochsAndVersions from '$lib/components/dao-launcher/tools/EpochsAndVersions.svelte';
	import type { PoxInfo } from '@mijoco/stx_helpers/dist/pox_types';
    
  let proposals:Array<VotingEventProposeProposal> = [];
  let method = 1
  let poxInfo:PoxInfo
  let cycle = 0;
  
  const changeMethod = async (e:any, newMethod:number) => {
    	e.preventDefault();
		method = newMethod
		$page.url.searchParams.set('tool', '' + method)

    //const url = new URL($page.url);
    // Set the new query parameter
    //url.searchParams.set('tool', method + '');
    history.pushState({}, '', $page.url);

		//goto(`?${$page.url.searchParams.toString()}`);
		const getMeTo = document.getElementById("tabs-header");
		await tick();
  		if (getMeTo) getMeTo.scrollTo({behavior: 'smooth'});
		return false;
	}

	onMount(async () => {
    if ($page.url.searchParams.has('tool')) method = Number($page.url.searchParams.get('tool'))
    if ($page.url.searchParams.has('cycle')) cycle = Number($page.url.searchParams.get('cycle'))
    proposals = await getAllProposals()
    poxInfo = await getPoxInfo(getConfig().VITE_STACKS_API)
  })
</script>
      
    <svelte:head>
        <title>Base DAO Tools</title>
        <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
    </svelte:head>
      
  <div class="py-6 mx-auto max-w-7xl md:px-6">
    <div class="flex flex-col w-full ">
      <div class="flex flex-col gap-y-4 w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden ">
        <h1 class=" text-2xl">DAO Tools</h1>
        <p class="strapline">The toolkit of the DAO. The active extensions are the mechanics of the DAO. 
          Tools for reading pox information, converting block heights to dates etc. 
        </p>
        <Tabs  style="underline" contentClass="mb-0 pb-0 border-b-none">

          <TabItem class="bg-lightgray relative top-[15px] text-black rounded-t-lg border-t border-r border-l border-b-none "
              open={method === 1} on:click={(e) => changeMethod(e, 1)} title="block height tool" >
            <div class="bg-lightgray py-4 px-4 relative top-[-10px]">
              <BlockHeightConvertor />
            </div>
          </TabItem>
          {#if poxInfo}
          <TabItem class="bg-lightgray relative top-[15px] text-black rounded-t-lg border-t border-r border-l border-b-none "
              open={method === 2} on:click={(e) => changeMethod(e, 2)} title="reward cycles" >
            <div class="bg-lightgray py-4 px-4 relative top-[-10px]">
              <RewardCycleConvertor {poxInfo} {cycle}/>
            </div>
          </TabItem>
      
          <TabItem class="bg-lightgray relative top-[15px] text-black rounded-t-lg border-t border-r border-l border-b-none "
            open={method === 3} on:click={(e) => changeMethod(e, 3)} title="epochs" >
            <div class="bg-lightgray py-4 px-4 relative top-[-10px]">
              <EpochsAndVersions {poxInfo} />
            </div>
        </TabItem>
        {/if}
      </Tabs>

</div>
    </div>
  </div>


      