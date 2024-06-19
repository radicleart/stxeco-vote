import { persisted } from 'svelte-local-storage-store'
import type { DaoStore } from '$types/local_types';
import type { SoloPoolData } from '@mijoco/stx_helpers/dist/index';

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/
export const daoStore = persisted('daoStore', {
    proposals: [],
    soloPoolData: {} as SoloPoolData,
    currentProposal: undefined
} as DaoStore);
