<script lang="ts">
	import '../app.postcss';
	import "../index.css";
	import Header from "$lib/header/Header.svelte";
	import Footer from "$lib/header/Footer.svelte";
	import { initApplication, isLegal, loggedIn, authenticate, loginStacksFromHeader } from "$lib/stacks_connect";
	import { CONFIG, setConfigByUrl } from '$lib/config';
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount, onDestroy } from 'svelte';
	import { sbtcConfig } from '$stores/stores'
	import type { SbtcConfig } from '$types/sbtc_config'
	import { defaultSbtcConfig } from '$lib/sbtc';
	import { COMMS_ERROR, tsToTime } from '$lib/utils.js'
	import { fetchStacksInfo, getBalanceAtHeight, setAuthorisation } from '$lib/bridge_api';
	import type { AddressObject } from 'sbtc-bridge-lib';
	import InFlightTransaction from '$lib/components/inflight/InFlightTransaction.svelte';
	import { connectToStacks, stacksStore, subscribeBlockUpdates } from '$stores/stacksStore';
	import { getDaoProposals, getPoolAndSoloAddresses } from '$lib/dao_api';
	import { getCurrentProposal } from '$lib/sbtc_admin';
	import { getPoxInfo } from '$lib/pox_api';
	import PoxBanner from '$lib/components/dashboard/common/InsightsBanner.svelte';
	import { aggregateDelegationData } from '$lib/pox4_api';

	const unsubscribe1 = sbtcConfig.subscribe(() => {});
	const unsubscribe2 = stacksStore.subscribe(() => {});
	onDestroy(async () => {
		unsubscribe1()
		unsubscribe2()
	})

	let componentKey = 0;
	let componentKey1 = 0;
	if (!$page.url.searchParams.has('chain')) $page.url.searchParams.set('chain', 'testnet')
	setConfigByUrl($page.url.searchParams, $page.url.hostname);
	if (!isLegal(location.href)) {
		//componentKey++;
		goto('/' + '?chain=testnet')
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
		const stacksInfo = await fetchStacksInfo();
		const poxInfo = await getPoxInfo()
		const daoProposals = await getDaoProposals()
		let currentProposal = await getCurrentProposal()
		
		let aggDelegationData:Array<any> = await aggregateDelegationData()
	  	stacksStore.update(conf => {
			conf.aggDelegationData = aggDelegationData
			return conf
	  	})

		sbtcConfig.update((conf) => {
			conf.stacksInfo = stacksInfo
			conf.poxInfo = poxInfo
			conf.proposals = daoProposals
			conf.currentProposal = currentProposal
			return conf;
		});

		await initApplication(($sbtcConfig) ? $sbtcConfig : defaultSbtcConfig as SbtcConfig, undefined);
		if (loggedIn() && !$sbtcConfig.authHeader) {
			//asigna: await authenticate($sbtcConfig)
		}
		setAuthorisation($sbtcConfig.authHeader)
		inited = true;

		const soloPoolData = await getPoolAndSoloAddresses()

		sbtcConfig.update((conf) => {
			conf.soloPoolData = soloPoolData
			return conf;
		});
	}

	let timer:any;

	onDestroy(() => {
		clearInterval(timer)
	})

	const startTimer = () => {
		timer = setInterval(async () => {
			const stacksInfo = await fetchStacksInfo();
			//const poxInfo = await getPoxInfo()
			sbtcConfig.update((conf) => {
				conf.stacksInfo = stacksInfo
				//conf.poxInfo = poxInfo
				return conf;
			});
		}, 120000)
	}

	onMount(async () => {
		try {
			const conf = $sbtcConfig;
			if (!conf.keySets) {
				if (CONFIG.VITE_NETWORK === 'testnet') {
					conf.keySets = { 'testnet': {} as AddressObject };
				} else if (CONFIG.VITE_NETWORK === 'devnet') {
					conf.keySets = { 'testnet': {} as AddressObject };
				} else {
					conf.keySets = { 'mainnet': {} as AddressObject };
				}
				conf.keySets[CONFIG.VITE_NETWORK] = {} as AddressObject;
				sbtcConfig.update(() => conf);
			}

			await initApp();
			inited = true;

			await connectToStacks();
			subscribeBlockUpdates();
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
