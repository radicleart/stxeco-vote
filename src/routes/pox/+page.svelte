<script lang="ts">
	import { onMount } from 'svelte';

  let poxInfo:any;

  onMount(async () => {
    poxInfo = 
  })
</script>

<svelte:head>
    <title>Ecosystem DAO</title>
    <meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="py-6 mx-auto max-w-7xl md:px-6">
    <div>
      <div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
        <div class="py-10 px-10 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">

          <div class="mt-6 md:mt-0 flex flex-col gap-y-5">
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
