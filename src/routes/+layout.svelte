<script lang="ts">
	//import '../app.postcss';
	import "../app.css";
	import { Placeholder, StxEcoFooter, StxEcoHeader } from "@mijoco/stx_components";
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '$stores/stores'
	import { COMMS_ERROR, tsToTime } from '$lib/utils.js'
	import InFlightTransaction from '$lib/components/inflight/InFlightTransaction.svelte';
	import { fetchExchangeRates, getDaoProposals, getPoolAndSoloAddresses, getTentativeProposals } from '$lib/dao_api';
	import { getCurrentProposal, getCurrentProposalLink, isExecutiveTeamMember } from '$lib/proposals';
	import { daoStore } from '$stores/stores_dao';
	import { getConfig } from '$stores/store_helpers';
	import { page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { configStore, setConfigByUrl } from '$stores/stores_config';
	import HeaderFromComponents from '$lib/header/HeaderFromComponents.svelte';
	import { initAddresses, initApplication, isLegal, isLoggedIn, logUserOut, loginStacks, loginStacksFromHeader } from '@mijoco/stx_helpers/dist/account';
	import { fetchStacksInfo } from '@mijoco/stx_helpers/dist/stacks-node';
	import type { CurrentProposal, DaoStore, TentativeProposal } from "@mijoco/stx_helpers/dist/index";

	const unsubscribe1 = sessionStore.subscribe(() => {});
	const unsubscribe2 = daoStore.subscribe(() => {});
	const unsubscribe3 = configStore.subscribe(() => {});
	onDestroy(async () => {
		unsubscribe1()
		unsubscribe2()
		unsubscribe3()
	})


	let loggedIn = isLoggedIn();
	
	const loginEvent = async (e?:any) => {
		console.log('update for login', e.target)
		await loginStacks(function() {
			console.log('update for login')
			loggedIn = isLoggedIn();
		})
	}

	const logoutEvent = () => {
		logUserOut();
		loggedIn = isLoggedIn();
	}

	const networkSwitchEvent = async () => {
		await initApp()
		componentKey++;
	}

	const copyEvent = async () => {
		await initApp()
		componentKey++;
	}

	let componentKey = 0;
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
			nav.to?.url.searchParams.set('chain', getConfig().VITE_NETWORK)
		}
		console.debug('beforeNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	let inited = false;
	let holdingMessage = 'Waiting for voting information to load';

	const login = async () => {
		const res = await loginStacksFromHeader(document)
	}

	let link = {name: '', address: ''}
	const initApp = async () => {
		await initAddresses(getConfig().VITE_NETWORK, sessionStore);
		const exchangeRates = await fetchExchangeRates();
		await initApplication(getConfig().VITE_STACKS_API, getConfig().VITE_MEMPOOL_API, getConfig().VITE_NETWORK, sessionStore, exchangeRates, getConfig().VITE_SBTC_CONTRACT_ID)

		const emTeamMam = await isExecutiveTeamMember($sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress);
		$sessionStore.userSettings.executiveTeamMember = emTeamMam?.executiveTeamMember || false
		const soloPoolData = await getPoolAndSoloAddresses()
		const tentativeProposals:Array<TentativeProposal> = await getTentativeProposals()
		const daoProposals = await getDaoProposals()
		let currentProposal:CurrentProposal = await getCurrentProposal()
		link.address = currentProposal.linkAddress || ''
		link.name = currentProposal.linkName || ''
		daoStore.update((conf:DaoStore) => {
			conf.soloPoolData = soloPoolData
			conf.tentativeProposals = tentativeProposals
			conf.proposals = daoProposals
			conf.currentProposal = currentProposal
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
	<div class="bg-white min-h-screen relative">
		<HeaderFromComponents/>
		<div class="mx-auto px-6 relative">
			{#if inited}
			<InFlightTransaction />
			{#key componentKey}
				<slot></slot>
			{/key}
			{:else}
			<div class="py-4 mx-auto max-w-7xl md:px-6">
				<div class="flex flex-col w-full my-8">
					<Placeholder message={holdingMessage} link={getCurrentProposalLink()}/>
				</div>
			</div>
			{/if}
		</div>
		<StxEcoFooter />
	</div>
