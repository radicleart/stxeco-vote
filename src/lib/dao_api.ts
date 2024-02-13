import { CONFIG } from '$lib/config';
import { addNetSelector, extractResponse } from './bridge_api';

export const NAKAMOTO_VOTE_START_HEIGHT = 829750 + 100
export const NAKAMOTO_VOTE_STOPS_HEIGHT = 833950

export async function getSummary() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/results/summary');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoolAndSoloAddresses() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/addresses');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoolAndSoloVotesByProposal(proposalCid:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/votes/' + proposalCid);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getDaoProposals() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/proposals');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function findDaoVotes() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/results/non-stackers');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [] ;
}

export async function findSoloVotes() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/results/solo-stackers');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [];
}

export async function findPoolVotes() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/results/pool-stackers');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [];
}

export async function getNftAssetClasses(stxAddress:string) {
  const url = CONFIG.VITE_BRIDGE_API + '/dao/nft/assets-classes/' + stxAddress;
  const path = addNetSelector(url);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getNftsbyPage(stxAddress:string, assetId:any, limit:number, offset:number) {
  const assetIdentifier = assetId?.contractAddress + '.' + assetId?.contractName + '::' + assetId?.assetName
  const url = CONFIG.VITE_BRIDGE_API + '/dao/nft/assets/' + stxAddress + '/' + assetIdentifier + '/' + limit + '/' + offset;
  const path = addNetSelector(url);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getDaoVotesByProposalAndVoter(proposal:string, stxAddress:string) {
  const url = CONFIG.VITE_BRIDGE_API + '/dao/voter/events/' + proposal + '/' + stxAddress;
  const path = addNetSelector(url);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}
