<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Toggle } from 'flowbite-svelte'
	import { InformationCircle, Icon } from "svelte-hero-icons"
  import { Tooltip } from 'flowbite-svelte';
	import { sbtcConfig } from '$stores/stores';
	import type { SbtcConfig } from '$types/sbtc_config';
	import Currencies from '$lib/components/settings/Currencies.svelte';
	import Addresses from '$lib/components/settings/Addresses.svelte';
	import Networks from '$lib/components/settings/Networks.svelte';
	import type { ExchangeRate } from 'sbtc-bridge-lib';
	import { StxBalanceFromJSON } from '@stacks/blockchain-api-client';

	const toggleSettings = (arg:string) => {
		const conf:SbtcConfig = $sbtcConfig;
		if (arg === 'debug') conf.userSettings.debugMode = !conf.userSettings.debugMode;
		if (arg === 'cryptoFirst') conf.userSettings.currency.cryptoFirst = !conf.userSettings.currency.cryptoFirst;
		sbtcConfig.update(() => conf);
	}

	onMount(async () => {
		if (typeof $sbtcConfig.userSettings === 'undefined') {
			$sbtcConfig.userSettings = {
				debugMode: false,
        executiveTeamMember: false,
				currency: {
					cryptoFirst: false,
					myFiatCurrency: { currency: 'USD'} as ExchangeRate,
					denomination: 'bitcoin'
				}
			}
		}
		if (typeof $sbtcConfig.userSettings.currency === 'undefined') {
			$sbtcConfig.userSettings.currency = {
				cryptoFirst: false,
				myFiatCurrency: { currency: 'USD'} as ExchangeRate,
				denomination: 'bitcoin'
			}
		}
		sbtcConfig.update(() => $sbtcConfig);
	})
</script>

<svelte:head>
  <title>stx.eco</title>
  <meta name="description" content="Voting on major protocol upgrades." />
</svelte:head>

<Tooltip class="w-80 !bg-black z-20" triggeredBy="#po-network">
  Testnet refers to a test version of the real blockchain. On the other hand, mainnet is the live version of the blockchain network used for real transactions.
</Tooltip>
<Tooltip class="w-80 !bg-black z-20" triggeredBy="#po-opdrop">
  OP_DROP means you can deposit from any wallet but takes a bit longer. OP_RETURN allows you to deposit/withdraw
  more quickly using your Stacks Bitcoin wallet!
</Tooltip>
<div class="mx-auto md:w-3/5 w-full p-6 py-6">
  <div class="my-8">
    <div class="md:p-10 px-4 gap-6 items-start bg-gray-1000 border-[0.5px] border-gray-700 rounded-lg">
      <h1 class="text-4xl">Settings</h1>

      <div class="bg-gray-1000 text-white">
        <div class="border-b border-gray-900/50 pt-6 pb-8">
          <Networks />
        </div>

        <div class="border-b border-gray-900/50 pt-6 pb-8">
          <Currencies />
        </div>

        <div class="border-b border-gray-900/50 pt-6 pb-8">
          <Addresses />
        </div>

        <div class="py-6">
          <h2 class="text-2xl mb-2">Advanced mode</h2>
          <div class="bg-gray-1000 flex gap-2 align-top">
            <Toggle class=" text-white" checked={$sbtcConfig.userSettings?.debugMode} on:click={() => toggleSettings('debug')} ></Toggle>
            <p class="text-white">
              <span class="text-white font-medium">Advanced mode {#if $sbtcConfig.userSettings?.debugMode}On{:else}Off{/if}</span>
              <span class="block text-sm">{#if $sbtcConfig.userSettings?.debugMode}Show advanced info{:else}Hide advanced info{/if}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
