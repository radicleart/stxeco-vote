import { PostConditionMode, uintCV, stringAsciiCV, bufferCVFromString, bufferCV, cvToJSON, deserializeCV, type ListCV, contractPrincipalCV, serializeCV } from '@stacks/transactions';
import { tupleCV } from '@stacks/transactions/dist/esm/clarity/index.js';
import { principalCV } from '@stacks/transactions/dist/esm/clarity/types/principalCV';
import { openContractCall } from '@stacks/connect';
import { getStacksNetwork } from './stacks_connect'
import { hex } from '@scure/base';
import { CONFIG } from '$lib/config';
import { addNetSelector, extractResponse } from './bridge_api';
import type { GovernanceData, ProposalEvent, SubmissionData } from '$types/stxeco.type';

export const coordinators = [
  
  { stxAddress: 'SP2F0DP9Z3KSS0DABDBJN0DA0SHMCVWHXPVTH3PJJ', btcAddress: '' }, // devnet + electrum bob
  { stxAddress: 'ST3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNZN9J752', btcAddress: '' }, // devnet + electrum bob
  { stxAddress: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5', btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0' }, // devnet + electrum bob
  { stxAddress: 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT', btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0' }, // devnet + electrum bob
  { stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // devnet + electrum bob
  { stxAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco staging + electrum bob
  { stxAddress: 'ST3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSPNET8TN', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco production + electrum bob
  { stxAddress: 'ST2BJA4JYFJ7SDMNFJZ9TJ3GB80P9Z80ADNF2R2AG', btcAddress: '' }, // coordinator
  { stxAddress: 'ST306HDPY54T81RZ7A9NGA2F03B8NRGW6Y59ZRZSD', btcAddress: '' }, // coordinator
  { stxAddress: 'ST3RBZ4TZ3EK22SZRKGFZYBCKD7WQ5B8FFRS57TT6', btcAddress: '' }, // coordinator
  { stxAddress: 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY', btcAddress: '' }, // coordinator
  { stxAddress: 'SP1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28GBQA1W0F', btcAddress: '' }, // coordinator
	{ stxAddress: 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z', btcAddress: '', }, // marten
]

export function getCoordinator(address:string) {
	return coordinators.find((o) => o.stxAddress === address);
}

export function isCoordinator(address:string) {
	return address && coordinators.find((o) => o.stxAddress === address);
}

export async function romeoMintTo(contractId:string, amount:number, stxAddress: string, btcTxid: string, height: number, merkleProofs: ListCV, txIndex:number, headerHex: string) {
  //data {addr: principal, key: (buff 33)}
  let stxAddressCV = principalCV(stxAddress);
  if (stxAddress.indexOf('.') > -1) {
    stxAddressCV = contractPrincipalCV(stxAddress.split('.')[0], stxAddress.split('.')[1]);
  }
  const functionArgs = [uintCV(amount), stxAddressCV, bufferCV(hex.decode(btcTxid)), uintCV(height), merkleProofs, uintCV(txIndex), bufferCV(hex.decode(headerHex))]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'mint',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
      return false
    }
  });
}

export async function mintTo(contractId:string, amount:number, stxAddress: string, btcTxid: string) {
  //data {addr: principal, key: (buff 33)}
  const btcAddressCV = stringAsciiCV(btcTxid);
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcAddressCV]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'mint',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function mintToMerkle(amount:number, stxAddress: string, btcTxid: string) {
  //data {addr: principal, key: (buff 33)}
  const contractId = CONFIG.VITE_SBTC_COORDINATOR + '.asset'
  
  const btcTxidCV = bufferCV(hex.decode(btcTxid))
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcTxidCV]

  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'mint',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function burnFrom(contractId:string, amount:number, stxAddress: string, btcTxid: string) {
  //data {addr: principal, key: (buff 33)}
  const btcAddressCV = stringAsciiCV(btcTxid);
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcAddressCV]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Allow,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'burn',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function getProposalFromContractId(submissionContractId:string, proposalContractId:string):Promise<ProposalEvent|undefined> {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/get-proposal-from-contract-id/' + submissionContractId + '/' + proposalContractId);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function isExecutiveTeamMember(stxAddress:string):Promise<{executiveTeamMember:boolean}> {
  return (stxAddress && stxAddress === CONFIG.VITE_DOA_DEPLOYER) ? {executiveTeamMember:true} : {executiveTeamMember:false}

  /**
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/is-executive-team-member/' + stxAddress);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
   */
}

export async function isExtension(extensionAddress:string):Promise<{result:boolean}> {
  if (!extensionAddress) return {result:false}
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/is-extension/' + extensionAddress);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getGovernanceData(principle:string):Promise<GovernanceData> {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/get-governance-data/' + principle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function setCurrentProposal(contractId:string):Promise<any> {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/set-current-proposal/' + contractId);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getCurrentProposal():Promise<any> {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/get-current-proposal');
  const response = await fetch(path);
  let res = await extractResponse(response);
  if (!res) {
    res = {
      configId: 1,
      contractId: CONFIG.VITE_DOA_PROPOSAL
    }
  }

  return res;
}

export async function processProposalContracts(contractIds:string):Promise<any> {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/sync/proposal/' + contractIds);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getTransaction(tx:string):Promise<any> {
  const url = CONFIG.VITE_STACKS_API + '/extended/v1/tx/' + tx
  let val;
  try {
      const response = await fetch(url)
      val = await response.json();
  }
  catch (err) {
      console.log('getTransaction: ', err);
  }
  return val;
}

export async function callContractReadOnly(data:any) {
  const url = CONFIG.VITE_STACKS_API_HIRO + '/v2/contracts/call-read/' + data.contractAddress + '/' + data.contractName + '/' + data.functionName;
  let val;
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              arguments: data.functionArgs,
              sender: data.contractAddress,
          })
      });
      val = await response.json();
  }
  catch (err) {
      console.log('callContractReadOnly4: ', err);
  }
  const result = cvToJSON(deserializeCV(val.result));
  return result;
}

export async function setCoordinator(contractId:string, address:string) {
  //data {addr: principal, key: (buff 33)}
  const datum = tupleCV({
    addr: principalCV(address),
    key: bufferCVFromString('33 max byte buffer')
  });

  const functionArgs = [datum]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'set-coordinator-data',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function setsBTCPublicKey(contractId:string, publicKey:string) {
  const datum = bufferCV(hex.decode(publicKey))
  const functionArgs = [datum]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: contractId.split('.')[0],
    contractName: contractId.split('.')[1],
    functionName: 'set-bitcoin-wallet-public-key',
    functionArgs: functionArgs,
    onFinish: async (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}




