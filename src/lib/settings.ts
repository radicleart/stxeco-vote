import { writable, get } from 'svelte/store';
import ChainUtils from '$lib/service/ChainUtils';
import type { ProposalEvent } from "$types/stxeco.type";
import DaoUtils from '$lib/service/DaoUtils';
import { CONFIG } from './config';

function createStore() {
  const initialValue:SettingsType = {
    extensions: undefined
  };
  // destructure the store on creation to have 'direct access' to methods
  const { subscribe, update, set } = writable(initialValue);

  return {
    subscribe,

    async init(stxAddress:string|undefined) {
      let url = CONFIG.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data';
      if (stxAddress) {
        url = CONFIG.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data/' + stxAddress
      }
      const res = await fetch(url);
      const daoData = await res.json();
      daoData.proposals = daoData.proposals.filter((p:ProposalType) => p.contract.tx_status !== 'failed')
      const stacksTipHeight = daoData.info?.stacks_tip_height || 0;
      daoData.proposals.forEach((proposal:ProposalEvent) => {
        DaoUtils.setStatus(stacksTipHeight, proposal);
        // console.log(proposal.contractId + ' -> ' + proposal.status.name)
      })
      daoData.extensions = [];
      //const keys = Object.keys(CONFIG.VITE_EXTENSIONS)
      CONFIG.VITE_EXTENSIONS.forEach((key) => {
        daoData.extensions.push(key)
      })
      
      if (stxAddress) {
        const res = await ChainUtils.getFromApi('/v2/accounts/' + stxAddress);
        res.balance = ChainUtils.fromMicroAmount(res.balance);
        res.locked = ChainUtils.fromMicroAmount(res.locked);
        daoData.accountInfo = res;
        //fetchNamesByAddress({ url: CONFIG.VITE_STACKS_API_HIRO, blockchain: "stacks", address: stxAddress }).then((result) => {
        //  daoData.accountInfo.bnsName = result && result.names && result.names[0];
        //})
      }

      if (res.ok) set(daoData);
    },

    changeSetting(key: string, value: SettingsType) {
      if (!key) return;
      let storeValue: SettingsType = get(this);
      storeValue = value;
      update(() => storeValue);
    }
  };
}

export default createStore();
