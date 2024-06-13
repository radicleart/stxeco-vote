import { get } from 'svelte/store';
import { configStore } from '$stores/stores_config';
import type { Config } from '$lib/config';
import type { SessionStore } from '$types/local_types';
import { sessionStore } from './stores';

export function getConfig(): Config {
  return get(configStore);
}

export function getSession(): SessionStore {
  return get(sessionStore);
}