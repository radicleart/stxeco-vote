<script lang="ts">
	//import '../app.postcss';
	import "../app.css";
	import { StxEcoFooter, StxEcoHeader } from "@mijoco/stx_components";
	import { initAddresses, initApplication, isLegal } from "$lib/stacks_connect";
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '$stores/stores'
	import { COMMS_ERROR, tsToTime } from '$lib/utils.js'
	import InFlightTransaction from '$lib/components/inflight/InFlightTransaction.svelte';
	import { getDaoProposals, getPoolAndSoloAddresses } from '$lib/dao_api';
	import { getCurrentProposal } from '$lib/proposals';
	import { daoStore } from '$stores/stores_dao';
	import { getConfig } from '$stores/store_helpers';
	import { page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { configStore, setConfigByUrl } from '$stores/stores_config';
	import HeaderFromComponents from '$lib/header/HeaderFromComponents.svelte';
	import Placeholder from '$lib/components/all-voters/Placeholder.svelte';
	import type { DaoStore } from '$types/local_types';
	import { isLoggedIn, logUserOut, loginStacks, loginStacksFromHeader } from '@mijoco/stx_helpers/dist/account';
	import { fetchStacksInfo } from '@mijoco/stx_helpers/dist/stacks-node';

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
			nav.to?.url.searchParams.set('chain', getConfig().VITE_NETWORK)
		}
		console.debug('beforeNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	let inited = false;
	let errorReason:string|undefined;

	const login = async () => {
		const res = await loginStacksFromHeader(document)
	}

	const initApp = async () => {
		await initAddresses();
		await initApplication($sessionStore.userSettings);

		const soloPoolData = await getPoolAndSoloAddresses()
		const daoProposals = await getDaoProposals()
		let currentProposal = await getCurrentProposal()
		daoStore.update((conf:DaoStore) => {
			conf.soloPoolData = soloPoolData
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
			errorReason = COMMS_ERROR
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
						<Placeholder />
					</div>
				</div>
				{/if}
			</div>
		<StxEcoFooter />
	</div>
