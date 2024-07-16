import { getConfig } from '$stores/store_helpers';
import { fetchAddressTransactions, getHashBytesFromAddress } from '@mijoco/btc_helpers/dist/index';
import { callContractReadOnly, type VoteEvent, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
import { hex } from '@scure/base';
import { serializeCV, principalCV } from '@stacks/transactions';

const limit = 50 ;
const PRE_NAKAMOTO_STACKS_TIP_HEIGHT = 850850

export async function getStackerBitcoinTxs(proposal:VotingEventProposeProposal):Promise<{bitcoinTxsYes:Array<VoteEvent> , bitcoinTxsNo:Array<VoteEvent>}> {
  const bitcoinTxsYes:Array<VoteEvent> = []
  const bitcoinTxsNo:Array<VoteEvent> = []
  if (!proposal.stackerData || !proposal.stackerData.heights) return {bitcoinTxsYes, bitcoinTxsNo};

  const allYesResults:Array<any> = await fetchAddressTransactions(getConfig().VITE_MEMPOOL_API, proposal.stackerData.bitcoinAddressYes);
  const allNoResults:Array<any> = await fetchAddressTransactions(getConfig().VITE_MEMPOOL_API, proposal.stackerData.bitcoinAddressNo);
  
  if (allYesResults) {
    for (const tx of allYesResults) {
      if (checkHeights(tx.status.block_height, proposal.stackerData.heights.burnStart, proposal.stackerData.heights.burnEnd)) {
        bitcoinTxsYes.push(tx)
      } else {
        console.log('Out of bounds vote tx: ' + tx.txid)
      }
    }
  }

  if (allNoResults) {
    for (const tx of allNoResults) {
      if (checkHeights(tx.status.block_height, proposal.stackerData.heights.burnStart, proposal.stackerData.heights.burnEnd)) {
        bitcoinTxsNo.push(tx)
      } else {
        console.log('Out of bounds vote tx: ' + tx.txid)
      }
    }
  }

  await convertBitcoinTxsToVotes(proposal, bitcoinTxsYes, true)
  await convertBitcoinTxsToVotes(proposal, bitcoinTxsNo, false)
  return {bitcoinTxsYes, bitcoinTxsNo};
}


export async function getStackerStacksTxs(proposal:VotingEventProposeProposal):Promise<{stackerTxsYes:Array<VoteEvent> , stackerTxsNo:Array<VoteEvent>}> {
  const stackerTxsYes:Array<VoteEvent> = []
  const stackerTxsNo:Array<VoteEvent> = []
  if (!proposal.stackerData || !proposal.stackerData.heights) return {stackerTxsYes , stackerTxsNo};
  let offset = 0; //await countContractEvents();
  let events:any;

  do {
    events = await getStacksTransactionsByAddress(offset, proposal.stackerData.stacksAddressYes);
    if (events && events.results.length > 0) {
      for (const tx of events.results) {
        if (checkHeights(tx.burn_block_height, proposal.stackerData.heights.burnStart, proposal.stackerData.heights.burnEnd)) {
          stackerTxsYes.push(tx)
        } else {
          console.log('Out of bounds vote tx: ' + tx.tx_id)
        }
      }
    }
    offset += limit;
  } while (events.results.length > 0);

  do {
    events = await getStacksTransactionsByAddress(offset, proposal.stackerData.stacksAddressNo);
    if (events && events.results.length > 0) {
      for (const tx of events.results) {
        if (checkHeights(tx.burn_block_height, proposal.stackerData.heights.burnStart, proposal.stackerData.heights.burnEnd)) {
          stackerTxsNo.push(tx)
        } else {
          console.log('Out of bounds vote tx: ' + tx.tx_id)
        }
      }
    }
    offset += limit;
  } while (events.results.length > 0);
  convertStacksTxsToVotes(proposal, stackerTxsYes, true)
  convertStacksTxsToVotes(proposal, stackerTxsNo, false)

  return {stackerTxsYes , stackerTxsNo};
}

function checkHeights(height:number, minBurnHeight:number, maxBurnHeight:number):boolean {
  return height >= minBurnHeight && height < maxBurnHeight
}

async function getStacksTransactionsByAddress(offset:number, principle:string):Promise<any> {
  const url = `${getConfig().VITE_STACKS_API}/extended/v1/address/${principle}/transactions?limit=${limit}&offset=${offset}`;
  let val;
  try {
      const response = await fetch(url)
      val = await response.json();
  } catch (err) {
      console.log('getPoolYesVotes: ', err);
  }
  return val;
}

async function convertStacksTxsToVotes(proposal:VotingEventProposeProposal, txs:Array<any>, vfor:boolean):Promise<Array<VoteEvent>> {
  const votes:Array<VoteEvent> = []
  console.log('addToMongoDB: transactions: ' + vfor + ' : ' + txs.length)
  for (const v of txs) {
    //const stackerInfo = await getStackerInfoAtTip(proposal.proposalData.startBlockHeight, v.sender_address)
    //const stackerDel = await getCheckDelegationAtTip(proposal.proposalData.startBlockHeight, v.sender_address)
    //console.log('getCheckDelegationAtTip: ', stackerDel)

    const potVote:any = {
      //amount: (stackerDel && stackerDel.amount) ? stackerDel.amount : 0,
      amount: 0,
      for: vfor,
      proposalContractId: proposal.proposal,
      submitTxId: v.tx_id,
      event: 'pool-or-solo-vote',
      source: 'stacks',
      votingContractId: proposal.votingContract,
      voter: v.sender_address,
      blockHeight: v.block_height,
      burnBlockHeight: v.burn_block_height,
    }
    console.log('setSoloVotes: potVote:' + potVote.amount)
    //saveOrUpdateVote(potVote)
    votes.push(potVote)
  }
  return votes;
}

async function convertBitcoinTxsToVotes(proposal:VotingEventProposeProposal, txs:Array<any>, vfor:boolean):Promise<Array<VoteEvent>> {
  const votes:Array<VoteEvent> = []
  for (const v of txs) {
    try {
      const bitcoinAddress = v.vin[0].prevout.scriptpubkey_address;
      const alreadyCountedCheck = votes.findIndex((o) => o.voter === bitcoinAddress)
      if (alreadyCountedCheck === -1) {
        const poxAddr = getHashBytesFromAddress(getConfig().VITE_NETWORK, bitcoinAddress)
        //const result = await determineTotalAverageUstx(bitcoinAddress)
  
        const potVote:any = {
          for: vfor,
          submitTxId: v.txid,
          event: 'solo-vote',
          source: 'bitcoin',
          proposalContractId: proposal.proposal,
          votingContractId: proposal.votingContract,
          poxAddr,
          voter: bitcoinAddress,
          burnBlockHeight: v.status.block_height,
          amount: 0, //result.total,
          //amountNested: result.totalNested,
          //poxStacker: result.poxStacker
          //await getBurnBlockHeight(v.block_height),
        }
        //await saveVote(potVote)
        votes.push(potVote)
        console.log('setSoloVotes: solo vote: ' + potVote.voter + ' for: ' + potVote.for + ' amount: ' + potVote.amount)
      }
    } catch (err:any) {
      console.log('addToMongoDB: solo vote: ' + err.message)
    }
  }
  return votes;
}
