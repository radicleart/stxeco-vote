import type { SbtcConfig } from '$types/sbtc_config';
import { CONFIG } from '$lib/config';
import * as btc from '@scure/btc-signer';
import { hex } from '@scure/base';
import { sendRawTransaction } from './bridge_api';
import type { Transaction } from '@scure/btc-signer' 

export let rates:Array<any>;

function finaliseTransaction(psbtHex:string) {
  try {
    const tx = btc.Transaction.fromPSBT(hex.decode(psbtHex));
    tx.finalize();
    return tx;
  } catch (err:any) {
    console.log('finalize error: ', err)
    let errorReason = 'Unable to create the transaction - this can happen if your wallet is connected to a different account to the one your logged in with. Try hitting the back button, switching account in the wallet and trying again?';
    errorReason += '<br/>' + err.message;
    throw new Error(errorReason);
  }
}

export async function broadcastTransaction(psbtHex:string):Promise<string> {
  const tx:Transaction = finaliseTransaction(psbtHex)
  const txHex = hex.encode(tx.extract());
	const resp = await sendRawTransaction({hex: txHex, maxFeeRate: 0 });
  console.log('resp.result:tx.id: ' + tx.id)
	if (resp && resp.tx) {
		return tx.id;
	} else if (resp.result && typeof resp.result === 'string') { // Transaction already in block chain
    console.log('resp.result: ' + resp.result)
		return tx.id;
	} else if (resp.error.code === -27) { // Transaction already in block chain
		return tx.id;
	} else {
    let message = 'Unable to broadcast - try reloading the page?'
    if (resp.error && resp.error.code) {
      message = message + ' ' + resp.error.code + ' : ' + resp.error.message
    } else if (resp.error)  {
      message = message + ' ' + resp.error
    }
		throw new Error(message);
	}
}

export function openWebSocket() {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  const socket = new WebSocket(CONFIG.VITE_BRIDGE_WS)
  socket.binaryType = "arraybuffer";

  // connected
  socket.addEventListener('open', function(event) {
    console.log('connected to ws server', event)
  })
  socket.addEventListener('message', async function(event) {
    rates =  JSON.parse(event.data)
    console.log('message', rates)
  })
}

export const defaultSbtcConfig:SbtcConfig = {
  loggedIn: false,
  userSettings: {
    useOpDrop: false,
    debugMode: false,
    currency: {
      cryptoFirst: false,
      myFiatCurrency: {
        _id: "nan",
        currency: "EUR",
        fifteen: 0,
        last: 0,
        buy: 0,
        sell: 0,
        symbol: "€",
        name: "Euro"
      },
      denomination: 'bitcoin'
    },
    executiveTeamMember: false
  },
  keySets: {},
  sbtcContractData: {
    coordinator: undefined,
    contractId: '',
    contractOwner: '',
    sbtcWalletAddress: '',
    sbtcWalletPublicKey: '',
    numKeys: undefined,
    numParties: undefined,
    tradingHalted: undefined,
    tokenUri: undefined,
    threshold: undefined,
    totalSupply: undefined,
    decimals: undefined,
    name: undefined,
    burnHeight: undefined
  },
  poxInfo: {
    contract_id: '',
    pox_activation_threshold_ustx: 0,
    first_burnchain_block_height: 0,
    current_burnchain_block_height: 0,
    prepare_phase_block_length: 0,
    reward_phase_block_length: 0,
    reward_slots: 0,
    rejection_fraction: 0,
    total_liquid_supply_ustx: 0,
    current_cycle: {
      id: 0,
      min_threshold_ustx: 0,
      stacked_ustx: 0,
      is_pox_active: false
    },
    next_cycle: {
      id: 0,
      min_threshold_ustx: 0,
      min_increment_ustx: 0,
      stacked_ustx: 0,
      prepare_phase_start_block_height: 0,
      blocks_until_prepare_phase: 0,
      reward_phase_start_block_height: 0,
      blocks_until_reward_phase: 0,
      ustx_until_pox_rejection: 0
    },
    min_amount_ustx: 0,
    prepare_cycle_length: 0,
    reward_cycle_id: 0,
    reward_cycle_length: 0,
    rejection_votes_left_required: 0,
    next_reward_cycle_in: 0,
  },
  stacksInfo: {
    burn_block_height: 0,
    server_version: '',
    network_id: 0,
    stacks_tip_height: 0
  }
}

