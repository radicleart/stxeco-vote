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
	import { isExecutiveTeamMember } from '$lib/sbtc_admin';
        
    const account = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];
    
    let showRulesModal:boolean;
    const closeModal = () => {
      showRulesModal = false;
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
        <div class="source-modal"><DaoRules /></div>
        <div slot="title">
            <h3>DAO Rules</h3>
        </div>
    </Modal>
<div class="py-6 mx-auto max-w-4xl md:px-6 ">
  <div class="flex flex-col w-full my-8 max-w-4xl">
    <div class="flex flex-col gap-y-4 w-full border-[0.5px] border-gray-700 rounded-lg p-6 sm:p-10 overflow-hidden bg-gray-1000">
      <h1 class="text-4xl font-semibold"><span class="strokeme-white">Make</span> a Proposal</h1>
      <p class="strapline">Choose the type of proposal</p>
      <div>
        <p class="strapline">1) <span class="text-warning-500">Simple proposals</span> 
          are advisory - the proposal text is in the Clarity contract.</p>
        <p class="strapline">2) <span class="text-warning-500">Actionable proposals</span>  are contractual - they are expressed by the code
          undertake some action automatically if the vote carries. For example,
          actionable proposals can upgrade the protocol, make payments or trigger 
          other workflows.
        </p>
      </div>
        {#if showNoop}
          <div class="row mx-0">
            <div class="col-md-6 col-sm-12">
                <pre class="source-code">{newSource}</pre>
            </div>
            <div class="col-md-6 col-sm-12">
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
                  <button class="btn rounded btn-warning" on:click|preventDefault={() => { deployContract() }}>Deploy Proposal</button>
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
        <div class="row mx-0">
          <div class="col-12">
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
  <div class="">
    {#if txId}
      <div>
        <a href={explorerUrl} target="_blank">View on explorer</a>
      </div>
    {:else}
      <div class="text-center mt-5">
        {#if newSourceValid}
        <p>Contract ready to be deployed - once its fully deployed crowd fund support for this proposal</p>
        <button class="btn rounded btn-warning" on:click|preventDefault={() => { deployContract() }}>Deploy Proposal</button>
        {:else}
        <p class="bg-danger p-3">Contract is not ready to be deployed - please check the contract implements the trait correctly - using the full address given above.</p>
        <button disabled class="btn rounded text-danger">Proposal Trait Invalid</button>
        {/if}
      </div>
    {/if}
  </div>
