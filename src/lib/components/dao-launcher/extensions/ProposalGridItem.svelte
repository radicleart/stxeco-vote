<script lang="ts">
import { createEventDispatcher } from 'svelte';
	import type { DaoEventEnableExtension, ExtensionType, VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { explorerTxUrl } from '$lib/utils';

let dispatch = createEventDispatcher();
export let proposal:VotingEventProposeProposal;

const sendSyncDaoEvent = () => {
	dispatch('syncDao', proposal)
}
const sendSyncStackerEvent = () => {
	dispatch('syncStacker', proposal)
}
</script>

<div class="col-span-4">
		<a href="/" >{proposal.proposal}</a>
	</div>
<div class="col-span-1">
		{proposal.proposalData.concluded}
	</div>
<div class="col-span-1">
	<!--<a class="pointer text-light" href="/" on:click|preventDefault={() => { openSesame() }}>Clarity</a>-->
	<a class="pointer text-light border-s ms-3 ps-3" href="/" on:click|preventDefault={() => sendSyncDaoEvent()}>Non Stackers</a>
	<a class="pointer text-light border-s ms-3 ps-3" href="/" on:click|preventDefault={() => sendSyncStackerEvent()}>Stackers</a>
</div>

