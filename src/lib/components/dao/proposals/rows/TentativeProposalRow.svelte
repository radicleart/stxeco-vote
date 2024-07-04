<script lang="ts">
	import { fmtMicroToStx, fmtNumber } from "$lib/utils";
	import type { TentativeProposal } from "@mijoco/stx_helpers/dist/index";


    export let event:TentativeProposal;

    const clazzes = ' py-2 w-full grid grid-cols-3 lg:grid-cols-4 justify-between my-0 text-md'

</script>

<div class={' text-gray-800 grid-cols-4 justify-end' + clazzes}>
	<div class="grow col-span-2"><span><a class="text-blue-500 hover:underline" href={'/dao/proposals/propose?tentativeCId=' + event.tag}>{event.proposalMeta.title}</a></span></div>
	<div class="inline-flex whitespace-nowrap flex-shrink">{fmtNumber(event.expectedStart)}</div>
	<div class="inline-flex whitespace-nowrap flex-shrink">{fmtNumber(event.expectedEnd)}</div>
</div>
