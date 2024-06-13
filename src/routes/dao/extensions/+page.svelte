<script lang="ts">
    import Modal from '$lib/ui/Modal.svelte';
    import ClaritySytaxHighlighter from '$lib/ui/ClaritySytaxHighlighter.svelte';
    import DaoUtils from '$lib/service/DaoUtils';
    import { ArrowDownCircle, ArrowUpCircle, Icon } from 'svelte-hero-icons';
    import ExtensionGridItem from '$lib/components/dao/extensions/ExtensionGridItem.svelte'
	  import { CONFIG } from '$lib/config';
	import ExtensionChecker from '$lib/components/dao/ExtensionChecker.svelte';
	import type { ExtensionType } from '@mijoco/stxeco_types';
    
    let item:ExtensionType;
    let componentKey = 0;
    let currentExtension:string|undefined;
    let sourceCode: string|undefined = '';
    let showModal:boolean;
    const toggleModal = () => {
      showModal = !showModal
    }
    
    const openSourceModal = (evt:any) => {
      item = evt.detail;
      sourceCode = item.contract?.source;
      toggleModal();
    }
    const extensionChecker = (evt:any) => {
      item = evt.detail;
      currentExtension = item.contractId;
      componentKey++;
    }
    let sortDir = true;
    let sortField = 'title';
    const reorder = (sf:string) => {
        sortField = sf;
        sortDir = !sortDir;
        componentKey++;
    }
    const extensions:Array<ExtensionType> = [];
    CONFIG.VITE_EXTENSIONS.forEach((key) => {
        extensions.push({contractId: CONFIG.VITE_DOA_DEPLOYER + '.' + key, valid: true})
    })

    $: sortedProps = DaoUtils.sortExtensions(extensions, sortDir, sortField);
    </script>
      
    <svelte:head>
        <title>Ecosystem DAO</title>
        <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
    </svelte:head>
      
    <Modal {showModal} on:click={toggleModal}>
        <div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
        <div slot="title">
            <h3>Extension: {item.contractId.split('.')[1]}</h3>
        </div>
    </Modal>
    
    <div class="py-6 mx-auto max-w-7xl md:px-6">
      <div class="flex flex-col w-full my-8">
        <div class="flex flex-col gap-y-4 w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
          <h1 class=" text-2xl">DAO Extensions</h1>
          <p class="strapline">The toolkit of the DAO. The active extensions are the mechanics of the DAO. 
            They define how the internals work, governing everything from proposal submission to voting to governance
            to treasury management. We name the extension contracts according to the convention EDEXXX where EDE 
            stands for Ecosystem DAO Extension and XXX is the extension number.
          </p>
          <div class="w-full grid grid-cols-2 justify-evenly">
            <a href="/" class="inline filter pointer m-2" on:click|preventDefault={() => reorder('title')}>{#if sortDir}<Icon src="{ArrowDownCircle}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />{:else}<Icon src="{ArrowUpCircle}" mini class="h-5 w-5 text-white" aria-hidden="true" />{/if} Title</a>
            <a href="/" class="inline filter pointer m-2" on:click|preventDefault={() => reorder('status')}>{#if sortDir}<Icon src="{ArrowDownCircle}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />{:else}<Icon src="{ArrowUpCircle}" mini class="h-5 w-5 text-white" aria-hidden="true" />{/if} Status</a>
          </div>
          {#key componentKey}
          <div class="my-10"><ExtensionChecker extension={currentExtension}/></div>
          {/key}
            {#each sortedProps as item}
              <div class="w-full grid grid-cols-2 justify-evenly"><ExtensionGridItem extension={item} on:openExtensionChecker={extensionChecker} on:openSourceModal={openSourceModal}/></div>
            {/each}
          </div>
        </div>
      </div>
      