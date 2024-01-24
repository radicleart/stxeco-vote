<script lang="ts">
	import { truncate } from 'sbtc-bridge-lib';
	import type { ProposalEvent } from '$types/stxeco.type';

    export let event:ProposalEvent;

    const clazzes = 'border-b border-gray-1000 py-2 w-full grid grid-cols-3 lg:grid-cols-4 justify-between my-0 text-md'

</script>

<div class={(event.proposalData?.concluded) ? ' text-gray-200 grid-cols-4 justify-end' + clazzes : 'text-gray-300 grid-cols-3 justify-end' + clazzes}>
	<div class="grow col-span-2"><span><a class="text-blue-500 hover:underline" href={'/dao/proposals/' + event.contractId}>{event.proposalMeta.title}</a></span></div>
	<div class="inline-flex whitespace-nowrap flex-shrink">{Math.round(event.proposalData.votesFor / 1000000)}</div>
	<div class="inline-flex whitespace-nowrap flex-shrink">{Math.round(event.proposalData.votesAgainst / 1000000)}</div>
</div>
