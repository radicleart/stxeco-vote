import { CONFIG } from '$lib/config';
import type { WrappedPSBT, AddressObject } from 'sbtc-bridge-lib' 
import { checkAddressForNetwork } from 'sbtc-bridge-lib';

let authHeader:any;

export async function setAuthorisation(auth:any) {
  authHeader = auth
}
function headers() {
  if (authHeader) {
    return { 'Content-Type': 'application/json', 'Authorization': JSON.stringify(authHeader) }
  }
  return { 'Content-Type': 'application/json', 'Authorization': '' }
}

export function addNetSelector (path:string) {
  if (CONFIG.VITE_NETWORK === 'testnet') {
    return path.replace('bridge-api', 'bridge-api/testnet');
  } else if (CONFIG.VITE_NETWORK === 'devnet') {
    return path.replace('bridge-api', 'bridge-api/devnet');
  } else {
    return path.replace('bridge-api', 'bridge-api/mainnet');
  }
}

async function fetchCatchErrors(path:string) {
  try {
    const response = await fetch(path);
    return response;
  } catch (err:any) {
    console.log('fetchCatchErrors: ', err)
    return new Response(undefined, {
      status: 505,
    }) 
  }
}

export async function extractResponse(response:any) {
  try {
    return await response.json();
  } catch(err) {
    try {
      return await response.text();
    } catch(err) {
      console.log('error fetching response.. ', err)
    }
  }
}

/**
 * fetch a bunch of objects needed in the UI;
 * 1. sbtc contract data
 * 2. current btc exchange rate data 
 * 3. keys: pair of custodial keys for testing reclaima nd reveal transactions 
 * @returns 
 */
export async function fetchUiInit() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/sbtc/init-ui');
  try {
    const response = await fetch(path);
    const res = await response.json();
    return res;
  } catch(err) {
    return undefined;
  }
}

export async function fetchStacksInfo() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/stacks-info');
  try {
    const response = await fetch(path);
    const res = await response.json();
    return res;
  } catch(err) {
    return undefined;
  }
}
export async function getBalanceAtHeight(stxAddress:string, height: number):Promise<any> {
  if (!stxAddress) return {
    stx: {
      balance: 0,
      locked: 0,
    }
  }
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/balance/' + stxAddress + '/' + height);
  try {
    const response = await fetch(path);
    const res = await response.json();
    return res;
  } catch(err) {
    return undefined;
  }
}


export async function sendRawTransaction(tx: { hex: string; maxFeeRate: number|undefined; }) {
  if (!tx.maxFeeRate) tx.maxFeeRate = 0
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/tx/sendrawtx');
  const response = await fetch(path, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(tx)
  });

  if (response.status >= 400) {
    return {
      error: 'Error broadcasting',
      status: response.status
    }
  }
  return await extractResponse(response);
}

/**
export async function fetchKeys() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/tx/keys');
  const response = await fetchCatchErrors(path);
  if (response.status !== 200) {
    console.log('Bitcoin address not known - is the network correct?');
  }
  const res = await extractResponse(response);
  return res;
}
 */
export async function signAndBroadcast(wrappedPsbt:WrappedPSBT) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/tx/signAndBroadcast');
  const response = await fetch(path, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(wrappedPsbt)
  });
  let res:any;
  try {
    res = await response.json();
  } catch (err) {
    try {
      console.log(err)
      res = await response.text();
    } catch (err1) {
      console.log(err1)
    }
  }
  return res;
}

export async function fetchBurnBlockCount() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/blocks/count');
  const response = await fetchCatchErrors(path);
  if (response.status !== 200) {
    console.log('Bitcoin address not known - is the network correct?');
  }
  const txs = await extractResponse(response);
  return txs;
}

export async function fetchWalletProcessPsbt(psbt: { hex: string; }) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/wallet/walletprocesspsbt');
  const response = await fetch(path, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(psbt)
  });
  if (response.status !== 200) {
    console.log('Bitcoin address not known - is the network correct?');
  }
  const signedPsbt = await extractResponse(response);
  return signedPsbt;
}

export async function fetchTransaction(txid:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/tx/' + txid);
  const response = await fetchCatchErrors(path);
  //if (response.status !== 200) {
  // console.log('Bitcoin tx not known - is the network correct?');
  //}
  return await extractResponse(response);
}

export async function fetchTxOutProof(txs:string, blockhash:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/blocks/gettxoutproof/' + txs + '/' + blockhash);
  const response = await fetchCatchErrors(path);
  return await extractResponse(response);
}

export async function fetchBlock(blockhash:string, verbosity:number) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/blocks/block/' + blockhash + '/' + verbosity);
  const response = await fetchCatchErrors(path);
  return await extractResponse(response);
}

export async function fetchBlockHeader(blockhash:string, verbosity:boolean) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/blocks/block-header/' + blockhash + '/' + verbosity);
  const response = await fetchCatchErrors(path);
  return await extractResponse(response);
}

export async function fetchTransactionHex(txid:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/tx/' + txid + '/hex');
  const response = await fetchCatchErrors(path);
  if (response.status !== 200) {
    console.log('Bitcoin hex not known - is the network correct?');
  }
  return await extractResponse(response);
}

export async function fetchAddressTransactions(address:string) {
  if (!address || address.length < 5) return;
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/wallet/address/' + address + '/txs');
  const response = await fetchCatchErrors(path);
  if (response.status !== 200) {
    console.log('Bitcoin address not known - is the network correct?');
  }
  return await extractResponse(response);
}

export async function fetchUtxoSet(address:string) {
  if (!address || address.length < 5) return;
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/wallet/address/' + address + '/utxos?verbose=true');
  const response = await fetchCatchErrors(path);
  if (response.status !== 200) {
    console.log('Bitcoin address not known - is the network correct?');
  }
  return await extractResponse(response);
}

export async function fetchSbtcEvents() {
  try {
    const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/sbtc/events/0');
    const response = await fetchCatchErrors(path);
    return await extractResponse(response);
  } catch (err) {
    return [];
  }
}

export async function fetchSbtcWalletAddress() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/sbtc/wallet-address');
  const response = await fetchCatchErrors(path);
  return await extractResponse(response);
}

export async function fetchUserSbtcBalance(stxAddress:string) {
  try {
    checkAddressForNetwork(CONFIG.VITE_NETWORK, stxAddress)
    const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/sbtc/address/' + stxAddress + '/balance');
    const response = await fetch(path);
    return await extractResponse(response);
  } catch (err) {
    return { balance: 0 };
  }
}
export async function fetchUserBalances(adrds:AddressObject) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/sbtc/address/balances/' + adrds.stxAddress + '/' + adrds.cardinal + '/' + adrds.ordinal);
  const response = await fetch(path);
  if (response.status !== 200) {
    console.log('Bitcoin address not known - is the network correct?');
  }
  const res = await extractResponse(response);
  return res;
}

export async function sign(wrappedPsbt:WrappedPSBT) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/btc/tx/sign');
  const response = await fetch(path, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(wrappedPsbt)
  });
  let res:any;
  try {
    res = await response.json();
  } catch (err) {
    try {
      console.log(err)
      res = await response.text();
    } catch (err1) {
      console.log(err1)
    }
  }
  return res;
}