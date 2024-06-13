import { writable } from 'svelte/store';
import { config } from '$lib/config';

const initialConfig = config.local;

export const configStore = writable(initialConfig);

export function switchConfig(env:string) {
  configStore.set(config[env]);
}
