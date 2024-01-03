import { CONFIG } from '$lib/config';
import { addNetSelector, extractResponse } from './bridge_api';

export async function getAddresses() {
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

export async function getSoloVotesByProposal() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/proposals');
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

export async function getDaoVotesByProposal(contractId:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/dao/voter/events-proposal/' + contractId);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
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
