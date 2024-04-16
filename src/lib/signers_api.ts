import { CONFIG } from '$lib/config';
import { addNetSelector, extractResponse, headers } from './bridge_api';


export async function getMiningAggregates():Promise<any> {
  const path = addNetSelector(CONFIG.VITE_POX4_API + '/mining/aggregate-data');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getRecentSigners():Promise<any> {
  const path = addNetSelector(CONFIG.VITE_POX4_API + '/signers/get-recent-signers');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function getSignerSlots():Promise<any> {
  const path = addNetSelector(CONFIG.VITE_POX4_API + '/signers/stackerdb-get-signer-slots-page');
  const response = await fetch(path);
  const res = await extractResponse(response);
  return res;
}

export async function verifySignerKeySig(authData:any):Promise<any> {
  const path = addNetSelector(CONFIG.VITE_POX4_API + '/signers/verify-signer-key-sig');
  const response = await fetch(path, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(authData)
  });
  const res = await extractResponse(response);
  return res;
}

