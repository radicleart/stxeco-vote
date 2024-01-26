import { CONFIG } from '$lib/config';
import { addNetSelector, extractResponse } from './bridge_api';

export async function getPoxInfo() {
  const path = addNetSelector(CONFIG.VITE_BRIDGE_API + '/pox/info');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

