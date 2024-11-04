<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		fmtMicroToStx,
		fmtNumber,
		fmtNumberStacksFloor,
		fmtSatoshiToBitcoin,
		getAddressId,
		getRouterInfo
	} from '$lib/utils';
	import { isLoggedIn, logUserOut, loginStacks } from '@mijoco/stx_helpers/dist/account';
	import { StxEcoHeader } from '@mijoco/stx_components';
	import { sessionStore } from '$stores/stores';
	import { getConfig } from '$stores/store_helpers';
	import { isCoordinator } from '$lib/proposals';
	import type { AddressObject, HeaderLink } from '@mijoco/stx_helpers/dist/index';
	import { goto } from '$app/navigation';
	import { appDetails } from '$lib/config';

	const dispatch = createEventDispatcher();
	let coordinator = isCoordinator($sessionStore.keySets[getConfig().VITE_NETWORK]?.stxAddress);

	let keys = $sessionStore.keySets ? $sessionStore.keySets[getConfig().VITE_NETWORK] : undefined;
	let loggedIn = isLoggedIn();
	$: heights = {
		stacksHeight: fmtNumber($sessionStore.stacksInfo?.stacks_tip_height || 0) || '0',
		bitcoinHeight: fmtNumber($sessionStore.stacksInfo?.burn_block_height || 0) || '0'
	};
	$: account = {
		stxAddress: $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress || 'unknown',
		cardinal: $sessionStore.keySets[getConfig().VITE_NETWORK].cardinal || 'unknown',
		ordinal: $sessionStore.keySets[getConfig().VITE_NETWORK].ordinal || 'unknown',
		bnsNameInfo: $sessionStore.keySets[getConfig().VITE_NETWORK].bnsNameInfo
	};
	$: balances = {
		sbtcBalance: fmtNumber($sessionStore.keySets[getConfig().VITE_NETWORK]?.sBTCBalance) || '0',
		cardinalBalance:
			fmtSatoshiToBitcoin(
				$sessionStore.keySets[getConfig().VITE_NETWORK]?.walletBalances?.cardinal.amount!
			) || '0',
		ordinalBalance:
			fmtSatoshiToBitcoin(
				$sessionStore.keySets[getConfig().VITE_NETWORK]?.walletBalances?.ordinal.amount!
			) || '0',
		stacksBalance:
			fmtMicroToStx(
				$sessionStore.keySets[getConfig().VITE_NETWORK]?.walletBalances?.stacks.amount!
			) || '0'
	};

	let headerLinks: Array<HeaderLink> = [];
	getRouterInfo(headerLinks, '/tools');
	if (isLoggedIn() && coordinator) {
		getRouterInfo(headerLinks, '/admin');
		//getRouterInfo(headerLinks, '/dao-launcher')
		//getRouterInfo(headerLinks, '/proposals')
	}

	const loginEvent = async (e?: any) => {
		console.log('update for login', e.target);
		await loginStacks(appDetails, function () {
			console.log('update for login');
			loggedIn = isLoggedIn();
			window.location.reload();
		});
	};

	const logoutEvent = () => {
		logUserOut();
		localStorage.removeItem('VOTED_FLAG' + getAddressId());
		localStorage.removeItem('VOTED_TXID_2' + getAddressId());
		localStorage.removeItem('VOTED_TXID_3' + getAddressId());
		//localStorage.removeItem('STX_PROVIDER');
		loggedIn = isLoggedIn();
		$sessionStore.keySets['mainnet'] = {} as AddressObject;
		$sessionStore.keySets['testnet'] = {} as AddressObject;
		$sessionStore.keySets['devnet'] = {} as AddressObject;
		sessionStore.update(() => $sessionStore);

		dispatch('login_event');
		setTimeout(function () {
			goto('/');
		}, 100);
	};

	const networkSwitchEvent = async () => {};

	const copyEvent = async () => {};

	onMount(async () => {
		try {
			keys = $sessionStore.keySets[getConfig().VITE_NETWORK];
			account = {
				stxAddress: keys?.stxAddress || 'unknown',
				cardinal: keys?.cardinal || 'unknown',
				ordinal: keys?.ordinal || 'unknown',
				bnsNameInfo: keys?.bnsNameInfo
			};
		} catch (err) {
			console.log(err);
		}
	});
</script>

<StxEcoHeader
	{headerLinks}
	{loggedIn}
	{heights}
	{account}
	{balances}
	on:do_login={loginEvent}
	on:do_logout={logoutEvent}
	on:do_copy={copyEvent}
	on:switch_network={networkSwitchEvent}
/>
