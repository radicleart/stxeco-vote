<script lang="ts">
	//import '../app.postcss';
	import "../app.css";
	import { Placeholder, StxEcoFooter } from "@mijoco/stx_components";
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '$stores/stores'
	import { COMMS_ERROR, tsToTime } from '$lib/utils.js'
	import InFlightTransaction from '$lib/components/inflight/InFlightTransaction.svelte';
	import { fetchExchangeRates, getPoolAndSoloAddresses } from '$lib/dao_api';
	import { getCurrentProposalLink, isExecutiveTeamMember } from '$lib/proposals';
	import { daoStore } from '$stores/stores_dao';
	import { getConfig } from '$stores/store_helpers';
	import { page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { configStore, setConfigByUrl } from '$stores/stores_config';
	import HeaderFromComponents from '$lib/header/HeaderFromComponents.svelte';
	import { initAddresses, initApplication, isLegal, isLoggedIn, logUserOut, loginStacks, loginStacksFromHeader } from '@mijoco/stx_helpers/dist/account';
	import { fetchStacksInfo } from '@mijoco/stx_helpers/dist/stacks-node';
	import type { DaoStore } from "@mijoco/stx_helpers/dist/index";

	const unsubscribe1 = sessionStore.subscribe(() => {});
	const unsubscribe2 = daoStore.subscribe(() => {});
	const unsubscribe3 = configStore.subscribe(() => {});
	onDestroy(async () => {
		unsubscribe1()
		unsubscribe2()
		unsubscribe3()
	})
	
	let componentKey = 0;
	setConfigByUrl($page.url.searchParams);
	if (!isLegal(location.href)) {
		//componentKey++;
		goto('/')
	}
	beforeNavigate((nav) => {
		if (!isLegal(nav.to?.route.id || '')) {
			nav.cancel();
			login()
			return;
		}
		if (!nav.to?.url.searchParams?.has('chain') && $page.url.hostname === 'localhost') {
			nav.to?.url.searchParams.set('chain', getConfig().VITE_NETWORK)
		}
		console.debug('beforeNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	let inited = false;
	let holdingMessage = 'Waiting for voting information to load';

	const login = async () => {
		const res = await loginStacksFromHeader(document)
	}

	const initApp = async () => {
		await initAddresses(getConfig().VITE_NETWORK, sessionStore);
		const exchangeRates = await fetchExchangeRates();
		await initApplication(getConfig().VITE_STACKS_API, getConfig().VITE_MEMPOOL_API, getConfig().VITE_NETWORK, sessionStore, exchangeRates, getConfig().VITE_SBTC_CONTRACT_ID)
		componentKey++
		const emTeamMam = await isExecutiveTeamMember($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress);
		$sessionStore.userSettings.executiveTeamMember = emTeamMam?.executiveTeamMember || false
		daoStore.update((conf:DaoStore) => {
			return conf;
		});
	}

	let timer:any;

	onDestroy(() => {
		clearInterval(timer)
	})

	const startTimer = () => {
		timer = setInterval(async () => {
			const stacksInfo = await fetchStacksInfo(getConfig().VITE_STACKS_API);
			sessionStore.update((conf) => {
				conf.stacksInfo = stacksInfo
				//conf.poxInfo = poxInfo
				return conf;
			});
		}, 120000)
	}

	onMount(async () => {
		try {

			await initApp();
			inited = true;

			//await connectToStacks();
			//subscribeBlockUpdates();
			startTimer();
		} catch (err) {
			holdingMessage = COMMS_ERROR
			console.log(err)
		}
	})
</script>
	<div class="bg-white min-h-screen relative flex flex-col">
		{#key componentKey}
		{#if inited}
		<div class="w-full"><HeaderFromComponents/></div>
		{/if}
		{/key}
		<div class=" px-6 relative grow">
			{#if inited}
			<InFlightTransaction />
			{#key componentKey}
				<slot></slot>
			{/key}
			{:else}
			<div class="py-4 mx-auto max-w-7xl md:px-6">
				<div class="flex flex-col w-full my-8">
					<Placeholder message={holdingMessage} link={getCurrentProposalLink('Loading')}/>
				</div>
			</div>
			{/if}
		</div>
		<div class="w-full"><StxEcoFooter /></div>
	</div>
