import { getConfig } from "$stores/store_helpers";

export async function getDaoVotesByProposalAndVoter(proposal:string, stxAddress:string) {
  const url = `{getConfig().VITE_BRIDGE_API}/dao-voting/v1/votes/${proposal}/${stxAddress}`;
  const response = await fetch(url);
  if (response.status === 404) return [];
  const res = await response.json();
  return res;
}

export async function getDaoVotesByVoter(stxAddress:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao-voting/v1/votes/${stxAddress}`;
  const response = await fetch(path);
  if (response.status === 404) return [];
  const res = await response.json();
  return res;
}

export async function getDaoSummary(proposal:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao-voting/v1/summary/${proposal}`;
  const response = await fetch(path);
  if (response.status === 404) return [];
  const res = await response.json();
  return res;
}

export async function readVotingContractEvents(genesis:boolean, daoContract:string, votingContract:string|undefined) {
  const path = `${getConfig().VITE_BRIDGE_API}/dao-voting/v1/read-votes/${genesis}/${daoContract}/${votingContract}`
  const response = await fetch(path);
  if (response.status === 404) return 'not found';
  const res = await response.json();
  return res;
}

