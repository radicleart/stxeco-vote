<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { getRouterInfo } from '$lib/utils';
	import { isLoggedIn, logUserOut, loginStacks } from '@mijoco/stx_helpers/dist/account';
	import { StxEcoHeader } from "@mijoco/stx_components";
	import { page } from '$app/stores';
	import { sessionStore } from "$stores/stores";
	import { getConfig } from "$stores/store_helpers";

	const dispatch = createEventDispatcher();

	const keys = ($sessionStore.keySets) ? $sessionStore.keySets[getConfig().VITE_NETWORK] : undefined;
	let loggedIn = isLoggedIn();
	$: heights = {stacksHeight: '' + $sessionStore.stacksInfo?.stacks_tip_height || '0', bitcoinHeight: '' + $sessionStore.stacksInfo?.burn_block_height || '0'};
	$: account = {stxAddress:keys?.stxAddress || 'unknown', cardinal:keys?.cardinal || 'unknown', ordinal:keys?.ordinal || 'unknown' , bnsNameInfo: keys?.bnsNameInfo};
	$: balances = {sbtcBalance:'102',cardinalBalance:'10',ordinalBalance:'7',stacksBalance:'5'}


	let headerLinks = []
	headerLinks.push(getRouterInfo('/voting'))
	headerLinks.push(getRouterInfo('/insights'))
	headerLinks.push(getRouterInfo('/dao-launcher'))

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

</script>

{#if headerLinks && headerLinks.length === 3}
<StxEcoHeader {headerLinks} {loggedIn} {heights} {account} {balances} on:do_login={loginEvent} on:do_logout={logoutEvent} on:do_copy={copyEvent} on:switch_network={networkSwitchEvent}/>
{/if}