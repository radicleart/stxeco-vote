import { CONFIG } from '$lib/config';
import { addNetSelector, extractResponse } from './bridge_api';

export async function getPoxInfo() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/info');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoxInfoForSoloStacker(btcAddress:string, cycle:number, stxAddress:string) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/solo-stacker/' + btcAddress + '/' + cycle + '/' + stxAddress);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getPoxInfoForPoolStacker(stxAddress:string, cycle:number) {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/pool-stacker/' + stxAddress + '/' + cycle);
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

