import { CONFIG } from '$lib/config';
import { addNetSelector, extractResponse } from './bridge_api';


export async function getSbtcTransactionCounts():Promise<any> {
  const path = addNetSelector(CONFIG.VITE_REVEALER_API + '/transactions/count-revealer-transactions');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}
