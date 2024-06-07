import type { SbtcContractDataType, AddressObject, ExchangeRate, AuthorisationDataType } from 'sbtc-bridge-lib' 
import type { DaoData, GovernanceData, ProposalEvent } from './stxeco.type';
import type { SoloPoolData } from './stxeco_stacker_type';
import type { PoxInfo } from './pox_types';
import type { VerifySignerKey } from './signer_types';

export type SbtcConfig = {
  daoData?: DaoData;
  proposals?: Array<ProposalEvent>;
  currentProposal?:any;
  soloPoolData?: SoloPoolData;
  exchangeRates?: Array<ExchangeRate>;
  btcFeeRates?: any;
  loggedIn: boolean;
  authHeader?:AuthorisationDataType|undefined;
  keySets: { [key: string]: AddressObject; };
  stxAddress?: string;
  userSettings:SbtcUserSettingI;
  sbtcContractData: SbtcContractDataType;
  poxInfo:PoxInfo,
  signerSignature: VerifySignerKey;
  stacksInfo: {
    burn_block_height: number;
    server_version: string;
    network_id: number;
    stacks_tip_height: number;
  };
};

export type SbtcUserSettingI = {
  executiveTeamMember: boolean;
  govTokens?: GovernanceData;
  debugMode: boolean;
  testAddress?: string;
  currency: {
    cryptoFirst: boolean;
    myFiatCurrency: ExchangeRate;
    denomination: string;
  }
}

