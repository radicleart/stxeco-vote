<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { fmtNumber, getRouterInfo } from '$lib/utils';
	import { isLoggedIn, logUserOut, loginStacks } from '@mijoco/stx_helpers/dist/account';
	import { StxEcoHeader } from "@mijoco/stx_components";
	import { sessionStore } from "$stores/stores";
	import { getConfig } from "$stores/store_helpers";

	const dispatch = createEventDispatcher();

	const keys = ($sessionStore.keySets) ? $sessionStore.keySets[getConfig().VITE_NETWORK] : undefined;
	let loggedIn = isLoggedIn();
	$: heights = {
		stacksHeight: fmtNumber($sessionStore.stacksInfo?.stacks_tip_height || 0) || '0', 
		bitcoinHeight: fmtNumber($sessionStore.stacksInfo?.burn_block_height || 0) || '0'
	};
	$: account = {
		stxAddress:keys?.stxAddress || 'unknown', 
		cardinal:keys?.cardinal || 'unknown', 
		ordinal:keys?.ordinal || 'unknown' , 
		bnsNameInfo: keys?.bnsNameInfo
	};
	$: balances = {
		sbtcBalance: (keys && keys.walletBalances && keys.sBTCBalance) ? fmtNumber(keys.sBTCBalance) : '0.0',
		cardinalBalance: (keys && keys.walletBalances && keys.walletBalances.cardinal) ? fmtNumber(keys.walletBalances.cardinal.amount) : '0.0',
		ordinalBalance: (keys && keys.walletBalances && keys.walletBalances.cardinal) ? fmtNumber(keys.walletBalances.ordinal.amount) : '0.0',
		stacksBalance: (keys && keys.walletBalances && keys.walletBalances.cardinal) ? fmtNumber(keys.walletBalances.stacks.amount) : '0.0',
	}


	let headerLinks = []
	headerLinks.push(getRouterInfo('/voting'))
	headerLinks.push(getRouterInfo('/sip'))
	//headerLinks.push(getRouterInfo('/dao-launcher'))

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
	}

	const copyEvent = async () => {
	}
	
	onMount(async () => {
		try {
			//heights = {stacksHeight: '' + fmtNumber($sessionStore.stacksInfo?.stacks_tip_height) || '0', bitcoinHeight: '' + fmtNumber($sessionStore.stacksInfo?.burn_block_height) || '0'};
		} catch (err) {
			console.log(err)
		}
	})

</script>

<StxEcoHeader {headerLinks} {loggedIn} {heights} {account} {balances} on:do_login={loginEvent} on:do_logout={logoutEvent} on:do_copy={copyEvent} on:switch_network={networkSwitchEvent}/>
