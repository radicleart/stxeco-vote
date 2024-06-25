
import { AddressPurpose, BitcoinNetworkType, getAddress } from 'sats-connect'
import type { GetAddressOptions } from 'sats-connect'
import { isExecutiveTeamMember } from './admin';
import { getWalletBalances, type AddressObject, type ExchangeRate, type PoxInfo, type SbtcUserSettingI, type StacksInfo } from '@mijoco/stx_helpers/dist/index';
import { getTokenBalances, fetchStacksInfo, getPoxInfo, getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
import { getConfig, getSession } from '$stores/store_helpers';
import type { SessionStore } from '$types/local_types';
import { sessionStore } from '$stores/stores';
import { AppConfig, UserSession } from '@stacks/auth';
import { isLoggedIn } from '@mijoco/stx_helpers/dist/account';
import { fetchExchangeRates } from './dao_api';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig }); // we will use this export from other files

export const webWalletNeeded = false;
export const minimumDeposit = 10000
export const revealPayment = 10001

function getStacksAddress() {
	if (isLoggedIn()) {
		const userData = userSession.loadUserData();
		const stxAddress = (getConfig().VITE_NETWORK === 'testnet' || getConfig().VITE_NETWORK === 'devnet') ? userData.profile.stxAddress.testnet : userData.profile.stxAddress.mainnet;
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
	const network = getConfig().VITE_NETWORK
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
		if (getStacksNetwork(network).isMainnet()) myType = BitcoinNetworkType.Mainnet
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

export async function initAddresses() {
	const network = getConfig().VITE_NETWORK
	sessionStore.update((conf:SessionStore) => {
		if (!conf.keySets || !conf.keySets[network]) {
			if (network === 'testnet') {
				conf.keySets = { 'testnet': {} as AddressObject };
			} else if (network === 'devnet') {
				conf.keySets = { 'testnet': {} as AddressObject };
			} else {
				conf.keySets = { 'mainnet': {} as AddressObject };
			}
			conf.keySets[network] = {} as AddressObject;
		}
		return conf;
	});
}

export async function initApplication(userSettings?:SbtcUserSettingI) {
	const network = getConfig().VITE_NETWORK
	const stacksApi = getConfig().VITE_STACKS_API
	try {
		if (!userSettings) userSettings = {} as SbtcUserSettingI;
		const stacksInfo = await fetchStacksInfo(stacksApi) || {} as StacksInfo;
		const poxInfo = await getPoxInfo(stacksApi)
		const exchangeRates = await fetchExchangeRates();
		const settings = userSettings || defaultSettings()
		const rateNow = exchangeRates?.find((o:any) => o.currency === 'USD') || {currency: 'USD'} as ExchangeRate;
		
		settings.currency = {
			myFiatCurrency: rateNow || defaultExchangeRate(),
			cryptoFirst: true,
			denomination: 'USD'
		}
		const ss = getSession()
		sessionStore.update((conf:SessionStore) => {
			conf.stacksInfo = stacksInfo
			conf.poxInfo = poxInfo
			conf.loggedIn = userSession.isUserSignedIn();
			conf.exchangeRates = exchangeRates || [] as Array<ExchangeRate>;
			conf.userSettings = settings
			return conf;
		});

		if (isLoggedIn() ) {
			await addresses(async function(obj:AddressObject) {
				console.log('in callback')
				const emTeamMam = await isExecutiveTeamMember(obj.stxAddress);
				settings.executiveTeamMember = emTeamMam?.executiveTeamMember || false
				
				const contractId = getConfig().VITE_SBTC_CONTRACT_ID;
				obj.tokenBalances = await getTokenBalances(stacksApi, obj.stxAddress)
				obj.sBTCBalance = Number(obj.tokenBalances?.fungible_tokens[contractId + '::sbtc']?.balance || 0)
				obj.walletBalances = await getWalletBalances(getConfig().VITE_STACKS_API, getConfig().VITE_MEMPOOL_API, obj.stxAddress, ss.keySets[network].cardinal, ss.keySets[network].ordinal)

				sessionStore.update((conf:SessionStore) => {
					conf.loggedIn = userSession.isUserSignedIn();
					conf.keySets[getConfig().VITE_NETWORK] = obj
					conf.exchangeRates = exchangeRates || [] as Array<ExchangeRate>;
					conf.userSettings = settings
					return conf;
				});
			})
		}
	
	} catch (err:any) {
		sessionStorage.update((conf:SessionStore) => {
			conf.stacksInfo = {} as StacksInfo
			conf.poxInfo = {} as PoxInfo
			conf.loggedIn = userSession.isUserSignedIn();
			if (!conf.keySets || !conf.keySets[network]) {
				if (network === 'testnet'|| network === 'regtest') {
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
  