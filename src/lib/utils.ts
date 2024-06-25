import * as btc from '@scure/btc-signer';
import * as secp from '@noble/secp256k1';
import { getConfig } from '$stores/store_helpers';
import type { AddressMempoolObject, SbtcClarityEvent } from '@mijoco/stx_helpers';

export const COMMS_ERROR = 'Error communicating with the server. Please try later.'
export const smbp = 900
export const xsbp = 700

export function getRouterInfo(routeId:string) {
  const links = getConfig().VITE_HEADER_LINKS;
  const link = links.find((o) => routeId === o.name)
  return link;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
  // These options are needed to round to whole numbers if that's what you want.
  // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

const btcPrecision = 100000000
const stxPrecision = 1000000

export function bitcoinToSats(amountBtc:number) {
  return  Math.round(amountBtc * btcPrecision)
}

export function fmtSatoshiToBitcoin(amountSats:number) {
  return  (Math.round(amountSats) / btcPrecision).toFixed(8)
}

export function satsToBitcoin(amountSats:number):number {
  return  Number((Math.round(amountSats) / btcPrecision).toFixed(8))
}

export function userSatBtc(amount:number, denomination:string):number {
  if (denomination === 'bitcoin') {
    if (amount.toString().indexOf('.') === -1) {
      return  Number((Math.round(amount) / btcPrecision).toFixed(8))
    }
    return  amount
  } else {
    return  bitcoinToSats(amount)
  }
}

export function fmtMicroToStx(amountStx:number) {
  return  (Math.round(amountStx) / stxPrecision).toFixed(6)
}

export function tsToTime(updated:number|undefined) {
  let d = new Date();
  if (updated) d = new Date(updated);
  //return d.toLocaleDateString('en-UK');
  return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

export function tsToDate(updated:number|undefined) {
  let d = new Date();
  if (updated) d = new Date(updated);
  return d.toLocaleDateString('en-UK');
  //return d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear();
}

export function isSupported(address:string) {
  const network = getConfig().VITE_NETWORK;
  const msg = 'Please enter a valid ' + network + ' bitcoin address.'
  if (!address || address.length < 10) {
    throw new Error(msg);
  }
  const net = (network === 'testnet') ? btc.TEST_NETWORK : btc.NETWORK;
  const obj = btc.Address(net).decode(address);
  if (obj.type !== 'tr' && obj.type !== 'wpkh' && obj.type !== 'wsh') throw new Error(msg)
  return true;
  /**
  if (obj.type === 'pk') {
    throw new Error('Legacy addresses are not supported in the current version. ' + msg);
  }
  if (obj.type === 'ms' || obj.type === 'tr_ms') {
    throw new Error('Multisig addresses are not supported in the current version. ' + msg);
  }
  if (obj.type === 'pkh' || obj.type === 'sh') {
    // classis non segwit
    valid = true;
  }
  if (obj.type === 'wpkh' || obj.type === 'wsh' || obj.type === 'tr') {
    // segwit
    valid = true;
  }
  if (!valid) {
    throw new Error('Addresses is neither a classic (p2pkh/p2sh) or segwit (p2wpkh/p2wsh) or taproot address. ' + msg);
  }
  return valid;
   */
}

export function getNet() {
  return (getConfig().VITE_NETWORK === 'testnet') ? btc.TEST_NETWORK : btc.NETWORK
  //if (network === 'litecoin') return { pubKeyHash: 0x30, scriptHash: 0x32 };
  //if (network === 'testnet') return { bech32: 'tb', pubKeyHash: 0x6f, scriptHash: 0xc4 };
  //if (network === 'regtest') return { bech32: 'bcrt', pubKeyHash: 0x6f, scriptHash: 0xc4 };
}
export function explorerAddressUrl(addr:string) {
  let url = getConfig().VITE_STACKS_EXPLORER + '/address/' + addr + '?chain=' + getConfig().VITE_NETWORK;
  if (getConfig().VITE_ENVIRONMENT === 'nakamoto') {
    url += '&api=https://api.nakamoto.testnet.hiro.so'
  }
	return url
}
export function explorerBtcTxUrl(txid:string|undefined) {
  if (!txid) return '?';
  if (txid.startsWith('0x')) txid = txid.split('x')[1]
	return getConfig().VITE_BSTREAM_EXPLORER + '/tx/' + txid;
}

export function explorerBtcAddressUrl(address:string|undefined) {
  if (!address) return ''
	return getConfig().VITE_BSTREAM_EXPLORER + '/address/' + address;
}
export function explorerTxUrl(txid:string) {
	return getConfig().VITE_STACKS_EXPLORER + '/txid/' + txid + '?chain=' + getConfig().VITE_NETWORK;
}

export function bitcoinBalanceFromMempool(addressMempoolObject:AddressMempoolObject|undefined) {
  if (!addressMempoolObject) return 0;
   return addressMempoolObject.chain_stats.funded_txo_sum - addressMempoolObject.chain_stats.spent_txo_sum
}

export function fmtAmount(amount:number, currency:string) {
  if (currency === 'stx') {
    return formatter.format(amount).replace('$', '') // &#931;
  }
}

export function fmtNumberStacksFloor(amount:number|undefined) {
  if (!amount || amount === 0) return 0;
  return fmtNumber(Math.floor(Number(fmtMicroToStx(amount))))
}

export function fmtNumber(amount:number|undefined) {
  if (amount === 0) return '0';
  if (amount) return new Intl.NumberFormat().format(amount);
}

export function truncate(stringy?:string, amount?:number) {
  if (!stringy) return '?';
  if (!amount) amount = 4;
  return stringy.substring(0, amount) + '...' + stringy.substring(stringy.length - amount);
}

export function truncateEnd(stringy?:string, amount?:number) {
  if (!stringy) return '?';
  if (!amount) amount = 4;
  return '..' + stringy.substring(stringy.length - amount);
}

const priv = secp.utils.randomPrivateKey()
export const keySetForFeeCalculation = {
  priv,
  ecdsaPub: secp.getPublicKey(priv, true),
  schnorrPub: secp.getPublicKey(priv, false)
}

export function compare( a:SbtcClarityEvent, b:SbtcClarityEvent ) {
  if (!a.payloadData.burnBlockHeight || !b.payloadData.burnBlockHeight) return 0
  if ( a.payloadData.burnBlockHeight < b.payloadData.burnBlockHeight || 0 ){
    return 1;
  }
  if ( a.payloadData.burnBlockHeight > b.payloadData.burnBlockHeight ){
    return -1;
  }
  return 0;
}
export function compareCurrencies( a:{ value: string; name: string; }, b:{ value: string; name: string; } ) {
  if ( a.value < b.value ){
    return -1;
  }
  if ( a.value > b.value ){
    return 1;
  }
  return 0;
}

export function downloadCsv (data:any, filename:string) {
  // Creating a Blob for having a csv file format  
  // and passing the data with type 
  const blob = new Blob([data], { type: 'text/csv' }); 
  // Creating an object for downloading url 
  const url = window.URL.createObjectURL(blob) 
  // Creating an anchor(a) tag of HTML 
  const a = document.createElement('a') 
  // Passing the blob downloading url  
  a.setAttribute('href', url) 
  // Setting the anchor tag attribute for downloading 
  // and passing the download file name 
  a.setAttribute('download', filename); 
  // Performing a download with click 
  a.click() 
  return data
}

export function csvMaker(inputData:Array<any>, fileName:string) {

  // Empty array for storing the values 
  const csvRows = []; 
  // Headers is basically a keys of an object 
  // which is id, name, and profession 
  const headers = Object.keys(inputData[0]); 
  // As for making csv format, headers must 
  // be separated by comma and pushing it 
  // into array 
  csvRows.push(headers.join(',')); 
  // Pushing Object values into array 
  // with comma separation 
  for (const vote of inputData) {
    csvRows.push(Object.values(vote).join(','))
  }
  // Returning the array joining with new line  
  const data = csvRows.join('\n')
  downloadCsv(data, fileName)
} 

