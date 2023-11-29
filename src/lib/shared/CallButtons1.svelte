<script>
import { goto } from '$app/navigation';

const viewProposals = () => {
	goto(`/dao/proposals`, { replaceState: false })
}
const makeProposal = () => {
	goto(`/dao/proposals/deployment`, { replaceState: false })
}
</script>

<button class="btn mx-4 mb-4 btn-rounded" style="width: 250px;" on:click={makeProposal}>Make a Proposal</button>
<button class="btn btn-outline mx-4 mb-4 btn-rounded" style="width: 250px;" on:click={viewProposals}>View All Proposals</button>

<style>
.btn {
  border-radius: 50px !important;
	text-transform: uppercase;
  border: 1pt solid #FFA701;
  color: #FFA701;
  font-size: 1.15rem;;
}
.btn-outline {
  background-color: #262626;
  border: none;
}
</style>