import { getConfig } from '$stores/store_helpers';

export const NAKAMOTO_VOTE_START_HEIGHT = 829750 + 100
export const NAKAMOTO_VOTE_STOPS_HEIGHT = 833950

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

export async function fetchExchangeRates() {
  const path = `${getConfig().VITE_BRIDGE_API}/rates/v1/tx/rates`;
  try {
    const response = await fetch(path);
    const res = await response.json();
    return res;
  } catch(err) {
    return undefined;
  }
}

export async function getSummary(proposal:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/stacker-voting/v1/results/summary/${proposal}`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoolAndSoloAddresses() {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/addresses`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoolAndSoloVotesByProposal(proposalCid:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/votes/${proposalCid}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getBaseDaoEnabledExtensionEvents(daoContract:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/get-extensions/${daoContract}`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function readBaseDaoEvents(daoContract:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/read-events-base-dao/${daoContract}`
  try {
    const response = await fetch(path);
    const res = await extractResponse(response);
    return res;
  } catch(err:any) {
    return
  }
}

export async function getExtensions(daoContract:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/get-extensions/${daoContract}`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function findDaoVotes(proposalId:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao-voting/v1/proposal/votes/${proposalId}`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [] ;
}

export async function findSoloVotes(proposalId:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/results/solo-stackers/${proposalId}`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [];
}


export async function findPoolVotes(proposalId:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/results/pool-stackers/${proposalId}`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [];
}

export async function getNftAssetClasses(stxAddress:string) {
  const url = `${getConfig().VITE_BRIDGE_API}/dao/v1/nft/assets-classes/${stxAddress}`;
  const response = await fetch(url);
  const res = await extractResponse(response);
  return res;
}

export async function getNftsbyPage(stxAddress:string, assetId:any, limit:number, offset:number) {
  const assetIdentifier = `${assetId?.contractAddress}.${assetId?.contractName}::${assetId?.assetName}`
  const url = `${getConfig().VITE_BRIDGE_API}/dao/v1/nft/assets/${stxAddress}/${assetIdentifier}/${limit}/${offset}`;
  const response = await fetch(url);
  const res = await extractResponse(response);
  return res;
}

