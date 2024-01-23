<script lang="ts">
	import { fmtMicroToStx } from 'sbtc-bridge-lib';
	import type { ProposalEvent } from '$types/stxeco.type';

    export let event:ProposalEvent;

    const clazzes = ' py-2 w-full grid grid-cols-3 lg:grid-cols-4 justify-between my-0 text-md font-normal '

</script>

<div class={(event.proposalData?.concluded) ? ' text-gray-200 grid-cols-4 justify-end' + clazzes : 'text-gray-300 grid-cols-3 justify-end' + clazzes}>
	<div class="grow  col-span-2"><span class=""><a class="text-blue-500 hover:underline" href={'/dao/proposals/' + event.contractId}>{event.proposalMeta.title}</a></span></div>
	{#if event.funding}
	<div class="inline-flex whitespace-nowrap flex-shrink">{fmtMicroToStx(event.funding.funding)}</div>
	<div class="inline-flex whitespace-nowrap flex-shrink">{fmtMicroToStx(event.funding.parameters.fundingCost)}</div>
	{/if}
</div>
