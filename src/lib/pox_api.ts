import { CONFIG } from '$lib/config';
import type { PoxEntry } from '$types/pox_types';
import { addNetSelector, extractResponse } from './bridge_api';

export async function getPoxInfo() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/info');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoxInfoByRewardSlot(btcAddress:string, cycle:number, stxAddress:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/solo-stacker/' + btcAddress + '/' + cycle + '/' + stxAddress);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getStackerInfo(address:string, cycle:number) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/stacker-info/' + address + '/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getStackerInfoLatest(address:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/stacker-info/' + address);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getRewardSlots(offset:number, limit:number, address:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/reward-slots/' + address + '/' + offset + '/' + limit);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoxInfoByStacker(stxAddress:string, cycle:number) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/stacker/' + stxAddress + '/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoxEntryByCycleAndIndex(cycle:number, index:number) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/pox-entry/' + cycle + '/' + index);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getRewardSlotsByCycle(cycle:number) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/reward-slots/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}
export async function getPoxEntriesByCycle(cycle:number):Promise<Array<PoxEntry>> {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/pox-entries/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function syncPoxEntriesByCycle(cycle:number):Promise<Array<PoxEntry>> {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/sync/pox-entries/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

