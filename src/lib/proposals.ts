import type { ProposalEvent } from '@mijoco/stx_helpers/dist/index';
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

export function isCoordinator(address:string) {
	return address && coordinators.find((o) => o.stxAddress === address);
}


export async function getProposalFromContractId(submissionContractId:string, proposalContractId:string):Promise<ProposalEvent|undefined> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/get-proposal-from-contract-id/${submissionContractId}/${proposalContractId}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function isExecutiveTeamMember(stxAddress:string):Promise<{executiveTeamMember:boolean}> {
  return (stxAddress && stxAddress === getConfig().VITE_DOA_DEPLOYER) ? {executiveTeamMember:true} : {executiveTeamMember:false}

  //const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/is-executive-team-member/${stxAddress}`;
  //const response = await fetch(path);
  //const res = await response.json();
  //return res;
}

export async function isExtension(extensionAddress:string):Promise<{result:boolean}> {
  if (!extensionAddress) return {result:false}
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/is-extension/${extensionAddress}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function setCurrentProposal(contractId:string):Promise<any> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/set-current-proposal/${contractId}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

export async function getCurrentProposal():Promise<any> {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/get-current-proposal`;
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
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/sync/proposal/${contractIds}`;
  const response = await fetch(path);
  const res = await response.json();
  return res;
}

