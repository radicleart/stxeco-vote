<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
	import { createEventDispatcher, onMount } from "svelte";
	import Brand from './Brand.svelte'
	import { sbtcConfig } from '$stores/stores';
	import { afterNavigate, goto } from "$app/navigation";
	import { authenticate, initApplication, loginStacks, loginStacksJs } from '$lib/stacks_connect'
	import { logUserOut, loggedIn } from '$lib/stacks_connect'
	import { isCoordinator } from '$lib/sbtc_admin.js'
	import AccountDropdown from './AccountDropdown.svelte'
	import SettingsDropdown from './SettingsDropdown.svelte';
	import { CONFIG } from '$lib/config';
	import { fmtNumber, type AddressObject, type DepositPayloadUIType, type WithdrawPayloadUIType } from 'sbtc-bridge-lib';
	import { setAuthorisation } from '$lib/bridge_api';
	import { stacksStore } from '$stores/stacksStore';

	const dispatch = createEventDispatcher();
	const coordinator = (loggedIn() && $sbtcConfig.keySets[CONFIG.VITE_NETWORK]) ? isCoordinator($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress) : undefined;

	const doLogin = async () => {
		if (loggedIn()) doLogout()
		else {
			await loginStacks(loginCallback);
		}
	}
	let componentKey = 0;
	afterNavigate((nav) => {
		componentKey++;
	})

	$: getBlockHeigths = () => {
		let msg = 'Block Height: '
		msg += ($sbtcConfig.stacksInfo) ? fmtNumber($sbtcConfig.stacksInfo.stacks_tip_height) : ' n/a ';
		return msg
	}

	const loginCallback = async () => {
		await initApplication($sbtcConfig, true)
		if (loggedIn() && !$sbtcConfig.authHeader) {
			await authenticate($sbtcConfig)
		}
		await setAuthorisation($sbtcConfig.authHeader)
		setTimeout(function() {
			dispatch('login_event');
			componentKey++;
		}, 500)
	}

	const doLogout = async () => {
		logUserOut();
		$sbtcConfig.authHeader = undefined
		$sbtcConfig.keySets[CONFIG.VITE_NETWORK] = {} as AddressObject;
		await sbtcConfig.update(() => $sbtcConfig)
		dispatch('login_event');
		setTimeout(function() {
			componentKey++;
			goto('/')
		}, 100)
	}

	const getNavActiveClass = (item:string) => {
		if (location.pathname === item) return 'font-normal text-base text-primary-500 !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
		return 'font-normal text-base text-white !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
	}

</script>

<Navbar
	class="relative mx-auto flex max-w-7xl items-center !px-6 lg:px-8 !bg-transparent"
	let:hidden
	let:toggle
	fluid={true}
>
  <NavBrand href="/">
		<Brand />
  </NavBrand>

  	{#key componentKey}
  	<div class="hidden md:flex md:gap-2 md:order-3">

		{#if loggedIn()}
			<AccountDropdown on:init_logout={() => doLogout()}/>
		{:else}
			<button class="inline-flex items-center bg-primary-01 px-4 py-2 font-normal text-white rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/50 shrink-0" on:keydown on:click={doLogin}>
				Connect wallet
			</button>
		{/if}
	</div>

	<NavHamburger class="text-white hover:bg-gray-1000" on:click={toggle} />

	<NavUl
		{hidden}
		class="order-1 md:flex-1"
		ulClass="dark:bg-black dark:md:bg-transparent md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:font-medium !md:space-x-4"
	>
		<div class="w-full flex flex-row justify-between">
			<div class="flex">
				<NavLi nonActiveClass={getNavActiveClass('/faq')} href="/faq">FAQ</NavLi>
				<NavLi nonActiveClass={getNavActiveClass('/dao/voting')} href="/dao/voting?method=1">Vote</NavLi>
			</div>
			<div>
				<span class="self-end inline-block text-purple-900 py-2.5">
					{getBlockHeigths()}
				</span>
			</div>
		</div>

		<NavLi nonActiveClass="md:hidden ml-0 md:ml-2">
			{#if loggedIn()}
				<AccountDropdown on:init_logout={() => doLogout()}/>
			{:else}
				<button id="connect-wallet" class="block w-full items-center gap-x-1.5 bg-primary-01 px-4 py-2 font-normal text-black rounded-lg border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" on:keydown on:click={doLogin}>
					Connect wallet
				</button>
			{/if}
		</NavLi>
	</NavUl>
	{/key}
</Navbar>
