import type { PoxEntry } from '@mijoco/stx_helpers/dist';
import { extractResponse } from './dao_api';
import { getConfig } from '$stores/store_helpers';

export async function getPoxInfoByStacker(stxAddress:string, cycle:number) {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/stacker/${stxAddress}/${cycle}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getRewardSlotsByCycle(cycle:number) {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/reward-slots/${cycle}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}
export async function getPoxEntriesByCycle(cycle:number):Promise<Array<PoxEntry>> {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/pox-entries/${cycle}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function syncPoxEntriesByCycle(cycle:number):Promise<Array<PoxEntry>> {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/sync/pox-entries/${cycle}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function findPoxEntriesByAddress(bitcoinAddress:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/pox-entries/${bitcoinAddress}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [];
}

export async function findPoxEntriesByAddressAndCycle(bitcoinAddress:string,cycle:number) {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/pox-entries/${bitcoinAddress}/${cycle}`;
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res || [];
}

export async function findPoolStackerEventsByStacker(stacksAddress:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/stacker-events-by-stacker/${stacksAddress}`;
  const response = await fetch(path);
  return await response.json();
}

export async function findPoolStackerEventsByDelegator(stacksAddress:string) {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/stacker-events-by-delegator/${stacksAddress}`;
  const response = await fetch(path);
  return await response.json();
}

export async function findPoolStackerEventsByHashBytes(hashBytes:string, page:number, limit:number) {
  const path = `${getConfig().VITE_BRIDGE_API}/pox3/stacker-events-by-hashbytes/${hashBytes}/${page}/${limit}`;
  const response = await fetch(path);
  return await response.json();
}
