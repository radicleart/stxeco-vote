import type { PoxEntry } from '@mijoco/stx_helpers/dist';
import { addNetSelector, extractResponse } from './dao_api';
import { getConfig } from '$stores/store_helpers';

export async function getPoxInfoByStacker(stxAddress:string, cycle:number) {
  const path = addNetSelector(getConfig().VITE_BRIDGE_API + '/pox/stacker/' + stxAddress + '/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getRewardSlotsByCycle(cycle:number) {
  const path = addNetSelector(getConfig().VITE_BRIDGE_API + '/pox/reward-slots/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}
export async function getPoxEntriesByCycle(cycle:number):Promise<Array<PoxEntry>> {
  const path = addNetSelector(getConfig().VITE_BRIDGE_API + '/pox/pox-entries/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function syncPoxEntriesByCycle(cycle:number):Promise<Array<PoxEntry>> {
  const path = addNetSelector(getConfig().VITE_BRIDGE_API + '/pox/sync/pox-entries/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

