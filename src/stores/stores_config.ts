import { writable } from 'svelte/store';
import { config } from '$lib/config';

const initialConfig = config.mainnet;

export const configStore = writable(initialConfig);

export function switchConfig(env:string) {
  configStore.set(config[env]);
}
export function setConfigByUrl(search:URLSearchParams) {
  let network = 'mainnet'
  if (search.has('chain')) {
      network = search.get('chain') || 'mainnet'
  }
  switchConfig(network)
}
