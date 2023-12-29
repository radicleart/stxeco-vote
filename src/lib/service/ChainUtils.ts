import { CONFIG } from '$lib/config';
import { standardPrincipalCV, uintCV } from '@stacks/transactions';

const precision = 1000000
const btcPrecision = 100000000

const ChainUtils = {
  hexToAscii(str1:string) {
    if (str1.startsWith('0x')) str1 = str1.substring(2);
    const hex  = str1.toString();
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  },
  network: () => {
    const network = CONFIG.VITE_NETWORK;
    if (network === 'mainnet') 'mainnet'; //return new StacksMainnet();
    else if (network === 'testnet') 'testnet'; //return new StacksTestnet();
    else return 'mocknet' // new StacksMocknet();
  },  
  getFromApi: async (path:string) => {
    const url = CONFIG.VITE_STACKS_API_HIRO + path;
    const response = await fetch(url);
    return response.json();
  },  
  postToDaoApi: async (path:string, data:unknown) => {
    const url = CONFIG.VITE_CLARITYLAB_API + '/daoapi' + path;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },  
  postToApi: async (path:string, data:unknown) => {
    const url = CONFIG.VITE_CLARITYLAB_API + path;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },  
  updateVoters: async () => {
    const url = CONFIG.VITE_CLARITYLAB_API + '/daoapi/v2/contract/events/recent';
    const response = await fetch(url);
    return response.json();
  },
  isValidAddress: function (addr: string) {
    try {
      standardPrincipalCV(addr)
      const network = CONFIG.VITE_NETWORK
      if (network === 'testnet' && addr.indexOf('ST') !== 0) return false
      if (network === 'mainnet' && addr.indexOf('SP') !== 0) return false
      return true
    } catch (err) {
      return false
    }
  },
  isValidAmount: function (amt: number) {
    try {
      uintCV(amt)
      return true
    } catch (err) {
      return false
    }
  },
  fromSatoshi: function (amount: number) {
    try {
      return Math.round(amount) / btcPrecision
    } catch {
      return 0
    }
  },
  fromOnChainAmount: function (amountMicroStx: number, gftPrecision?: number|undefined) {
    try {
      if (amountMicroStx === 0) return 0;
      if (!gftPrecision) gftPrecision = 6;
      const val = (Math.round(amountMicroStx) / 1000000).toFixed(6)
      const parts = val.split('.');
      return '<span class="text-warning">' + parts[0] + '</span>.<span class="part1">' + parts[1] + '</span>'
    } catch {
      return 0
    }
  },
  fromOnChainAmount1: function (amountMicroStx: number, gftPrecision?: number|undefined) {
    try {
      if (amountMicroStx === 0) return 0;
      if (!gftPrecision) gftPrecision = 6;
      //const val = (Math.round(amountMicroStx) / 1000000).toFixed(6)
      //const parts = val.split('.');
      return Math.floor((Math.round(amountMicroStx) / 1000000));
    } catch {
      return 0
    }
  },
  toOnChainAmount: function (amount: number, gftPrecision?: number|undefined) {
    try {
      if (!gftPrecision) {
        amount = amount * precision
        return amount; // Math.round(amount * precision) / precision
      } else {
        const newPrec = Math.pow(10, gftPrecision)
        amount = amount * newPrec
        return Math.round(amount * newPrec) / newPrec
      }
    } catch {
      return 0
    }
  },
  toDecimals: function (amount: number, precision: number) {
    if (!precision) precision = 100
    if (!amount) return
    if (typeof amount === 'string') {
      amount = Number(amount)
    }
    return Math.round(amount * precision) / precision // amount.toFixed(2)
  },
  fromMicroAmount: function (amountMicroStx: number) {
    if (amountMicroStx === 0) return 0;
    try {
      if (amountMicroStx === 0) return 0
      const val = Math.round(amountMicroStx) / (precision)
      return val
    } catch {
      return 0
    }
  },
  stringToHex: function (str: { length: number; charCodeAt: (arg0: number) => { (): any; new(): any; toString: { (arg0: number): any; new(): any } } }) {
    const arr = []
    for (let i = 0; i < str.length; i++) {
      arr[i] = (str.charCodeAt(i).toString(16)).slice(-4)
    }
    return '0x' + arr.join('')
  },
  callContractReadOnly: async (data:any) => {
      const url = CONFIG.VITE_STACKS_API_HIRO + '/v2/contracts/call-read/' + data.contractAddress + '/' + data.contractName + '/' + data.functionName
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: data.functionArgs,
          sender: data.contractAddress,
        })
      });
      const val = response.json();
      return val;
  }
}
export default ChainUtils
