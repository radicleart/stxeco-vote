<script lang="ts">
  import ProposalDeploymentForm from '$lib/components/dao/deployment/ProposalDeploymentForm.svelte';
  import LoadFile from '$lib/components/dao/deployment/LoadFile.svelte';
  import Modal from '$lib/shared/Modal.svelte';
  import DaoRules from '$lib/components/dao/proposals/DaoRules.svelte';
	import { sbtcConfig } from '$stores/stores';
	import { CONFIG } from '$lib/config';
	import { openContractDeploy } from '@stacks/connect';
	import type { DaoData, ProposalEvent } from '$types/stxeco.type';
	import { explorerAddressUrl } from '$lib/utils';
	import type { SbtcConfig } from '$types/sbtc_config';
	import { processProposalContracts, setCurrentProposal } from '$lib/sbtc_admin';
        
    const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
    let contractId = $sbtcConfig.currentProposal.contractId || undefined;
    let processResult:any;

    let showRulesModal:boolean;
    const closeModal = () => {
      showRulesModal = false;
    }
    
    const processProposal = async () => {
      if (!contractId) return;
      processResult = await processProposalContracts(contractId)
      processResult = await setCurrentProposal(contractId)
      showRulesModal = true
    }
    
    let canSubmit = true; //$settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance')?.value?.value || false;
    if (!canSubmit) {
      canSubmit = account.stxAddress === CONFIG.VITE_DOA_DEPLOYER;
    }
    let showNoop = false;
    let showFromFile = true;
    const contractSource = `
    ;; DAO: Ecosystem DAO
    ;; Title: <title>
    ;; Author: <author>
    ;; Synopsis: <synopsis>
    ;; Description: <description>
    
    (impl-trait '${CONFIG.VITE_DOA_DEPLOYER}.proposal-trait.proposal-trait)
    
    (define-public (execute (sender principal))
            (ok true)
    )
    `
    let newProposal:ProposalEvent;
    let showDeployButton = false;
    let updated = false;
    let replacedSource = contractSource;
    let contractName = '';
    const addNewPoll = (e: { detail:  { contractName: string; title: string; author: string; synopsis: string; description: string; }; }) => {
      contractName = e.detail.contractName;
      newProposal = {
        proposalMeta: {title: e.detail.title, author: '', dao: 'Ecosystem', description: '', synopsis: '' },
        proposer: account.stxAddress,
        funding: { funding: 0, parameters: { fundingCost: 0, proposalDuration: 0, proposalStartDelay: 0}},
        status: { name: 'deploying', color: '', colorCode: '' },
        contractId: account.stxAddress + '.' + contractName,
        contract: {
          source: replacedSource,
          publish_height: 0
        }
      } as ProposalEvent
      replacedSource = contractSource.replace('<title>', e.detail.title);
      replacedSource = replacedSource.replace('<author>', e.detail.author);
      replacedSource = replacedSource.replace('<synopsis>', e.detail.synopsis);
      replacedSource = replacedSource.replace('<description>', e.detail.description);
        showDeployButton = true;
        updated = true;
    }
    
    const fileLoaded = (e: { detail: { contractName: string; source: string; }; }) => {
      replacedSource = e.detail.source;
      contractName = e.detail.contractName;
      showDeployButton = true;
      newProposal = {
        proposalMeta: {title: contractName, author: '', dao: 'Ecosystem', description: '', synopsis: '' },
        proposer: account.stxAddress,
        funding: { funding: 0, parameters: { fundingCost: 0, proposalDuration: 0, proposalStartDelay: 0}},
        status: { name: 'deploying', color: '', colorCode: '' },
        contractId: account.stxAddress + '.' + contractName,
        contract: {
          source: replacedSource,
          publish_height: 0
        }
      } as ProposalEvent
    }
    
    let txId: string;
    const deployContract = async () => {
      await openContractDeploy({
        codeBody: replacedSource,
        contractName: contractName,
        onFinish: data => {
          sbtcConfig.update((conf:SbtcConfig) => {
            if (!conf.daoData) conf.daoData = {} as DaoData;
              conf.daoData.inFlight = {
              name: 'Deploy',
              txid: data.txId
            }
            return conf;
          })
        },
        onCancel: () => {
          console.log('popup closed!');
        },
      });
    }

    $: newSource = replacedSource;
    $: newSourceValid = replacedSource.indexOf(CONFIG.VITE_DOA_DEPLOYER + '.proposal-trait.proposal-trait') > -1 || account.stxAddress === CONFIG.VITE_DOA_DEPLOYER;
    $: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;
    </script>
    
    <svelte:head>
        <title>Ecosystem DAO</title>
        <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
    </svelte:head>
    
    <Modal showModal={showRulesModal} on:click={closeModal}>
        <div class="bg-white opacity-10"></div>
        <div slot="title">
          <div class="bg-white text-gray-800 mx-20 p-20 rounded-lg">
            <p>Processing contract<br/><br/> {contractId}</p>
          </div>
        </div>
    </Modal>
<div class="py-6 mx-auto max-w-4xl md:px-6 ">
  <div class="flex flex-col w-full my-8 max-w-4xl">
    <div class="flex flex-col gap-y-4 w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
      <h1 class="text-4xl font-semibold"><span class="strokeme-white">Make</span> a Proposal</h1>
      <p class="strapline">Two types of proposal:
        <span class="text-warning-500">simple / noop</span> proposals are advisory - the proposal text is in the Clarity contract.
        <span class="text-warning-500">actionable</span> are contractual - they are expressed by the code
        undertake some action automatically if the vote carries. For example,
        actionable proposals can upgrade the protocol, make payments or trigger 
        other workflows.
      </p>

      <div class="flex flex-col gap-y-12">
        <div class="flex flex-col gap-y-2">
          <h4 class="text-2xl mb-3">Process Proposal</h4>
          <p>Enter deployed contract id</p>
          <input type="text" id="propose-contract" class="p-3 rounded-md border text-black" bind:value={contractId}/>
          <button on:click={() => {processProposal()}} class="w-52 justify-center items-center gap-x-1.5 bg-success-01 px-4 py-2 font-normal rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
            Process proposal
          </button>
        </div>

        {#if showNoop}
          <div class="flex flex-col">
            <div class="">
                <pre class="source-code">{newSource}</pre>
            </div>
            <div class="">
              {#if !showDeployButton}
                <ProposalDeploymentForm on:addNewPoll={addNewPoll} />
              {:else if txId}
              <div>
                <a href={explorerUrl} target="_blank">View on explorer</a>
              </div>
              {:else}
              <div class="text-center mt-5">
                {#if newSourceValid}
                  <p>Contract ready to be deployed - once its fully deployed crowd fund support for this proposal</p>
                  <button class="btn rounded btn-warning" on:click|preventDefault={() => { deployContract() }}>Deploy proposal</button>
                {:else}
                  <p class="bg-danger p-3">Contract is not ready to be deployed - please check the contract implements the trait correctly - using the full address given above.</p>
                  <button disabled class="btn rounded text-danger">Proposal Trait Invalid</button>
                {/if}
              </div>
              {/if}
            </div>
          </div>
          {/if}

        {#if showFromFile}
        <div class="">
          <div class="">
            <h4 class="text-2xl mb-3">Upload Contract</h4>
            <p>Please ensure the clarity is unit tested and implements the 
              <a class="text-primary-500" href={explorerAddressUrl(CONFIG.VITE_DOA_DEPLOYER + '.proposal-trait')} target="_blank">correct trait</a>
              {#if !showDeployButton}
                <LoadFile on:fileLoaded={fileLoaded}/>
              {:else}
              <div class="flex flex-col">
                  <div class="col-md-8 col-sm-12">
                    <pre class="source-code">{newSource}</pre>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      </div>
    </div>
  </div>
  <div class="">
    {#if txId}
      <div>
        <a href={explorerUrl} target="_blank">View on explorer</a>
      </div>
    {/if}
  </div>
