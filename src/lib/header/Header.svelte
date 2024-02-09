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
	let showBitcoin = true

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
		window.location.href = url.origin + '?chain=' + net //.assign(url.search);
	}

	let componentKey = 0;
	afterNavigate((nav) => {
		componentKey++;
	})

	$: getStacksHeight = () => {
		return (($sbtcConfig.stacksInfo) ? fmtNumber($sbtcConfig.stacksInfo.stacks_tip_height) : ' ');
 	}

	$: getBitcoinHeight = () => {
		return (($sbtcConfig.stacksInfo) ? fmtNumber($sbtcConfig.stacksInfo.burn_block_height) : ' ')
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
				<NavLi nonActiveClass={getNavActiveClass('/dao/proposals') + ' bg-gray-100 opacity-80  ' }><a class="opacity-100 text-gray-900" href="/"  on:click|preventDefault={() => switchNetwork()}> {CONFIG.VITE_NETWORK}</a></NavLi>
				-->
			</div>
			<div>
				<span role="contentinfo" class="inline-flex items-center gap-3 md:text-sand-700 py-2.5 px-2">
					Block height:
					<span class="inline-flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path fill="#101010" d="m14.8897 16.0001-2.546-3.8575H16v-1.4554H4v1.4571h3.65512l-2.54485 3.8558h1.8986L10 11.4681l2.9911 4.532h1.8986ZM16 9.27468V7.80464h-3.582L14.929 4h-1.8986L9.99997 8.59149 6.96957 4H5.07099l2.51428 3.80805H4v1.46663h12Z"/></svg>
						{getStacksHeight()}
					</span>
					<span class="inline-flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path fill="#101010" d="M15.549 8.62826c.22-1.47106-.9-2.26187-2.4315-2.78942l.4968-1.99275-1.213-.3023-.4837 1.94023c-.3189-.07946-.6464-.15442-.9718-.2287l.4871-1.95302L10.2206 3l-.49716 1.99205c-.26395-.06011-.52306-.11953-.77458-.18206l.00139-.00622-1.67282-.4177-.32268 1.29556s.89998.20626.88097.21904c.49128.12265.58007.44774.56521.70547l-.5659 2.27018c.03386.00863.07774.02107.12611.04042-.04042-.01002-.08361-.02108-.12818-.03179l-.79323 3.18015c-.06012.1493-.21247.3731-.55588.2882.01209.0176-.88167-.2201-.88167-.2201L5 13.5217l1.57851.3935c.29366.0736.58144.1506.86474.2232l-.50198 2.0155 1.21161.3023.49715-1.9941c.33097.0898.65227.1727.96666.2508l-.49542 1.9848L10.3343 17l.5019-2.0117c2.0684.3914 3.6238.2335 4.2785-1.6373.5276-1.5063-.0263-2.3752-1.1145-2.9418.7925-.1827 1.3895-.70407 1.5488-1.78094Zm-2.7715 3.88634c-.3748 1.5063-2.91103.692-3.73328.4878l.66609-2.6702c.82229.2052 3.45899.6115 3.06719 2.1824Zm.3752-3.90811c-.342 1.37019-2.4529.67404-3.1377.50337l.6039-2.42183c.6848.17067 2.89.4892 2.5338 1.91846Z"/></svg>
						{getBitcoinHeight()}
					</span>
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
