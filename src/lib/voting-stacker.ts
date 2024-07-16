import { getConfig } from "$stores/store_helpers";

export async function readStackerEvents(proposalContract:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/stacker-voting/v1/read-stacker-votes/${proposalContract}`
  const response = await fetch(path);
  if (response.status === 404) return 'not found';
  const res = await response.json();
  return res;
}


