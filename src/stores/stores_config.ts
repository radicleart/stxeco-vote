import { writable } from 'svelte/store';
import { config } from '$lib/config';

const initialConfig = config.mainnet;

export const configStore = writable(initialConfig);

export function switchConfig(env:string) {
  configStore.set(config[env]);
}
export function setConfigByUrl(search:URLSearchParams) {
  const newNetwork = search.get('chain')
  if (newNetwork) {
    switchConfig(newNetwork)
  } else {
    switchConfig('devnet')
  }
}
