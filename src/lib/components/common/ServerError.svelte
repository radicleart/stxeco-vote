<script lang="ts">
import { sessionStore } from '$stores/stores'
import { CONFIG } from '$lib/config';
import { goto } from "$app/navigation";
import Button from '$lib/components/shared/Button.svelte';

const launchApp = () => {
  goto('/?chain=' + CONFIG.VITE_NETWORK)
}
</script>

<div class="mx-auto flex flex-col justify-center px-6 lg:px-8 py-6">
  <div class="max-w-2xl">
    <div class="flex flex-col p-10 gap-6 items-start bg-gray-1000 border-[0.5px] border-gray-700 rounded-lg">
      {#if CONFIG.VITE_NETWORK === 'mainnet'}
        <h1 class="text-4xl">Not Connected on Mainnet</h1>
      {:else}
        <h1 class="text-4xl">Server Error!</h1>
      {/if}
      <div>
        {#if CONFIG.VITE_NETWORK === 'mainnet'}
          <p class="mb-2">We are testing and mainnet s not yet supported.</p>
          <p class="mb-2">Please use the settings menu to switch to testnet.</p>
        {:else}
          <p class="mb-2">Temporarily problems connecting to the bridge.</p>
          <p class="mb-2">Please try later.</p>
        {/if}
        <p class="mb-2">For more info about the sBTC Bridge, check <a class={'text-warning-500'} href="/faq">the FAQ page.</a></p>
      </div>
      <Button darkScheme={false} label={'Back home'} target={'launchApp'} on:clicked={() => launchApp()}/>
    </div>
  </div>
</div>
