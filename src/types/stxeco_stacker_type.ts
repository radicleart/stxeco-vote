import type { VoteEvent } from "./stxeco.type";

export type RewardSlot = {
  _id?:string;
  canonical:boolean;
  address:string;
  burn_block_hash:string;
  burn_block_height:number;
  slot_index:number;
}

export type VotingAddresses = {
  yAddress:string, nAddress:string
}

export type SoloPoolData = {
  soloAddresses: VotingAddresses;
  poolAddresses: VotingAddresses;
  poolVotes: Array<VoteEvent>;
  soloVotes: Array<VoteEvent>;
}