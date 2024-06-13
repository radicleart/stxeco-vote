<script lang="ts">
	import '../app.postcss';
	import "../index.css";
	import Header from "$lib/header/Header.svelte";
	import Footer from "$lib/header/Footer.svelte";
	import { initApplication, isLegal } from "$lib/stacks_connect";
	import { loginStacksFromHeader } from '@mijoco/stx_helpers/dist/account'
	import { CONFIG, setConfigByUrl } from '$lib/config';
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '$stores/stores'
	import { COMMS_ERROR, tsToTime } from '$lib/utils.js'
	import InFlightTransaction from '$lib/components/inflight/InFlightTransaction.svelte';
	import { getDaoProposals, getPoolAndSoloAddresses } from '$lib/dao_api';
	import { getCurrentProposal } from '$lib/admin';
	import type { AddressObject } from '@mijoco/stx_helpers/dist/index';
	import { daoStore } from '$stores/stores_dao';
	import { fetchStacksInfo } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

	const unsubscribe1 = sessionStore.subscribe(() => {});
	onDestroy(async () => {
		unsubscribe1()
	})

	let componentKey = 0;
	let componentKey1 = 0;
	if (!$page.url.searchParams.has('chain')) $page.url.searchParams.set('chain', 'mainnet')
	setConfigByUrl($page.url.searchParams);
	if (!isLegal(location.href)) {
		//componentKey++;
		goto('/' + '?chain=mainnet')
	}
	beforeNavigate((nav) => {
		if (!isLegal(nav.to?.route.id || '')) {
			nav.cancel();
			login()
			return;
		}
		if (!nav.to?.url.searchParams?.has('chain') && $page.url.hostname === 'localhost') {
			nav.to?.url.searchParams.set('chain', CONFIG.VITE_NETWORK)
		}
		console.debug('beforeNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	afterNavigate((nav) => {
		//componentKey++;
		console.debug('afterNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	let inited = false;
	let errorReason:string|undefined;

	const login = async () => {
		const res = await loginStacksFromHeader(document)
	}

	const loginEvent = () => {
		componentKey++;
		componentKey1++;
	}

	const networkSwitchEvent = async () => {
		await initApp()
		componentKey++;
		componentKey1++;
	}

	const initApp = async () => {
		await initApplication($sessionStore.userSettings);

		const soloPoolData = await getPoolAndSoloAddresses()
		const daoProposals = await getDaoProposals()
		let currentProposal = await getCurrentProposal()
		daoStore.update((conf) => {
			conf.soloPoolData = soloPoolData
			conf.proposals = daoProposals
			conf.currentProposal = currentProposal
			return conf;
		});

		inited = true;
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
			const conf = $sessionStore;
			if (!conf.keySets) {
				if (CONFIG.VITE_NETWORK === 'testnet') {
					conf.keySets = { 'testnet': {} as AddressObject };
				} else if (CONFIG.VITE_NETWORK === 'devnet') {
					conf.keySets = { 'testnet': {} as AddressObject };
				} else {
					conf.keySets = { 'mainnet': {} as AddressObject };
				}
				conf.keySets[CONFIG.VITE_NETWORK] = {} as AddressObject;
				sessionStore.update(() => conf);
			}

			await initApp();
			inited = true;

			//await connectToStacks();
			//subscribeBlockUpdates();
			startTimer();
		} catch (err) {
			errorReason = COMMS_ERROR
			console.log(err)
		}
	})
</script>
	<div class="bg-white min-h-screen relative">
		{#if inited}
		<Header on:login_event={loginEvent} on:network_switch_event={networkSwitchEvent}/>
		<div class="mx-auto px-6 relative">
				<InFlightTransaction />
				{#key componentKey1}
					<slot></slot>
				{/key}
			</div>
		<Footer />
		{/if}
	</div>
