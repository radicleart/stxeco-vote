import { getConfig } from "$stores/store_helpers";

export async function readSoloEvents(proposalContract:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/stacker-voting/v1/read-solo-votes/${proposalContract}`
  const response = await fetch(path);
  if (response.status === 404) return 'not found';
  const res = await response.json();
  return res;
}

export async function readPoolEvents(proposalContract:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/stacker-voting/v1/read-pool-votes/${proposalContract}`
  const response = await fetch(path);
  if (response.status === 404) return 'not found';
  const res = await response.json();
  return res;
}

