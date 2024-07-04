<script lang="ts">
  import Modal from '$lib/ui/Modal.svelte';
  import ClaritySytaxHighlighter from '$lib/ui/ClaritySytaxHighlighter.svelte';
  import ExtensionGridItem from '$lib/components/dao-launcher/extensions/ExtensionGridItem.svelte'
	import type { DaoEventEnableExtension } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { onMount } from 'svelte';
	import { getExtensions, readBaseDaoEvents, readVotingContractEvents } from '$lib/dao_api';
	import { isCoordinator } from '$lib/proposals';
	import { sessionStore } from '$stores/stores';
	import CoreExecute from '$lib/components/dao-launcher/CoreExecute.svelte';
    
  const daoBaseContracts = getConfig().VITE_DAO_BASE_CONTRACTS.split(',') || [];
  let thisBaseDao:string;
  let extensions:Array<DaoEventEnableExtension> = [];
  let operation = 0
  let item:any;
  let sourceCode:string;
  let showModal = false
  
  const openSourceModal = (evt:any) => {
    item = evt.detail;
    sourceCode = item.contract?.source;
  }

  const extensionChecker = (evt:any) => {
    item = evt.detail;
  }

  const readEvents = async () => {
    await readBaseDaoEvents(`${getConfig().VITE_DOA_DEPLOYER}.${thisBaseDao}`);
    extensions = await getExtensions(`${getConfig().VITE_DOA_DEPLOYER}.${thisBaseDao}`)
    operation = 0
  }
  const processProposals = async () => {
    const processResult = await readVotingContractEvents(undefined)
    operation = 0
  }

	onMount(async () => {
    try {
      extensions = await getExtensions(`${getConfig().VITE_DOA_DEPLOYER}.${thisBaseDao}`)
    } catch (err) {
    }
  })
</script>
      
    <svelte:head>
        <title>Base DAO</title>
        <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
    </svelte:head>
      
    <Modal {showModal} on:click={() => showModal = !showModal}>
        <div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
        <div slot="title">
            <h3>Extension: {item.contractId.split('.')[1]}</h3>
        </div>
    </Modal>
    
    <div class="py-6 mx-auto max-w-7xl md:px-6">
      <div class="flex flex-col w-full my-8">
        <div class="flex flex-col gap-y-4 w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden ">
          <h1 class=" text-2xl">DAO Extensions</h1>
          <p class="strapline">The toolkit of the DAO. The active extensions are the mechanics of the DAO. 
            They define how the internals work, governing everything from proposal submission to voting to governance
            to treasury management. We name the extension contracts according to the convention EDEXXX where EDE 
            stands for Ecosystem DAO Extension and XXX is the extension number 
            
          </p>
          {#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
          <ul>
            <li>process <a href="/" on:click|preventDefault={() => {readEvents()}}>extension</a> / <a href="/" on:click|preventDefault={() => {processProposals()}}>proposal</a> events</li>
            <li><a href="/" on:click|preventDefault={() => {operation = 1}}>core team run</a></li>
            <li><a href="/dao/proposals/propose">make proposals</a></li>
          </ul>
          {/if}

  
          {#if operation === 0}

            <div class="flex flex-col w-full text-base font-extralight mb-5">
              <label for="period">Select base dao</label>
              <select class="text-black h-10 w-full px-3 border rounded-lg" bind:value={thisBaseDao}>
                {#each daoBaseContracts as baseDao}
                  <option value={baseDao} selected={baseDao === thisBaseDao}>{baseDao}</option>
                {/each}
              </select>
            </div>
            {#each extensions as extension}
              <div class="w-full grid grid-cols-6 justify-stretch"><ExtensionGridItem {extension} on:openExtensionChecker={extensionChecker} on:openSourceModal={openSourceModal}/></div>
            {/each}

            {:else if operation === 1}
              <CoreExecute />
            {/if}

        </div>
        </div>
      </div>


      