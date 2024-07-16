<script lang="ts">
  import Modal from '$lib/ui/Modal.svelte';
  import ClaritySytaxHighlighter from '$lib/ui/ClaritySytaxHighlighter.svelte';
  import ExtensionGridItem from '$lib/components/dao-launcher/extensions/ExtensionGridItem.svelte'
	import type { DaoEventEnableExtension, VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { onMount } from 'svelte';
	import { getExtensions, readBaseDaoEvents } from '$lib/dao_api';
	import { getAllProposals, isCoordinator } from '$lib/proposals';
	import { sessionStore } from '$stores/stores';
	import CoreExecute from '$lib/components/dao-launcher/CoreExecute.svelte';
	import Banner from '$lib/ui/Banner.svelte';
	import { readVotingContractEvents } from '$lib/voting-non-stacker';
	import ProposalGridItem from '$lib/components/dao-launcher/extensions/ProposalGridItem.svelte';
	import BlockHeightConvertor from '$lib/components/dao-launcher/tools/BlockHeightConvertor.svelte';
	import { readStackerEvents } from '$lib/voting-stacker';
    
  const daoBaseContracts = getConfig().VITE_DAO_BASE_CONTRACTS.split(',') || [];
  let thisBaseDao = 'bitcoin-dao';
  let extensions:Array<DaoEventEnableExtension> = [];
  let proposals:Array<VotingEventProposeProposal> = [];
  let operation = 0
  let item:any;
  let sourceCode:string;
  let showModal = false
  let message:string|undefined
  
  const openSourceModal = (evt:any) => {
    item = evt.detail;
    sourceCode = item.contract?.source;
  }
  const syncStackerVotes = async (evt:any) => {
    const proposal = evt.detail.proposal;
    readStackerEvents(proposal)
    message = 'Reading voting events for contract: ' + proposal
  }

  const syncDaoVotes = async (evt:any) => {
    const votingContract = evt.detail.extension
    if (!votingContract) return
    readVotingContractEvents(true, thisBaseDao, votingContract);
    message = 'Reading voting events for contract: ' + votingContract
  }

  const readDaoEvents = async () => {
    await readBaseDaoEvents(`${getConfig().VITE_DOA_DEPLOYER}.${thisBaseDao}`);
    extensions = await getExtensions(`${getConfig().VITE_DOA_DEPLOYER}.${thisBaseDao}`)
    operation = 0
  }
  const updateExtensions = async (e?:any) => {
    extensions = await getExtensions(`${getConfig().VITE_DOA_DEPLOYER}.${thisBaseDao}`)
  }

	onMount(async () => {
    try {
      await updateExtensions();
      proposals = await getAllProposals()
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
            to treasury management. We name the extension contracts according to the convention BDEXXX where BDE 
            stands for Bitcoin DAO Extension and XXX is the extension number 
            
          </p>
          {#if isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress)}
          <ul>
            <li><a href="/" on:click|preventDefault={() => {readDaoEvents()}}>read dao events</a></li>
            <li><a href="/" on:click|preventDefault={() => {operation = 1}}>core team execute</a></li>
            <li><a href="/" on:click|preventDefault={() => {operation = 2}}>show proposals</a></li>
            <li><a href="/" on:click|preventDefault={() => {operation = 3}}>block height tool</a></li>
            <li><a href="/dao/proposals/propose">make proposals</a></li>
          </ul>
          {/if}

          {#if message}<div class="my-5"><Banner bannerType={'warning'} message={message}/></div>{/if}
  

            <div class="flex flex-col w-full text-base font-extralight mb-5">
              <label for="period">Select base dao</label>
              <select class="text-black h-10 w-full px-3 border rounded-lg" bind:value={thisBaseDao} on:change={(e) => updateExtensions(e)}>
                {#each daoBaseContracts as baseDao}
                <option value={baseDao} selected={baseDao === thisBaseDao}>{baseDao}</option>
                {/each}
              </select>
            </div>
            {#if operation === 0}
            <div class="w-full justify-stretch border-b border-dashed">
              Extensions for {thisBaseDao}
            </div>
            {#each extensions as extension}
              <div class="w-full grid grid-cols-6 justify-stretch"><ExtensionGridItem {extension} on:openExtensionChecker={syncDaoVotes} on:openSourceModal={openSourceModal}/></div>
            {/each}

            {:else if operation === 1}
            <CoreExecute />

            {:else if operation === 2}
            <div class="w-full justify-stretch border-b border-dashed">
              Proposals for {thisBaseDao}
            </div>
            {#each proposals as proposal}
              <div class="w-full grid grid-cols-6 justify-stretch"><ProposalGridItem {proposal} on:syncStacker={syncStackerVotes} on:syncDao={syncDaoVotes} /></div>
            {/each}

            {:else if operation === 3}
            <BlockHeightConvertor />

            {/if}

          </div>
        </div>
      </div>


      