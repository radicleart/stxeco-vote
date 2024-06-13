
import { CONFIG } from '$lib/config';
import { c32address, c32addressDecode } from 'c32check';
import { AddressPurpose, BitcoinNetworkType, getAddress } from 'sats-connect'
import type { GetAddressOptions } from 'sats-connect'
import { isExecutiveTeamMember } from './admin';
import type { AddressObject, ExchangeRate, PoxInfo, SbtcUserSettingI, StacksInfo } from '@mijoco/stx_helpers/dist/index';
import { getStacksBalances, fetchExchangeRates, fetchStacksInfo, getPoxInfo, getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
import { getConfig, getSession } from '$stores/store_helpers';
import type { SessionStore } from '$types/local_types';
import { sessionStore } from '$stores/stores';
import { AppConfig, UserSession } from '@stacks/auth';
import { isLoggedIn } from '@mijoco/stx_helpers/dist/account';
import { getBitcoinBalances } from '@mijoco/stx_helpers/dist/custom-node';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig }); // we will use this export from other files

export const webWalletNeeded = false;
export const minimumDeposit = 10000
export const revealPayment = 10001

export function decodeStacksAddress(stxAddress:string) {
	if (!stxAddress) throw new Error('Needs a stacks address');
	const decoded = c32addressDecode(stxAddress)
	return decoded
}
  
export function encodeStacksAddress (network:string, b160Address:string) {
	let version = 26
	if (network === 'mainnet') version = 22
	const address = c32address(version, b160Address) // 22 for mainnet
	return address
}

export async function fetchSbtcBalance (conf:SessionStore, fromLogin:boolean|undefined) {
	const localKs = conf.keySets[CONFIG.VITE_NETWORK];
	if (!fromLogin && localKs	&& localKs.stxAddress && localKs.cardinal) { // && sessionStacks === localKs.stxAddress) {
		conf.keySets[CONFIG.VITE_NETWORK] = await getBalances(CONFIG.VITE_SBTC_CONTRACT_ID, localKs)
		sessionStore.update(() => conf);
		return conf;
	} else {
		await addresses(async function(addr:AddressObject) {
			if (addr) {
				conf.keySets[CONFIG.VITE_NETWORK] = await getBalances(CONFIG.VITE_SBTC_CONTRACT_ID, addr)
				sessionStore.update(() => conf);
			}
			return conf;
		});
	}
}
async function getBalances(contractId:string, addressObject:AddressObject):Promise<AddressObject> {
	let result:AddressObject;
	const tempSegwit0 = addressObject.btcPubkeySegwit0
	const tempSegwit1 = addressObject.btcPubkeySegwit1
	try {
		result = await getBitcoinBalances(getConfig().VITE_BRIDGE_API, addressObject.stxAddress, addressObject.cardinal, addressObject.ordinal);
		try {
			result.sBTCBalance = Number(result.stacksTokenInfo?.fungible_tokens[contractId + '::sbtc'].balance)
		} catch (err) {
			result.sBTCBalance = 0
		}
	} catch(err) {
		result = addressObject;
		console.log('Network down...');
	}
	if (!result.sBTCBalance) result.sBTCBalance = 0
	result.btcPubkeySegwit0 = tempSegwit0
	result.btcPubkeySegwit1 = tempSegwit1
	return result;
}
function getStacksAddress() {
	if (isLoggedIn()) {
		const userData = userSession.loadUserData();
		const stxAddress = (CONFIG.VITE_NETWORK === 'testnet' || CONFIG.VITE_NETWORK === 'devnet') ? userData.profile.stxAddress.testnet : userData.profile.stxAddress.mainnet;
		return stxAddress
	}
	return
}

function getProvider() {
	return {name: 'leather'}
	//if (!provider) provider = getStacksProvider()
	//const prod = (provider.getProductInfo) ? provider.getProductInfo() : undefined;
	//if (!prod) throw new Error('Provider not found')
	//return prod
}

export function isXverse() {
	const prov1 = (window as any).LeatherProvider //getProvider()
	const prov2 = (window as any).XverseProvider //getProvider()
	const xverse = getProvider().name.toLowerCase().indexOf('xverse') > -1
	return xverse
}

export function isHiro() {
	return getProvider().name.toLowerCase().indexOf('hiro') > -1
}

export function isAsigna() {
	return getProvider().name.toLowerCase().indexOf('asigna') > -1
}

export function isLeather() {
	return getProvider().name.toLowerCase().indexOf('leather') > -1
}

async function addresses(callback:any):Promise<AddressObject|undefined> {
	if (!isLoggedIn()) return {} as AddressObject;
	const userData = userSession.loadUserData();
	const network = CONFIG.VITE_NETWORK;
	//let something = hashP2WPKH(payload.public_keys[0])
	const stxAddress = getStacksAddress();
	let ordinal = 'unknown'
	let cardinal = 'unknown'
	let btcPubkeySegwit0 = 'unknown'
	let btcPubkeySegwit1 = 'unknown'

	try {
		if (!userData.profile.btcAddress) {
			// asigna
			callback({
				network,
				stxAddress,
				cardinal: 'unknown',
				ordinal: 'unknown',
				btcPubkeySegwit0: 'unknown',
				btcPubkeySegwit1: 'unknown',
				sBTCBalance: 0,
				stxBalance: 0
			});
		} else if (typeof userData.profile.btcAddress === 'string') {
			// xverse
			callback({
				network,
				stxAddress,
				cardinal: userData.profile.btcAddress,
				ordinal: 'unknown',
				btcPubkeySegwit0: 'unknown',
				btcPubkeySegwit1: 'unknown',
				sBTCBalance: 0,
				stxBalance: 0
			});
		} else {
			try {
				ordinal = userData.profile.btcAddress.p2tr.testnet
				cardinal = userData.profile.btcAddress.p2wpkh.testnet
				if (network === 'mainnet') {
					ordinal = userData.profile.btcAddress.p2tr.mainnet
					cardinal = userData.profile.btcAddress.p2wpkh.mainnet
				} else if (network === 'devnet') {
					ordinal = userData.profile.btcAddress.p2tr.regtest
					cardinal = userData.profile.btcAddress.p2wpkh.regtest
				} else if (network === 'signet') {
					ordinal = userData.profile.btcAddress.p2tr.signet
					cardinal = userData.profile.btcAddress.p2wpkh.signet
				}
				btcPubkeySegwit0 = userData.profile.btcPublicKey.p2wpkh
				btcPubkeySegwit1 = userData.profile.btcPublicKey.p2tr
			} catch(err:any) { 
				//
			}
	
			if (userData.profile.btcAddress) {
				callback({
					network,
					stxAddress,
					cardinal,
					ordinal,
					btcPubkeySegwit0,
					btcPubkeySegwit1,
					sBTCBalance: 0,
					stxBalance: 0
				});
			} else {
				callback({
					network,
					stxAddress,
					cardinal: 'unknown',
					ordinal: 'unknown',
					btcPubkeySegwit0: 'unknown',
					btcPubkeySegwit1: 'unknown',
					sBTCBalance: 0,
					stxBalance: 0
				});
			}
		}
	} catch(err:any) {
		console.log('addresses: ', err)
		let myType = BitcoinNetworkType.Testnet
		if (getStacksNetwork(getConfig().VITE_NETWORK).isMainnet()) myType = BitcoinNetworkType.Mainnet
		const getAddressOptions:GetAddressOptions = {
			payload: {
				purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
				message: 'Address for receiving Ordinals and payments',
				  network: {
					type: myType
				},
			},
			onFinish: (response:any) => {
				console.log(response)
				const obj = response.addresses;
				callback({
					network,
					stxAddress,
					cardinal: obj.find((o:any) => o.purpose === 'payment').address,
					ordinal: obj.find((o:any) => o.purpose === 'ordinals').address,
					btcPubkeySegwit0: obj.find((o:any) => o.purpose === 'payment').publicKey,
					btcPubkeySegwit1: obj.find((o:any) => o.purpose === 'ordinals').publicKey,
					sBTCBalance: 0,
					stxBalance: 0
				});
			},
			onCancel: () => {
				throw new Error('cancelled');
			}
		}
		await getAddress(getAddressOptions);
	}
}

export function appDetails() {
	return {
		name: 'stx.eco',
		icon: (window) ? window.location.origin + '/img/stx_eco_logo_icon_white.png' : '/img/stx_eco_logo_icon_white.png',
	}
}

export function makeFlash(el1:HTMLElement|null) {
	let count = 0;
	if (!el1) return;
	el1.classList.add("flasherize-button");
    const ticker = setInterval(function () {
		count++;
		if ((count % 2) === 0) {
			el1.classList.add("flasherize-button");
		}
		else {
			el1.classList.remove("flasherize-button");
		}
		if (count === 2) {
			el1.classList.remove("flasherize-button");
			clearInterval(ticker)
		}
	  }, 2000)
}

export function isLegal(routeId:string):boolean {
	try {
		if (userSession.isUserSignedIn()) return true;
		if (routeId.startsWith('http')) {
			if (routeId.indexOf('/deposit') > -1 || routeId.indexOf('/withdraw') > -1 || routeId.indexOf('/admin') > -1 || routeId.indexOf('/transactions') > -1) {
				return false;
			}
		} else if (['/deposit', '/withdraw', '/admin', '/transactions'].includes(routeId)) {
			return false;
		}
		return true;
	} catch (err) {
		return false
	}
}

const FORMAT = /[ `!@#$%^&*()_+=[\]{};':"\\|,<>/?~]/;

export function verifyStacksPricipal(stacksAddress?:string) {
	if (!stacksAddress) {
	  throw new Error('Address not found');
	} else if (FORMAT.test(stacksAddress)) {
	  throw new Error('please remove white space / special characters');
	}
	try {
	  const decoded = decodeStacksAddress(stacksAddress.split('.')[0]);
	  if ((CONFIG.VITE_NETWORK === 'testnet' || CONFIG.VITE_NETWORK === 'devnet') && decoded[0] !== 26) {
		throw new Error('Please enter a valid stacks blockchain testnet address');
	  }
	  if (CONFIG.VITE_NETWORK === 'mainnet' && decoded[0] !== 22) {
		throw new Error('Please enter a valid stacks blockchain mainnet address');
	  }
	  return stacksAddress;
	  } catch (err:any) {
		  throw new Error('Invalid stacks principal - please enter a valid ' + CONFIG.VITE_NETWORK + ' account or contract principal.');
	  }
}

export function verifyAmount(amount:number, balance:number) {
	if (!amount || amount === 0) {
		throw new Error('No amount entered');
	}
	if (amount >= balance) {
		throw new Error('Amount is greater than your balance');
	}
  	//if (amount < minimumDeposit) {
	//	throw new Error('Amount must be at least 0.0001 or 10,000 satoshis');
	//  }
}
export function verifySBTCAmount(amount:number, balance:number, fee:number) {
	if (!amount || amount === 0) {
		throw new Error('No amount entered');
	}
	if (amount > (balance - fee)) {
		throw new Error('No more then balance (less fee of ' + fee + ')');
	}
}

export async function initApplication(userSettings?:SbtcUserSettingI) {
	try {
		if (!userSettings) userSettings = {} as SbtcUserSettingI;
		const stacksInfo = await fetchStacksInfo(getConfig().VITE_STACKS_API) || {} as StacksInfo;
		const poxInfo = await getPoxInfo(getConfig().VITE_STACKS_API)
		const exchangeRates = await fetchExchangeRates(getConfig().VITE_STACKS_API);
		const settings = userSettings || defaultSettings()
		const rateNow = exchangeRates?.find((o:any) => o.currency === 'USD') || {currency: 'USD'} as ExchangeRate;
		
		
		settings.currency = {
			myFiatCurrency: rateNow || defaultExchangeRate(),
			cryptoFirst: true,
			denomination: 'USD'
		}
		let balances:any;
		const ss = getSession()
		if (isLoggedIn() && ss.keySets[getConfig().VITE_NETWORK].stxAddress ) {
			const emTeamMam = await isExecutiveTeamMember(ss.keySets[CONFIG.VITE_NETWORK].stxAddress);
			userSettings.executiveTeamMember = false;
			emTeamMam.executiveTeamMember
				balances = await getStacksBalances(getConfig().VITE_STACKS_API, ss.keySets[getConfig().VITE_NETWORK].stxAddress)
		}
	
		sessionStore.update((conf:SessionStore) => {
			conf.stacksInfo = stacksInfo
			conf.poxInfo = poxInfo
			conf.balances = balances
			conf.loggedIn = userSession.isUserSignedIn();
			if (!conf.keySets || !conf.keySets[getConfig().VITE_NETWORK]) {
				if (getConfig().VITE_NETWORK === 'testnet') {
					conf.keySets = { 'testnet': {} as AddressObject };
				} else if (getConfig().VITE_NETWORK === 'regtest') {
					conf.keySets = { 'regtest': {} as AddressObject };
				} else {
					conf.keySets = { 'mainnet': {} as AddressObject };
				}
			}
			conf.exchangeRates = exchangeRates || [] as Array<ExchangeRate>;
			conf.userSettings = settings
			return conf;
		});
	} catch (err:any) {
		sessionStorage.update((conf:SessionStore) => {
			conf.stacksInfo = {} as StacksInfo
			conf.poxInfo = {} as PoxInfo
			conf.loggedIn = userSession.isUserSignedIn();
			if (!conf.keySets || !conf.keySets[getConfig().VITE_NETWORK]) {
				if (getConfig().VITE_NETWORK === 'testnet'|| getConfig().VITE_NETWORK === 'regtest') {
					conf.keySets = { 'testnet': {} as AddressObject };
				} else {
					conf.keySets = { 'mainnet': {} as AddressObject };
				}
			}
			conf.exchangeRates = [] as Array<ExchangeRate>;
			conf.userSettings = {} as SbtcUserSettingI
			return conf;
		});
	}
}

function defaultSettings():SbtcUserSettingI {
	return {
		debugMode: false,
		executiveTeamMember: false,
		currency: {
		  cryptoFirst: true,
		  myFiatCurrency: defaultExchangeRate(),
		  denomination: 'USD',
		}
	}
}

function defaultExchangeRate():ExchangeRate {
	return {
		_id: '',
		currency: 'USD',
		fifteen: 0,
		last: 0,
		buy: 0,
		sell: 0,
		symbol: 'USD',
		name: 'BTCUSD'			  
	}
  }
  