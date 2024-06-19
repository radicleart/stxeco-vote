import { PostConditionMode, uintCV, bufferCV, type ListCV, contractPrincipalCV } from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/esm/clarity/types/principalCV';
import { hex } from '@scure/base';
import type { GovernanceData, ProposalEvent } from '@mijoco/stx_helpers/dist/index';
import { showContractCall } from '@stacks/connect';
import { getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
import { getConfig } from '$stores/store_helpers';

export const coordinators = [
	{ stxAddress: 'SPSEBFRZZEZSHGRKRR1Z55RX5AWHER3CYM0H9BMW', btcAddress: '', }, // mitchel
  { stxAddress: 'ST2SACH111M97FZWN2Z8XMJ1FCKSJM3NGE35S6ZKN', btcAddress: 'xverse testnet' }, // devnet + electrum bob
  { stxAddress: 'SP2SACH111M97FZWN2Z8XMJ1FCKSJM3NGE37MGXAT', btcAddress: 'xverse mainnet' }, // devnet + electrum bob
  { stxAddress: 'SP2F0DP9Z3KSS0DABDBJN0DA0SHMCVWHXPVTH3PJJ', btcAddress: '' }, // devnet + electrum bob
  { stxAddress: 'ST3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNZN9J752', btcAddress: '' }, // devnet + electrum bob
  { stxAddress: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5', btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0' }, // devnet + electrum bob
  { stxAddress: 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT', btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0' }, // devnet + electrum bob
  { stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // devnet + electrum bob
  { stxAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco staging + electrum bob
  { stxAddress: 'ST3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSPNET8TN', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco production + electrum bob
  { stxAddress: 'STS4B251PP2HDR9M6TCRCMJ7S908H8GP9QNKJPAQ', btcAddress: '' }, // max
  { stxAddress: 'SP1PHAGEQ5RWM8G84DFGMRPENKQGFC4QJ9YWXAYKF', btcAddress: '' }, // acrossfire
  { stxAddress: 'ST306HDPY54T81RZ7A9NGA2F03B8NRGW6Y59ZRZSD', btcAddress: '' }, // coordinator
  { stxAddress: 'ST3RBZ4TZ3EK22SZRKGFZYBCKD7WQ5B8FFRS57TT6', btcAddress: '' }, // coordinator
  { stxAddress: 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY', btcAddress: '' }, // coordinator
  { stxAddress: 'SP1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28GBQA1W0F', btcAddress: '' }, // coordinator
	{ stxAddress: 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z', btcAddress: '', }, // marten
  { stxAddress: 'SPSEBFRZZEZSHGRKRR1Z55RX5AWHER3CYM0H9BMW', btcAddress: '', }, // mitchell
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
  await showContractCall({
    network: getStacksNetwork(getConfig().VITE_NETWORK),
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



export async function getProposalFromContractId(submissionContractId:string, proposalContractId:string):Promise<ProposalEvent|undefined> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/get-proposal-from-contract-id/${submissionContractId}/${proposalContractId}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function isExecutiveTeamMember(stxAddress:string):Promise<{executiveTeamMember:boolean}> {
  return (stxAddress && stxAddress === getConfig().VITE_DOA_DEPLOYER) ? {executiveTeamMember:true} : {executiveTeamMember:false}

  //const path = `${getConfig().VITE_BRIDGE_API}/dao/is-executive-team-member/${stxAddress}`;
  //const response = await fetch(path);
  //const res = await response.json();
  //return res;
}

export async function isExtension(extensionAddress:string):Promise<{result:boolean}> {
  if (!extensionAddress) return {result:false}
  const path = `${getConfig().VITE_BRIDGE_API}/dao/is-extension/${extensionAddress}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function getGovernanceData(principle:string):Promise<GovernanceData> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/get-governance-data/${principle}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function setCurrentProposal(contractId:string):Promise<any> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/set-current-proposal/${contractId}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function getCurrentProposal():Promise<any> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/get-current-proposal`;
  const response = await fetch(path);
  let res = await response.json();
  if (!res) {
    res = {
      configId: 1,
      contractId: getConfig().VITE_DOA_PROPOSAL
    }
  }

  return res;
}

export async function processProposalContracts(contractIds:string):Promise<any> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/sync/proposal/${contractIds}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function getTransaction(tx:string):Promise<any> {
  const url = getConfig().VITE_STACKS_API + '/extended/v1/tx/' + tx
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

