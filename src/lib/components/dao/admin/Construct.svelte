<script lang="ts">
	import { CONFIG } from '$lib/config';
	import { getConfig } from '$stores/store_helpers';
	import { sessionStore } from '$stores/stores';
	import { daoStore } from '$stores/stores_dao';
	import { getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
	import type { ExtensionType } from '@mijoco/stx_helpers/dist/index';
	import { openContractCall } from '@stacks/connect';
	import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';

    let txId: string;

    const constructDao = async () => {
      const deployer = CONFIG.VITE_DOA_DEPLOYER;
      const bootstrap = contractPrincipalCV(deployer, 'bdp000-bootstrap')
      // const bootstrap = contractPrincipalCV(deployer, 'edp010-set-phase1-extensions')
      await openContractCall({
        network: getStacksNetwork(getConfig().VITE_NETWORK),
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: CONFIG.VITE_DOA,
        functionName: 'construct',
        functionArgs: [bootstrap],
        onFinish: data => {
          txId = data.txId
          console.log('finished contract call!', data);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });

    }

    $: constructed = $daoStore.extensions?.filter((o:ExtensionType) => o.valid).length > 0 || false;
    $: explorerUrl = CONFIG.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + CONFIG.VITE_NETWORK;
    </script>

    <svelte:head>
        <title>Ecosystem DAO</title>
        <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
    </svelte:head>

    <section>
      <div class="row">
        <h1 class="text-info">Welcome to <span class="strokeme-info">Ecosystem DAO</span></h1>
      </div>
    </section>
    <section>
      {#if !constructed}
      <div class="container my-5">
        <button on:click={() => constructDao()} class="md:w-auto md:inline-flex items-center gap-x-1.5 bg-danger-01 px-4 py-2 rounded-xl border border-danger-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 shrink-0">
            Bootstrap DAO
        </button>
      </div>
      {/if}
      {#if txId}
      <div>
        <a href={explorerUrl} target="_blank">View on explorer</a>
      </div>
      {/if}
    </section>

    <style>
    </style>
