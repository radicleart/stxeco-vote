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
    let contractId:string|undefined;
    let processResult:any;

    let showRulesModal:boolean;
    const closeModal = () => {
      showRulesModal = false;
    }
    
    const processProposal = async () => {
      if (!contractId) return;
      processResult = await processProposalContracts(contractId)
      processResult = await setCurrentProposal(contractId)
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
      <title>Ecosystem DAO - Nakamoto SIP Voting</title>
      <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
    </svelte:head>
    
    <div class="px-6 md:px-0 -mx-6 my-10 py-12 bg-white/[0.1] shadow-[0px_1px_1px_0px_rgba(255,255,255,0.25)_inset,_0px_-1px_1px_0px_rgba(255,255,255,0.25)_inset] backdrop-blur-xl">
      <div class="py-6 mx-auto max-w-7xl md:px-6">
        <p class="text-4xl font-medium leading-[46px] sm:max-w-4xl" style="text-shadow: 1px 1px 20px rgba(8, 0, 102, 0.50)">STX ECO is the all-in-one voting platform where the Stacks community can weigh in on major protocol changes</p>
      </div>
    </div>
    <div class="py-6 mx-auto max-w-7xl md:px-6">
      <div class="flex flex-col w-full my-8">
        <div>
          <div class="space-y-6">
            <div>
              <span class="inline-block py-1 text-sm px-5 rounded-full bg-purple-fade border border-purple-500">Current proposal</span>
              <h1 class="text-2xl sm:text-4xl font-bold -mx-4 mt-6"><a href="/" on:click|preventDefault={() => {}} class="hover:bg-white/10 py-2 px-4 rounded-md">SIP-021 - Nakamoto Release <svg class="inline" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.8958 27.6042L37.5 25C40.9518 21.5482 40.9518 15.9518 37.5 12.5C34.0482 9.04822 28.4518 9.04822 25 12.5L22.3958 15.1042" stroke="white" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.1042 22.3958L12.5 25C9.04822 28.4518 9.04822 34.0482 12.5 37.5C15.9518 40.9518 21.5482 40.9518 25 37.5L27.6042 34.8958" stroke="white" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M29.6875 20.3125L20.3125 29.6875" stroke="white" stroke-width="3.125" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Voting starts soon !
                </a>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    