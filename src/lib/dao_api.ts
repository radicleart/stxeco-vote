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

export async function getSummary() {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/results/summary`
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

export async function getTentativeProposals() {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/tentative-proposals`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getDaoProposals() {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/proposals`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function findDaoVotes() {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/results/non-stackers`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [] ;
}

export async function findSoloVotes() {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/results/solo-stackers`
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [];
}


export async function findPoolVotes() {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/results/pool-stackers`
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

export async function getDaoVotesByProposalAndVoter(proposal:string, stxAddress:string) {
  const url = `{getConfig().VITE_BRIDGE_API}/dao/v1/voter/events/${proposal}/${stxAddress}`;
  const response = await fetch(url);
  const res = await extractResponse(response);
  return res;
}

export async function getVoterEvents(stxAddress:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao/v1/voter/events/${stxAddress}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}
