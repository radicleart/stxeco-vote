<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte'
	import { Icon, ClipboardDocument, ArrowRight } from "svelte-hero-icons"
	import LogoSBTC from '$lib/components/shared/LogoSBTC.svelte';
	import LogoBitcoin from '$lib/components/shared/LogoBitcoin.svelte';
	import StacksIcon from '$lib/components/shared/StacksIcon.svelte';
	import CopyClipboard from '$lib/components/common/CopyClipboard.svelte';
	import { loggedIn, makeFlash } from "$lib/stacks_connect";
	import { CONFIG } from '$lib/config';
	import { createEventDispatcher } from "svelte";
	import { truncate } from '$lib/utils'
	import { sbtcConfig } from '$stores/stores'
	import { fmtSatoshiToBitcoin, fmtMicroToStx, bitcoinBalanceFromMempool } from '$lib/utils'
	import { isCoordinator } from '$lib/sbtc_admin';
	import { goto } from '$app/navigation';
	import type { AddressObject } from 'sbtc-bridge-lib';
	import { disconnect } from '@stacks/connect';
	const dispatch = createEventDispatcher();

	const coordinator = (loggedIn() && $sbtcConfig.keySets[CONFIG.VITE_NETWORK]) ? isCoordinator($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress) : undefined;
	const account:AddressObject = $sbtcConfig.keySets[CONFIG.VITE_NETWORK];

	let copied = false;
	let dropdownOpen = false;

	const handleClick = (e:any)=> {
    	e.preventDefault();
		dropdownOpen = !dropdownOpen
    	//alert ('Clicked on: ' + e.target)
  	}
  	const copy = (event:any, ele:string, val:string) => {
		event.stopPropagation();
		let clippy = {
			target: document.getElementById('clipboard')!,
			props: { name: val },
		}
		const app = new CopyClipboard(clippy);
		app.$destroy();
		makeFlash(document.getElementById(ele))
		copied = true;
		return false;
	}

	const doLogout = () => {
		disconnect()
		dispatch('init_logout');
	}

	const openMenu = () => {
		dispatch('init_logout');
	}

	const transformAddress = (address:string) => {
		if (address) {
			return truncate(address, 8)
		}
		return 'not connected'
	}
</script>

<div id="clipboard"></div>

<button on:click={(e) => handleClick(e)} class="font-mono uppercase inline-flex justify-between w-full sm:w-auto items-center bg-[#131416] gap-2 px-4 py-2 text-sm text-white rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0">
	My account
	<svg class="inline w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
		<path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
	</svg>
</button>
<Dropdown
	containerClass="z-30 rounded-lg !bg-black !border py-1 !border-transparent"
	placement='bottom-end'>
	<div slot="header" class="overflow-hidden py-1 text-white">
		<div class="divide-y divide-sand-900">
			<div class="pb-2">
				<div class="px-4 py-2">Addresses</div>
				{#if account.bnsNameInfo?.names?.length > 0}
				<div class="px-4 py-1 grid grid-flow-col auto-cols-auto gap-6 items-center">
					<div id="icon-bns" class="flex items-center gap-3 text-sm">
						<StacksIcon clazz={'w-5 h-5'}/>
						<span>{account.bnsNameInfo.names[0]}</span>
					</div>
					<div class="ml-auto flex items-center">
						<button on:click|preventDefault={(event) => copy(event, 'icon-bns', account.bnsNameInfo.names[0])} class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-sand-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
							<Icon on:keyup on:click={(event) => handleClick(event)} src="{ClipboardDocument}" class="h-5 w-5 text-white" aria-hidden="true" />
						</button>
					</div>
				</div>
				{/if}
				<div class="px-4 py-1 grid grid-flow-col auto-cols-auto gap-6 items-center">
					<div id="icon-stacks" class="flex items-center gap-3 text-sm">
						<StacksIcon clazz={'w-5 h-5'}/>
						<span>{transformAddress($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)}</span>
					</div>
					<div class="ml-auto flex items-center">
						<button on:click|preventDefault={(event) => copy(event, 'icon-stacks', $sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress)} class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-sand-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
							<Icon on:keyup on:click={(event) => handleClick(event)} src="{ClipboardDocument}" class="h-5 w-5 text-white" aria-hidden="true" />
						</button>
					</div>
				</div>
				<div class="px-4 py-1 grid grid-flow-col auto-cols-auto gap-6 items-center">
					<div id="icon-bitcoin" class="flex items-center gap-3 text-sm">
						<LogoBitcoin clazz={'w-5 h-5'}/>
						<span><span>Cardinal:</span>{' '}{transformAddress($sbtcConfig.keySets[CONFIG.VITE_NETWORK].cardinal)}</span>
					</div>
					<div class="ml-auto flex items-center">
						<button on:click|preventDefault={(event) => copy(event, 'icon-bitcoin', $sbtcConfig.keySets[CONFIG.VITE_NETWORK].cardinal)} class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-sand-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
							<Icon src="{ClipboardDocument}" class="h-5 w-5 text-white" aria-hidden="true" />
						</button>
					</div>
				</div>
				<div class="px-4 py-1 grid grid-flow-col auto-cols-auto gap-6 items-center">
					<div id="bitcoin-o-stacks" class="flex items-center gap-3 text-sm">
						<LogoBitcoin clazz={'w-5 h-5'}/>
						<span><span>Ordinal:</span>{' '}{transformAddress($sbtcConfig.keySets[CONFIG.VITE_NETWORK].ordinal)}</span>
					</div>
					<div class="ml-auto flex items-center">
						<button on:click|preventDefault={(event) => copy(event, 'icon-stacks', $sbtcConfig.keySets[CONFIG.VITE_NETWORK].ordinal)} class="h-8 w-8 rounded-md bg-black flex items-center justify-center border border-transparent hover:border-sand-900 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50">
							<Icon src="{ClipboardDocument}" class="h-5 w-5 text-white" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
			<div>
				<div class="mt-1 px-4 py-2">Balances</div>
				<div class="px-4 py-2 grid grid-flow-col auto-cols-auto gap-4 items-center">
					<div class="flex items-center gap-3 text-sm">
						<StacksIcon clazz={'w-5 h-5'}/>
						<span>STX</span>
					</div>
					<div class="ml-auto flex items-center">
						{fmtMicroToStx($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stacksTokenInfo?.stx?.balance || 0.000000)}
					</div>
				</div>

				<div class="px-4 py-2 grid grid-flow-col auto-cols-auto gap-4 items-center">
					<div class="flex items-center gap-3 text-sm">
						<LogoBitcoin clazz={'w-5 h-5'}/>
						<span>BTC (Cardinal)</span>
					</div>
					<div class="ml-auto flex items-center">
						{fmtSatoshiToBitcoin(bitcoinBalanceFromMempool($sbtcConfig.keySets[CONFIG.VITE_NETWORK].cardinalInfo) || 0.00000000)}
					</div>
				</div>
				<div class="px-4 py-2 grid grid-flow-col auto-cols-auto gap-4 items-center">
					<div class="flex items-center gap-3 text-sm">
						<LogoBitcoin clazz={'w-5 h-5'}/>
						<span>BTC (Ordinal)</span>
					</div>
					<div class="ml-auto flex items-center">
						{fmtSatoshiToBitcoin(bitcoinBalanceFromMempool($sbtcConfig.keySets[CONFIG.VITE_NETWORK].ordinalInfo) || 0.00000000)}
					</div>
				</div>
				<div class="px-4 py-2 grid grid-flow-col auto-cols-auto gap-4 items-center">
					<div class="flex items-center gap-3 text-sm">
						<LogoSBTC class={'w-5 h-5'}/>
						<span>sBTC</span>
					</div>
					<div class="ml-auto flex items-center">
						{fmtSatoshiToBitcoin($sbtcConfig.keySets[CONFIG.VITE_NETWORK].sBTCBalance || 0.00000000)}
					</div>
				</div>
			</div>
		</div>
	</div>
	{#if coordinator}
		<DropdownItem defaultClass="px-4 py-2 text-white hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/pox')}>
			<Icon src="{ArrowRight}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />
			Cycle info
		</DropdownItem>
		<DropdownItem defaultClass="px-4 py-2 text-white hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/dao/extensions')}>
			<Icon src="{ArrowRight}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />
			extensions
		</DropdownItem>
		<DropdownItem defaultClass="px-4 py-2 text-white hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/dao/proposals')}>
			<Icon src="{ArrowRight}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />
			proposals
		</DropdownItem>
		<DropdownItem defaultClass="px-4 py-2 text-white hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/dao/proposals/propose')}>
			<Icon src="{ArrowRight}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />
			propose
		</DropdownItem>
		<DropdownItem defaultClass="px-4 py-2 text-white hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/dao/proposals/propose')}>
			<Icon src="{ArrowRight}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />
			settings
		</DropdownItem>
		<DropdownItem defaultClass="px-4 py-2 text-white hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => goto('/admin')}>
			<Icon src="{ArrowRight}" mini class="inline h-5 w-5 text-white" aria-hidden="true" />
			admin
		</DropdownItem>
	{/if}
	<DropdownItem defaultClass="px-4 py-2 text-error-500 hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500/50" on:click={() => doLogout()}>Disconnect wallet</DropdownItem>
</Dropdown>
