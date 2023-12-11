/**
 * sbtc - interact with Stacks Blockchain to read sbtc contract info
 */
import { PostConditionMode, uintCV, stringAsciiCV, bufferCVFromString, bufferCV, cvToJSON, deserializeCV, type ListCV, contractPrincipalCV, serializeCV } from '@stacks/transactions';
import { tupleCV } from '@stacks/transactions/dist/esm/clarity/index.js';
import { principalCV } from '@stacks/transactions/dist/esm/clarity/types/principalCV';
import { openContractCall } from '@stacks/connect';
import { getStacksNetwork } from './stacks_connect'
import { hex } from '@scure/base';
import { CONFIG } from '$lib/config';
import { sbtcConfig } from '$stores/stores';
import DaoUtils from '$lib/service/DaoUtils';
import { type DaoData, type FundingData, type GovernanceData, type ProposalContract, type ProposalData, type ProposalEvent, type SignalData, type SubmissionData, ProposalStage } from '$types/stxeco.type';

export enum EXTENSIONS {
  'ede000-governance-token', 
  'ede001-proposal-voting', 
  'ede002-threshold-proposal-submission', 
  'ede003-emergency-proposals', 
  'ede004-emergency-execute', 
  'ede005-dev-fund', 
  'ede006-treasury',
  'ede007-snapshot-proposal-voting-v5', 
  'ede008-funded-proposal-submission-v5',
  'ede009-governance-token-sale'
};

export const coordinators = [
  { stxAddress: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5', btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0' }, // devnet + electrum bob
  { stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // devnet + electrum bob
  { stxAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco staging + electrum bob
  { stxAddress: 'ST3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSPNET8TN', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco production + electrum bob
  { stxAddress: 'ST2BJA4JYFJ7SDMNFJZ9TJ3GB80P9Z80ADNF2R2AG', btcAddress: '' }, // coordinator
  { stxAddress: 'ST306HDPY54T81RZ7A9NGA2F03B8NRGW6Y59ZRZSD', btcAddress: '' }, // coordinator
  { stxAddress: 'ST3RBZ4TZ3EK22SZRKGFZYBCKD7WQ5B8FFRS57TT6', btcAddress: '' }, // coordinator
  { stxAddress: 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY', btcAddress: '' }, // coordinator
]

export function getCoordinator(address:string) {
	return coordinators.find((o) => o.stxAddress === address);
}

export function isCoordinator(address:string) {
	return coordinators.find((o) => o.stxAddress === address);
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

const trait = "{\"maps\":[],\"functions\":[{\"args\":[{\"name\":\"sender\",\"type\":\"principal\"}],\"name\":\"execute\",\"access\":\"public\",\"outputs\":{\"type\":{\"response\":{\"ok\":\"bool\",\"error\":\"uint128\"}}}}],\"variables\":[],\"fungible_tokens\":[],\"non_fungible_tokens\":[]}";
export async function getProposalsByTrait() {
  const url = CONFIG.VITE_STACKS_API + '/extended/v1/contract/by_trait?trait_abi=' + trait;
  let edaoProposals: string|any[] = [];
  let val;
  let response;
  let count = 0;
  try {
    do {
      response = await fetch(url + '&offset=' + (count * 20));
      val = await response.json();
      const ourProps = val.results.filter((o:any) => o.contract_id.indexOf('.edp') > -1);
      if (ourProps && ourProps.length > 0) edaoProposals = edaoProposals.concat(ourProps)
      count++;
    }
    while (val.results.length > 0)
  }
  catch (err) {
      console.log('callContractReadOnly4: ', err);
  }
  return edaoProposals;
}

export async function getProposalsForActiveVotingExt(votingContractId:string) {
  const url = CONFIG.VITE_STACKS_API + '/extended/v1/contract/' + votingContractId + '/events?limit=' + 20;
  const proposals: Array<ProposalEvent> = [];
  let val;
  let response;
  let count = 0;
  try {
    do {
      response = await fetch(url + '&offset=' + (count * 20));
      val = await response.json();
      for (const event of val.results) {
        const result = cvToJSON(deserializeCV(event.contract_log.value.hex));
        if (result.value.event.value === 'propose') {
          const proposalData = await getProposalData(result.value.proposal.value)
          const contract = await getProposalContract(result.value.proposal.value)
          const submissionData = await getSubmissionData(event.tx_id)
          const funding = await getFunding(submissionData.contractId, result.value.proposal.value)
          const signals = await getSignals(result.value.proposal.value)
          const executedAt = await getExecutedAt(result.value.proposal.value)
          proposals.push({
            event: 'propose',
            proposer: result.value.proposer.value,
            contractId: result.value.proposal.value,
            proposalData,
            contract,
            submitTxId: event.tx_id,
            proposalMeta: DaoUtils.getMetaData(contract.source),
            votingContract: event.contract_log.contract_id,
            submissionData,
            funding,
            signals,
            executedAt,
            stage: ProposalStage.PROPOSED
          })
        }
      }
      sbtcConfig.update((conf) => {
        conf.proposals = proposals
        if (!conf.daoData) conf.daoData = {} as DaoData
        return conf;
      })
      count++;
    }
    while (val.results.length > 0)
  }
  catch (err) {
      console.log('callContractReadOnly4: ', err);
  }
  return proposals;
}

export async function getProposalFromContractId(submissionContractId:string, proposalContractId:string):Promise<ProposalEvent|undefined> {
  const proposal:ProposalEvent|undefined = undefined;
  try {
    const contract = await getProposalContract(proposalContractId)
    const funding = await getFunding(submissionContractId, proposalContractId);
    let stage = ProposalStage.PARTIAL_FUNDING;
    if (funding.funding === 0) stage = ProposalStage.UNFUNDED
    const p = {
      contract,
      proposalMeta: DaoUtils.getMetaData(contract.source),
      contractId: proposalContractId,
      submissionData: { contractId: submissionContractId, transaction: undefined},
      signals: await getSignals(proposalContractId),
      stage,
      funding
    } as ProposalEvent
    sbtcConfig.update((conf) => {
      if (!conf.proposals) conf.proposals = []
      if (!conf.daoData) conf.daoData = {} as DaoData
      conf.proposals.push
      return conf;
    })
    return p
  } catch(err:any) {
    console.log(err)
  }
  return proposal
}

async function getProposalData(principle:string):Promise<ProposalData> {
  const functionArgs = [`0x${hex.encode(serializeCV(contractPrincipalCV(principle.split('.')[0], principle.split('.')[1] )))}`];
  const data = {
    contractAddress: CONFIG.VITE_DOA_DEPLOYER,
    contractName: CONFIG.VITE_DOA_SNAPSHOT_VOTING_EXTENSION,
    functionName: 'get-proposal-data',
    functionArgs,
  }
  const result = await callContractReadOnly(data);
  const pd = {
    concluded:Boolean(result.value.value.concluded.value),
    passed:Boolean(result.value.value.passed.value), 
    proposer:result.value.value.proposer.value,
    customMajority:Number(result.value.value['custom-majority'].value),
    endBlockHeight:Number(result.value.value['end-block-height'].value),
    startBlockHeight:Number(result.value.value['start-block-height'].value),
    votesAgainst:Number(result.value.value['votes-against'].value),
    votesFor:Number(result.value.value['votes-for'].value),
  }
  return pd;
}

export async function getGovernanceData(principle:string):Promise<GovernanceData> {
  try {
    const result = await getEdgTotalSupply();
    const result1 = await getEdgBalance(principle);
    const result2 = await getEdgLocked(principle);
    return {
      totalSupply: Number(result.totalSupply),
      userBalance: Number(result1.balance),
      userLocked: Number(result2.locked),
    }
  } catch (err:any) {
    return {
      totalSupply: 0,
      userBalance: 0,
      userLocked: 0,
    }
  }
}

async function getFunding(extensionCid:string, proposalCid:string):Promise<FundingData> {
  const functionArgs = [`0x${hex.encode(serializeCV(contractPrincipalCV(proposalCid.split('.')[0], proposalCid.split('.')[1] )))}`];
  const data = {
    contractAddress: extensionCid.split('.')[0],
    contractName: extensionCid.split('.')[1],
    functionName: 'get-proposal-funding',
    functionArgs,
  }
  let funding:string;
  try {
    funding = (await callContractReadOnly(data)).value;
  } catch (e) { funding = '0' }
  return {
    funding: Number(funding),
    parameters: await getFundingParams(extensionCid)
  }
}

async function getExecutedAt(principle:string):Promise<number> {
  const functionArgs = [`0x${hex.encode(serializeCV(contractPrincipalCV(principle.split('.')[0], principle.split('.')[1] )))}`];
  const data = {
    contractAddress: CONFIG.VITE_DOA_DEPLOYER,
    contractName: CONFIG.VITE_DOA,
    functionName: 'executed-at',
    functionArgs,
  }
  const result = await callContractReadOnly(data);
  try {
    return Number(result.value.value)
  } catch(err:any) {
    try {
      return Number(result.value)
    } catch(err:any) {
      return 0
    }
  }
}

async function getSignals(principle:string):Promise<SignalData> {
  const functionArgs = [`0x${hex.encode(serializeCV(contractPrincipalCV(principle.split('.')[0], principle.split('.')[1] )))}`];
  const data = {
    contractAddress: CONFIG.VITE_DOA_DEPLOYER,
    contractName: CONFIG.VITE_DOA_EMERGENCY_EXECUTE_EXTENSION,
    functionName: 'get-signals',
    functionArgs,
  }
  const result = (await callContractReadOnly(data)).value;
  return {
    signals: Number(result),
    parameters: await getEmergencyExecuteParams()
  }
}

async function getEmergencyExecuteParams():Promise<any> {
  return {
    executiveSignalsRequired: Number(await fetchDataVar(CONFIG.VITE_DOA_DEPLOYER,CONFIG.VITE_DOA_EMERGENCY_EXECUTE_EXTENSION, 'executive-signals-required') || 0),
    executiveTeamSunsetHeight: Number(await fetchDataVar(CONFIG.VITE_DOA_DEPLOYER,CONFIG.VITE_DOA_EMERGENCY_EXECUTE_EXTENSION, 'executive-team-sunset-height') || 0),
  }
}

export async function getFundingParams(extensionCid:string):Promise<any> {
  const functionArgs = [`0x${hex.encode(serializeCV(stringAsciiCV('funding-cost')))}`];
  const data = {
    contractAddress: extensionCid.split('.')[0],
    contractName: extensionCid.split('.')[1],
    functionName: 'get-parameter',
    functionArgs
  }
  const fundingCost = (await callContractReadOnly(data)).value.value;
  data.functionArgs = [`0x${hex.encode(serializeCV(stringAsciiCV('proposal-start-delay')))}`];
  const proposalStartDelay = (await callContractReadOnly(data)).value.value;
  data.functionArgs = [`0x${hex.encode(serializeCV(stringAsciiCV('proposal-duration')))}`];
  const proposalDuration = (await callContractReadOnly(data)).value.value;
  return {
    fundingCost: Number(fundingCost),
    proposalDuration: Number(proposalDuration),
    proposalStartDelay: Number(proposalStartDelay),
  }
}

export async function getSubmissionData(txId:string):Promise<SubmissionData> {
  const fundingTx = await getTransaction(txId)
  const pd = {
    contractId:fundingTx.contract_call.contract_id,
    transaction: { txid: fundingTx.tx_id, events: fundingTx.events, contract_call: fundingTx.contract_call }
  }
  return pd;
}

async function getProposalContract(principle:string):Promise<ProposalContract> {
  const url = CONFIG.VITE_STACKS_API + '/v2/contracts/source/' + principle.split('.')[0] + '/' + principle.split('.')[1] + '?proof=0';
  const response = await fetch(url)
  const val = await response.json();
  return val;
}

export async function isExecutiveTeamMember(stxAddress:string):Promise<{executiveTeamMember:boolean}> {
  const functionArgs = [`0x${hex.encode(serializeCV(principalCV(stxAddress)))}`];
  const data = {
    contractAddress: CONFIG.VITE_DOA_DEPLOYER,
    contractName: CONFIG.VITE_DOA_EMERGENCY_EXECUTE_EXTENSION,
    functionName: 'is-executive-team-member',
    functionArgs,
  }
  const result = (await callContractReadOnly(data)).value;
  return {
    executiveTeamMember: Boolean(result),
  }
}

export async function getEdgTotalSupply():Promise<{totalSupply:boolean}> {
  const functionArgs:Array<any> = [];
  const data = {
    contractAddress: CONFIG.VITE_DOA_DEPLOYER,
    contractName: 'ede000-governance-token',
    functionName: 'get-total-supply',
    functionArgs,
  }
  const result = (await callContractReadOnly(data)).value;
  return {
    totalSupply: Boolean(result),
  }
}

export async function getEdgBalance(stxAddress:string):Promise<{balance:boolean}> {
  const functionArgs = [`0x${hex.encode(serializeCV(principalCV(stxAddress)))}`];
  const data = {
    contractAddress: CONFIG.VITE_DOA_DEPLOYER,
    contractName: 'ede000-governance-token',
    functionName: 'edg-get-balance',
    functionArgs,
  }
  const result = (await callContractReadOnly(data)).value;
  return {
    balance: Boolean(result),
  }
}

export async function getEdgLocked(stxAddress:string):Promise<{locked:boolean}> {
  const functionArgs = [`0x${hex.encode(serializeCV(principalCV(stxAddress)))}`];
  const data = {
    contractAddress: CONFIG.VITE_DOA_DEPLOYER,
    contractName: 'ede000-governance-token',
    functionName: 'edg-get-locked',
    functionArgs,
  }
  const result = (await callContractReadOnly(data)).value;
  return {
    locked: Boolean(result),
  }
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

export async function fetchDataVar(contractAddress:string, contractName:string, dataVarName:string) {
  try {
    //checkAddressForNetwork(getConfig().network, contractAddress)
    const url = CONFIG.VITE_STACKS_API + '/v2/data_var/' + contractAddress + '/' + contractName + '/' + dataVarName;
    const response = await fetch(url);
    const result:any = await response.json();
    const val = cvToJSON(deserializeCV(result.data));
    return val.value
  } catch(err:any) {
    console.log('fetchUserBalances: stacksTokenInfo: ' + err.message + ' contractAddress: ' + contractAddress);
  }
}

export async function callContractReadOnly(data:any) {
  const url = CONFIG.VITE_STACKS_API + '/v2/contracts/call-read/' + data.contractAddress + '/' + data.contractName + '/' + data.functionName;
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

