<script lang="ts">
  import ProposalDeploymentForm from '$lib/components/dao/deployment/ProposalDeploymentForm.svelte';
	import { sessionStore } from '$stores/stores';
	import { openContractDeploy } from '@stacks/connect';
	import { processProposalContracts, setCurrentProposal } from '$lib/admin';
	import Banner from '$lib/ui/Banner.svelte';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import { daoStore } from '$stores/stores_dao';
	import type { InFlight, ProposalEvent } from '@mijoco/stx_helpers/dist/index';
	import type { DaoStore, SessionStore } from '$types/local_types';
	import { getConfig } from '$stores/store_helpers';

    const account = $sessionStore.keySets[getConfig().VITE_NETWORK];
    let contractId = $daoStore.currentProposal?.contractId || undefined;
    let processResult:any;

    let showRulesModal:boolean;

    const processProposal = async () => {
      if (!contractId) return;
      processResult = await processProposalContracts(contractId)
      processResult = await setCurrentProposal(contractId)
      showRulesModal = true
    }

    let canSubmit = true; //$settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance')?.value?.value || false;
    if (!canSubmit) {
      canSubmit = account.stxAddress === getConfig().VITE_DOA_DEPLOYER;
    }
    let showNoop = false;
    let showFromFile = true;
    const contractSource = `
    ;; DAO: Ecosystem DAO
    ;; Title: <title>
    ;; Author: <author>
    ;; Synopsis: <synopsis>
    ;; Description: <description>

    (impl-trait '${getConfig().VITE_DOA_DEPLOYER}.proposal-trait.proposal-trait)

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
          daoStore.update((conf:DaoStore) => {
            if (!conf.daoData) conf.daoData = {} as InFlight;
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
    $: newSourceValid = replacedSource.indexOf(getConfig().VITE_DOA_DEPLOYER + '.proposal-trait.proposal-trait') > -1 || account.stxAddress === getConfig().VITE_DOA_DEPLOYER;
    $: explorerUrl = getConfig().VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + getConfig().VITE_NETWORK;
    </script>

<svelte:head>
    <title>Ecosystem DAO</title>
    <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
    <div>
      <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
        <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

          <div class="flex flex-col gap-y-5">
            <div class="flex flex-col gap-y-2">
              <h4 class="text-2xl mb-3">Process Proposal</h4>
              <p>Enter deployed contract id</p>
              <input type="text" id="propose-contract" class="p-3 rounded-md border text-black" bind:value={contractId}/>
              <button on:click={() => {processProposal()}} class="w-[150px] text-white bg-black justify-startc items-start gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-success-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
                Process
              </button>
            </div>

            {#if showNoop}
            <div class="flex flex-col">
              <div>
                  <pre class="source-code">{newSource}</pre>
              </div>
              <div>
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
              <div>
                {#if showRulesModal}
                <div>
                  <Banner message={'Processing this proposal and adding to DAO'}/>
                </div>
                {/if}
                {#if txId}
                <div>
                  <a href={explorerUrl} target="_blank">View on explorer</a>
                </div>
                {/if}
              </div>
            </div>

            <NakamotoBackground />
            <NakamotoShield />
              </div>
      </div>
    </div>
</div>
