import { writable } from 'svelte/store';
import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from './stores';
import type { SbtcConfig } from '$types/sbtc_config';

export const stacksStore = writable({} as any);

export let parfitWsClient:any;

let blocksSub:any;

export async function unsubscribeBlockUpdates() {
	if (blocksSub) await blocksSub.unsubscribe();
}

export async function connectToStacks() {
	parfitWsClient = await connectWebSocketClient(CONFIG.VITE_STACKS_API_HIRO_WS);
}

export async function subscribeBlockUpdates() {
	if (blocksSub) {
		await blocksSub.unsubscribe();
		blocksSub = undefined
	}
	blocksSub = await parfitWsClient.subscribeBlocks((event: any) => {
		sbtcConfig.update((n) => {
			if (!n) n = {} as SbtcConfig
			if (!n.stacksInfo) n.stacksInfo = {} as any
			n.stacksInfo.burn_block_height = event.burn_block_height
			n.stacksInfo.stacks_tip_height = event.height
			return n
		});
	});
}

export async function subscribeTxUpdates(txid:string, callback?:any|undefined) {
	//updateStoreWithNewTx(txid, callback)
	console.log('subscribeTxUpdates: txid: ' + txid)
	const sub = await parfitWsClient.subscribeTxUpdates(txid, (event: Transaction | MempoolTransaction) => {
		console.log('subscribeTxUpdates: sub: txid: ' + txid + ' event: ', event)
		//updateStoreWithTx(txid, event)
		if (callback) callback(txid, event)
		if (event.tx_status === 'success') {
			sub.unsubscribe();
		}
	});
}
