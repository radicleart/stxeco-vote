<script lang="ts">
  import Banner from '$lib/ui/Banner.svelte';
	import NakamotoBackground from '$lib/ui/NakamotoBackground.svelte';
	import NakamotoShield from '$lib/ui/NakamotoShield.svelte';
	import { sessionStore } from '$stores/stores';
	import { onMount } from 'svelte';
	import { deployer_roles, launchDao } from './dao_helper';
	import { configStore } from '$stores/stores_config';
	import { type DaoTemplate, type ExtensionType } from '@mijoco/stx_helpers/dist/dao';
	import { getBaseDaoExecutedProposalEvents, getCurrentProposalLink } from '$lib/proposals';
	import { Placeholder } from '@mijoco/stx_components';
	import { getConfig } from '$stores/store_helpers';
	import { contractPrincipalCV, PostConditionMode } from '@stacks/transactions';
	import { getStacksNetwork, lookupContract } from '@mijoco/stx_helpers/dist/index';
	import { openContractCall } from '@stacks/connect';

  let inited = false;
  let constructed = false
  const roles = deployer_roles

  let errorMessage:string = '';
  let result:string|undefined = undefined;
  const account = $sessionStore.keySets[$configStore.VITE_NETWORK]
  $: explorerUrl = `${$configStore.VITE_STACKS_API}/txid/${result}?chain=${$configStore.VITE_NETWORK}`;
  
  const template:DaoTemplate = {
    deployer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    projectName: 'project_' + Math.floor(Math.random() * 1000),
    addresses: [],
    tokenName: undefined,
    tokenSymbol: undefined,
    tokenUrl: undefined,
  }

  const useRegtest = () => {
    template.tokenName = 'Bitcoin DAO Governance Token'
    template.tokenSymbol = 'BDG'
    template.tokenUrl = 'http://localhost:8080/token/bdg'
    template.addresses.push('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
    template.addresses.push('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5')
    template.addresses.push('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')
    template.addresses.push('ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC')
  }

  let txId: string;

  const constructDao = async (addres:string) => {
    const deployer = addres || getConfig().VITE_DOA_DEPLOYER;
    const bootstrap = contractPrincipalCV(deployer, 'bdp000-bootstrap')
    // const bootstrap = contractPrincipalCV(deployer, 'edp010-set-phase1-extensions')
    await openContractCall({
      network: getStacksNetwork(getConfig().VITE_NETWORK),
      postConditions: [],
      postConditionMode: PostConditionMode.Deny,
      contractAddress: deployer,
      contractName: getConfig().VITE_DOA,
      functionName: 'construct',
      functionArgs: [bootstrap],
      onFinish: (data:any) => {
        txId = data.txId
        console.log('finished contract call!', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  }

  const launch = async () => {
    let key: keyof typeof template;
    for (key in template) {
      const value = template[key];
      if (!value || value.length === 0) errorMessage += '<br/>Value is required for ' + key
    }
    const c = await lookupContract(getConfig().VITE_STACKS_API, `${template.deployer}.bitcoin-dao`)
    if (c && c.tx_id) errorMessage = 'Contracts already deployed for this deployer: ' + template.deployer
    if (errorMessage) return
    const result = await launchDao(template)
  }

  onMount(async () => {
    for (let obj of roles) {
      try {
        const c = await lookupContract(getConfig().VITE_STACKS_API, `${obj.stx_address}.bitcoin-dao`) 
        if (c && c.tx_id) {
          obj.deployed = true
          const events = await getBaseDaoExecutedProposalEvents(`${obj.stx_address}.bitcoin-dao`)
          obj.constructed = events && events.length > 0 //await fetchDataVar(getConfig().VITE_STACKS_API, template.deployer, 'bitcoin-dao', 'executive')
        }
      } catch(err:any) {}
    }
    //constructed = await fetchDataVar(getConfig().VITE_DOA_DEPLOYER, 'bitcoin-dao', 'executive')
    //const depl = roles.find((o:any) => o.stx_address === getConfig().VITE_DOA_DEPLOYER)
    //if (depl) depl.constructed = constructed
    inited = true
  })

</script>

<svelte:head>
  <title>Ecosystem DAO</title>
  <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="max-w-7xl md:px-6 py-6 relative mx-auto">
  {#if inited}
    <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
      <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
      <div class="flex flex-col gap-y-2 bg-warning-01">
      <div class="mb-4">
          <h2 class="text-[#131416] text-2xl mb-3">DAO Launcher</h2>
        </div>
        <div class="mb-4 rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
          <div>
            <div class="flex flex-col gap-y-4">
              <div class="flex flex-col">
                <div class="text-xl">
                  Template values
                </div>
                <div class="w-full flex flex-col gap-y-4 justify-start border border-gray-700 rounded-lg my-4 p-3">
                  {#each roles as role}
                  {#if role.deployed}
                  <div class="flex flex-col gap-y-4">
                    <div class="">
                      Contract deployed {#if role.constructed}and constructed{/if}
                    </div>
                    <div class="">
                      {role.stx_address + '.bitcoin-dao'} 
                    </div>
                    {#if !role.constructed}
                    <div>
                      <button on:click={() => {errorMessage = ''; constructDao(role.stx_address)}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
                        START DAO
                      </button>
                    </div>
                    {/if}
                  </div>
                  {/if}
                {/each}
              </div>
  
              </div>
            {#if result}
              <div class="mb-3 max-w-xl">
                <Banner bannerType={'warning'} message={'Your contracts are being deployed. See <a href="'+explorerUrl+'" target="_blank">explorer!</a>' + result} />
              </div>
              {:else}
              <div class="mb-3 max-w-xl">
                <Banner bannerType={'info'} message={'Ensure the addresses are correct for network `' + $configStore.VITE_NETWORK + '`'} />
              </div>

              <div class="bottom-1 pb-5 mb-5 w-full flex flex-col justify-start">
                  <label for="project-name" class="text-blue-800">Project name</label>
                  <input id="project-name" class="rounded-lg p-2 text-black border-gray-800" bind:value={template.projectName} type="text" aria-describedby="projectName"/>
              </div>

              <div class="w-full flex flex-col justify-start mb-5 text-blue-800">
                <label for="deployer">Deployer <span class="text-sm">(devnet wallet that will deploy and construct your dao)</span></label>
                <select class="text-black h-10 w-full px-3 border rounded-lg" bind:value={template.deployer}>
                  {#each deployer_roles as deployer}
                    <option value={deployer.stx_address}>{deployer.stx_address}</option>
                  {/each}
                </select>
              </div>


              <div class="flex justify-between text-blue-800">
                <div class="text-xl">
                  
                </div>
                <div class="text-sm">
                  <a href="/" on:click|preventDefault={() => useRegtest()}>use regtest values</a>
                </div>
              </div>

              {#each Array(4) as _, i}
              <div class="w-full flex flex-col justify-start">
                <label for={'ct-' + i}>Core team member {i + 1}</label>
                <input id={'ct-' + i} class="rounded-lg p-2 text-black border-gray-800" bind:value={template.addresses[i]} type="text" aria-describedby={template.addresses[i]}/>
              </div>
              {/each}

              <div class="w-full flex flex-col justify-start">
                <label for="token-name">Token name</label>
                <input id="token-name" class="rounded-lg p-2 text-black border-gray-800" bind:value={template.tokenName} type="text" aria-describedby="tokenName"/>
              </div>
              <div class="w-full flex flex-col justify-start">
                <label for="token-symbol">Token symbol</label>
                <input id="token-symbol" class="rounded-lg p-2 text-black border-gray-800" bind:value={template.tokenSymbol} type="text" aria-describedby="tokenSymbol"/>
              </div>
              <div class="w-full flex flex-col justify-start">
                <label for="token-url">Token url</label>
                <input id="token-url" class="rounded-lg p-2 text-black border-gray-800" bind:value={template.tokenUrl} type="text" aria-describedby="tokenUrl"/>
              </div>
              <div class="w-full flex justify-start gap-x-4">
                <button on:click={() => {errorMessage = ''; launch()}} class="justify-center w-[150px] md:inline-flex items-center gap-x-1.5 bg-success-01 px-4 py-2 rounded-xl border border-black bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
                  LAUNCH DAO
                </button>
              </div>
              {#if errorMessage}
              <div class="w-full flex justify-start gap-x-4">
                {@html errorMessage}
              </div>
              {/if}
              {/if}
            </div>
          </div>
                  </div>

      </div>
      <NakamotoBackground />
      <NakamotoShield />
  </div>
  </div>
  {:else}
  <Placeholder message={'holdingMessage'} link={getCurrentProposalLink()}/>
  {/if}
</div>