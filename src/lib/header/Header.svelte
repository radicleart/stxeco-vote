<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
	import { createEventDispatcher } from "svelte";
	import Brand from './Brand.svelte'
	import { sbtcConfig } from '$stores/stores';
	import { afterNavigate, goto } from "$app/navigation";
	import { authenticate, fetchSbtcBalance, initApplication, loginStacks, loginStacksJs } from '$lib/stacks_connect'
	import { logUserOut, loggedIn } from '$lib/stacks_connect'
	import { getCurrentProposal, isCoordinator } from '$lib/sbtc_admin.js'
	import AccountDropdown from './AccountDropdown.svelte'
	import { CONFIG, setConfig } from '$lib/config';
	import { fmtNumber, type AddressObject, type DepositPayloadUIType, type WithdrawPayloadUIType } from 'sbtc-bridge-lib';
	import { fetchUserBalances, setAuthorisation } from '$lib/bridge_api';
	import type { SbtcConfig } from '$types/sbtc_config';
	import { getDaoProposals } from '$lib/dao_api';

	const dispatch = createEventDispatcher();
	const coordinator = (loggedIn() && $sbtcConfig.keySets[CONFIG.VITE_NETWORK]) ? isCoordinator($sbtcConfig.keySets[CONFIG.VITE_NETWORK].stxAddress) : undefined;

	const doLogin = async () => {
		if (loggedIn()) doLogout()
		else {
			await loginStacks(loginCallback);
		}
	}

	const switchNetwork = async () => {
		let net = CONFIG.VITE_NETWORK;
		if (net === 'devnet') return
		if (net === 'mainnet') net = 'testnet';
		else net = 'mainnet'
		setConfig(net);
		await fetchSbtcBalance($sbtcConfig, true);
		const url = new URL(location.href);
		if (import.meta.env.MODE === 'simnet') {
			url.searchParams.set('chain', 'testnet');
		} else {
			url.searchParams.set('chain', net);
		}
		//await dispatch('network_switch_event')
		location.assign(url.search);
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
		if (location.pathname === item) return ' text-base text-primary-500 !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
		return ' text-base text-white !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
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
			<button class="font-mono uppercase inline-flex items-center bg-[#131416] px-4 py-2 text-sm  text-white rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" on:keydown on:click={doLogin}>
				Connect wallet&nbsp;<span class="text-[#FDFDFC]/[0.64]">-></span>
			</button>
		{/if}
	</div>

	<NavHamburger class="text-black hover:bg-gray-1000" on:click={toggle} />

	<NavUl
		{hidden}
		class="order-1 md:flex-1"
		ulClass="dark:bg-black dark:md:bg-transparent md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:!md:space-x-4"
	>
		<div class="w-full flex flex-row justify-between">
			<div class="flex">
				<!--
				<NavLi nonActiveClass={getNavActiveClass('/dao/proposals')} href="/dao/proposals">Proposals</NavLi>
				<NavLi nonActiveClass={getNavActiveClass('/dao/proposals/propose')} href="/dao/proposals/propose">Propose</NavLi>
				<NavLi nonActiveClass={getNavActiveClass('/faq')} href="/faq">FAQ</NavLi>
				<NavLi nonActiveClass={getNavActiveClass('/dao/proposals')} href={'/dao/proposals/' + $sbtcConfig.currentProposal.contractId + '?method=1'}>Vote</NavLi>
				-->
				<NavLi nonActiveClass={getNavActiveClass('/dao/proposals') + ' bg-gray-100 opacity-80  ' }><a class="opacity-100 text-gray-900" href="/"  on:click|preventDefault={() => switchNetwork()}> {CONFIG.VITE_NETWORK}</a></NavLi>
			</div>
			<div>
				<span class="inline-block md:text-sand-700 py-2.5 px-2">
					{getBlockHeigths()}
				</span>
			</div>
		</div>

		<NavLi nonActiveClass="md:hidden ml-0 md:ml-2">
			{#if loggedIn()}
				<AccountDropdown on:init_logout={() => doLogout()}/>
			{:else}
				<button id="connect-wallet" class="opacity-10 block w-full items-center gap-x-1.5 bg-primary-01 px-4 py-2  text-white rounded-lg border border-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" on:keydown on:click={doLogin}>
					Connect wallet
				</button>
			{/if}
		</NavLi>
	</NavUl>
	{/key}
</Navbar>
