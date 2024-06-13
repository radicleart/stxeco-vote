<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
	import { createEventDispatcher } from "svelte";
	import Brand from './Brand.svelte'
	import { sessionStore } from '$stores/stores';
	import { afterNavigate, goto } from "$app/navigation";
	import AccountDropdown from './AccountDropdown.svelte'
	import type { AddressObject } from '@mijoco/stx_helpers/dist/index';
	import { fmtNumber } from '$lib/utils';
	import { isLoggedIn, logUserOut, loginStacks } from '@mijoco/stx_helpers/dist/account';
	import { initApplication } from '$lib/stacks_connect';
	import { getConfig } from '$stores/store_helpers';
	import { daoStore } from '$stores/stores_dao';

	const dispatch = createEventDispatcher();

	const doLogin = async () => {
		if (isLoggedIn()) doLogout()
		else {
			await loginStacks(loginCallback);
		}
	}

	let componentKey = 0;
	afterNavigate((nav) => {
		componentKey++;
	})

	$: getStacksHeight = () => {
		return (($sessionStore.stacksInfo) ? fmtNumber($sessionStore.stacksInfo.stacks_tip_height) : ' ');
 	}

	$: getBitcoinHeight = () => {
		return (($sessionStore.stacksInfo) ? fmtNumber($sessionStore.stacksInfo.burn_block_height) : ' ')
 	}

	const loginCallback = async () => {
		await initApplication($sessionStore.userSettings)
		setTimeout(function() {
			dispatch('login_event');
			componentKey++;
		}, 500)
	}

	const doLogout = async () => {
		logUserOut();
		$sessionStore.keySets[getConfig().VITE_NETWORK] = {} as AddressObject;
		dispatch('login_event');
		setTimeout(function() {
			componentKey++;
			goto('/')
		}, 100)
	}

	const getNavActiveClass = (item:string) => {
		if (location.pathname.indexOf(item) > -1) return ' text-base text-primary-500 !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
		return ' text-base !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
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
			{#if isLoggedIn()}
				<AccountDropdown on:init_logout={() => doLogout()}/>
			{:else}
				<button class="font-mono uppercase inline-flex items-center bg-[#131416] px-4 py-2 text-sm  text-white rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" on:keydown on:click={doLogin}>
					Connect wallet&nbsp;<span class="text-[#FDFDFC]/[0.64]">-></span>
				</button>
			{/if}
		</div>

		<NavHamburger class="text-black hover:bg-sand-900 hover:text-white" on:click={toggle} />

		<NavUl
			{hidden}
			class="order-1 md:flex-0"
			ulClass="dark:bg-white dark:md:bg-white md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:!md:space-x-4 sm:justify-end md:text-sand-700 py-2.5 px-2"
		>
			<div class="flex">
				<NavLi nonActiveClass={getNavActiveClass('/results')}><a href={'/dao/proposals/' + $daoStore.currentProposal?.contractId + '/results?method=1'}>Results</a></NavLi>
				<NavLi nonActiveClass={getNavActiveClass('/insights')}><a href="https://stx.eco/insights/">Insights</a></NavLi>
				<NavLi nonActiveClass={getNavActiveClass('/sip')}><a href={'/sip'}>SIP Process</a></NavLi>
				<!--<NavLi nonActiveClass={getNavActiveClass('/launcher')}><a href={'https://stx.eco/launcher'}>DAO Launcher</a></NavLi>-->
			</div>
			</NavUl>
			<NavUl
			{hidden}
			class="order-1 md:flex-1"
			ulClass="dark:bg-white dark:md:bg-white md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:!md:space-x-4 sm:justify-end md:text-sand-700 py-2.5 px-2"
		>
			<li>
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
			</li>

			<NavLi nonActiveClass="md:hidden" class="-ml-2 -mr-3">
				{#if isLoggedIn()}
					<AccountDropdown on:init_logout={() => doLogout()}/>
				{:else}
					<button id="connect-wallet" class="block w-full items-center gap-x-1.5 px-4 py-2 bg-[#131416] text-white rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#131416]" on:keydown on:click={doLogin}>
						Connect wallet
					</button>
				{/if}
			</NavLi>
		</NavUl>
	{/key}
</Navbar>

