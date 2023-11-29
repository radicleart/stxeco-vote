import type { BridgeTransactionType, SbtcContractDataType, AddressObject, KeySet, ExchangeRate, AuthorisationDataType, DepositPayloadUIType, WithdrawPayloadUIType } from 'sbtc-bridge-lib' 

export type SbtcConfig = {
  proposals?: Array<ProposalEvent>;
  exchangeRates?: Array<ExchangeRate>;
  pegInMongoId?: string;
  pegOutMongoId?: string;
  btcFeeRates?: any;
  loggedIn: boolean;
  authHeader?:AuthorisationDataType|undefined;
  keySets: { [key: string]: AddressObject; };
  stxAddress?: string;
  sigData:any;
  pegIn:boolean;
  peginRequest?:BridgeTransactionType;
  userSettings:SbtcUserSettingI;
  sbtcContractData: SbtcContractDataType;
  revealFeeWithGas: number;
  payloadDepositData: DepositPayloadUIType;
  payloadWithdrawData: WithdrawPayloadUIType;
};

export type SbtcUserSettingI = {
  peggingIn: boolean;
  useOpDrop: boolean;
  debugMode: boolean;
  testAddress?: string;
  currency: {
    cryptoFirst: boolean;
    myFiatCurrency: ExchangeRate;
    denomination: string;
  }
}

export type ProposalEvent = {event:string, proposer:string,  proposal:string}