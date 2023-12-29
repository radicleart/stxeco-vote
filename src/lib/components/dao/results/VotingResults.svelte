<script lang="ts">
import ChainUtils from '$lib/service/ChainUtils';
import FormatUtils from '$lib/service/FormatUtils';
	import type { ProposalEvent } from '$types/stxeco.type';

export let totalAccountsFor:any;
export let totalAccountsAgainst:any;
export let proposal:ProposalEvent;
const inFavour = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
let winning = 'danger';
if (inFavour > 66) {
  winning = 'success';
}

const vAg = (proposal.proposalData) ? FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(proposal.proposalData.votesAgainst))) : 0;
const vFr = (proposal.proposalData) ? FormatUtils.fmtNumber(Math.floor(ChainUtils.fromMicroAmount(proposal.proposalData.votesFor))) : 0;

</script>

{#if proposal && proposal.proposalData}
  <div class={'mt-5 row text-' + proposal.status?.color}>
    <div class="col-md-6 col-sm-12 text-center mb-5">
      <h4 class="text-big text-center text-success">{vFr} <span class="text-white" style="font-size: 2.2rem;">YES ON NAK</span></h4>
      <h6 class="text-center text-success">from {totalAccountsFor} accounts</h6>
    </div>
    <div class="col-md-6 col-sm-12 text-center mb-5">
      <h4 class="text-big text-center text-danger">{vAg} <span class="text-white" style="font-size: 2.2rem;">NO ON NAK</span></h4>
      <h6 class="text-center text-danger">from {totalAccountsAgainst} accounts</h6>
    </div>
  </div>
  <div class={'mb-5 row'}>
    <div class="col-md-12 col-sm-6 text-center">
    </div>
    <div class="col-md-12 col-sm-6 text-center">
    </div>
  </div>
  <div class={' mb-4 d-flex justify-content-around text-' + winning}>
    <div class="text-big text-center" style="font-size: 2.2rem;">
      <span class="text-big text-center">{inFavour}%</span> <span class="text-white"> in favour of this proposal</span>
    </div>
  </div>
{/if}

<style>
  .text-big {
    font-size: 2.0rem;
  }
</style>
