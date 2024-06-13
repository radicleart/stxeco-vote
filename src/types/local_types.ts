import type { AddressObject, InFlight, ExchangeRate, PoxInfo, ProposalEvent, SbtcUserSettingI, SoloPoolData, StacksBalance, StacksInfo, ExtensionType } from "@mijoco/stxeco_types";

export type SessionStore = {
  name: string;
  loggedIn: boolean,
  balances?: StacksBalance,
  keySets: { [key: string]: AddressObject; };
  userSettings:SbtcUserSettingI;
  poxInfo:PoxInfo,
  exchangeRates: Array<ExchangeRate>
  stacksInfo: StacksInfo;
};


export type DaoStore = {
  proposals: Array<ProposalEvent>;
  extensions?: Array<ExtensionType>;
  soloPoolData: SoloPoolData,
  daoData?:InFlight;
  currentProposal?: {configId:string, contractId:string}
};


