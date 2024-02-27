import type { PoxAddress } from "./pox_types";

export type HoldingsType = {
  nfts: any;
};
export type FileType = {
  name: string;
  timestamp: number;
  data: any;
}
export type TabType = {
  label: string;
  value: number;
  component: any;
}
export type ProfileType = {
  loggedIn: boolean;
  stxAddress: string | undefined;
}
export type ExtensionType = {
  contractId: string;
  valid: boolean;
  contract?:ProposalContract;
}
export type UserPropertyType = {
  id: string | null | undefined;
  stxAddress: string;
  value: {
    value: string|number;
  };
  contractName: string;
  functionName: string;
}
export type ProposalEvent = {
  status?: { name: string, color: string, colorCode: string };
  proposalMeta: ProposalMeta; 
  contract: ProposalContract;
  proposalData: ProposalData; 
  submissionData: SubmissionData;
  event:string;
  proposer:string;
  contractId:string;
  votingContract: string;
  submitTxId: string;
  funding: FundingData;
  signals?: SignalData;
  executedAt: number;
  stage: ProposalStage;
}
export type VoteEvent = {
  stackerData?: Array<PoolStackerEvent>;
  event: string;
  proposal: string;
  voter: string;
  for: boolean;
  amount: number;
  burnBlockHeight:number;
  votingContractId:string;
  proposalContractId: string;
  submitTxId: string;
  blockHeight: number;
  burnBlockHeight: number;
  delegations?: number;
  poxStacker?: string;
}

export enum ProposalStage {
  UNFUNDED,
  PARTIAL_FUNDING,
  PROPOSED,
  ACTIVE,
  INACTIVE,
  CONCLUDED
}

export type FundingData = {
  funding:number;
  parameters: {
    fundingCost:number;
    proposalDuration:number;
    proposalStartDelay:number;
  };
}

export type SignalData = {
  signals:number;
  parameters: {
    executiveSignalsRequired:number;
    executiveTeamSunsetHeight:number;
  };

}

export type GovernanceData = {
  totalSupply:number;
  userLocked:number;
  userBalance:number;
}

export type ProposalData = {
  concluded:boolean; 
  passed:boolean; 
  proposer:string;
  customMajority:number;
  endBlockHeight:number;
  startBlockHeight:number;
  votesAgainst:number;
  votesFor:number;
  burnStartHeight:number;
  burnEndHeight:number;
}
export type SubmissionData = {
  contractId:string;
  transaction: any;
}
export type ProposalContract = {
  source:string;
  publish_height:number;
}
export type ProposalMeta = {
  dao: string; 
  title: string; 
  author: string; 
  synopsis: string; 
  description: string; 
}
export type DaoData = {
  inFlight: {
    name: string;
    txid: string;
  }|undefined
}
export type PoolStackerEvent = {
  _id?:string;
  submitTxId: string;
  eventIndex: number;
  event: string;
  locked: number;
  balance: number;
  stacker: string;
  burnchainUnlockHeight: number;
  data: DelegationStx;
}

export type HandleUnlock = {
  firstCycleLocked: number;
  firstUnlockedCycle: number;
  poxAddr?: PoxAddress;
}
export type DelegationStx = {
  amountUstx: number;
  delegator: string;
  poxAddr?: PoxAddress;
  unlockBurnHeight: number;
}
export type DelegationAggregationIncrease = {
  amountUstx: number;
  delegator?: string;
  poxAddr?: PoxAddress;
  rewardCycle: number;
}
export type DelegationStackExtend = {
  delegator: string;
  extendCount: number;
  poxAddr: PoxAddress;
  stacker: string;
  unlockBurnHeight: number;
}
export type DelegationStackIncrease = {
  delegator: string;
  increaseBy: number;
  poxAddr: PoxAddress;
  stacker: string;
  totalLocked: number;
}
export type DelegationStackStx = {
  delegator: string;
  lockAmount: number;
  lockPeriod: number;
  poxAddr?: PoxAddress;
  stacker: string;
  startBurnHeight: number;
  unlockBurnHeight: number;
}
export type StackStx = {
  lockAmount: number;
  lockPeriod: number;
  poxAddr?: PoxAddress;
  startBurnHeight: number;
  unlockBurnHeight: number;
}
export type StackIncrease = {
  increaseBy: number;
  poxAddr?: PoxAddress;
  totalLocked: number;
}
export type StackAggregationCommit = {
  amountUstx: number;
  delegator?: string;
  poxAddr?: PoxAddress;
  rewardCycle: number;
}
export type StackExtend = {
  extendCount: number;
  poxAddr?: PoxAddress;
  unlockBurnHeight: number;
}
export type DelegationStackAggregationCommitIndexed = {
  amountUstx: number;
  delegator?: string;
  poxAddr?: PoxAddress;
  rewardCycle: number;
}
