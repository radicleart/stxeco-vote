<script lang="ts">
	import { type PoxInfo } from "@mijoco/stx_helpers/dist/index";
	import { onMount } from "svelte";

  export let poxInfo:PoxInfo

	onMount(async () => {
  })
</script>

<div class="my-5 bg-sand-300 rounded-md p-3">
  <div class="row">
    <div>

      <div class="mt-20">
        <h1 class="text-2xl">Epochs and POX Contract Versions</h1>
      </div>
      {#if poxInfo}
      <div class="my-5">
        {#each poxInfo.contract_versions as conVer}
        <div class="mb-5 border border-spacing-3 p-2">
          <div class="w-full">
            <div class="text-blue-500">{conVer.contract_id}</div>
          </div>
          <div class="grid grid-cols-4">
            <div class="col-span-1">activation</div><div>{conVer.activation_burnchain_block_height}</div>
          </div>
          <div class="grid grid-cols-4">
            <div class="col-span-1">first reward cycle</div><div>{conVer.first_reward_cycle_id}</div>
          </div>
        </div>
        {/each}
      </div>

      <div class="mt-20">
        {#each poxInfo.epochs as epoch}
        <div class="mb-5 border border-spacing-3 p-2">
          <div class="grid grid-cols-4">
            <div class="text-blue-500">{epoch.epoch_id}</div>
          </div>
          <div class="grid grid-cols-4">
            <div class="col-span-1">start height</div><div>{epoch.start_height}</div>
          </div>
          <div class="grid grid-cols-4">
            <div class="col-span-1">end height</div><div>{epoch.end_height}</div>
          </div>
          <div class="grid grid-cols-4">
            <div class="col-span-1">network epoch</div><div>{epoch.network_epoch}</div>
          </div>
        </div>
        {/each}
      </div>
      {/if}

    </div>
  </div>
</div>