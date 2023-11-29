<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fmtNumber, satsToBitcoin, truncate, type SbtcClarityEvent } from 'sbtc-bridge-lib';
	import ArrowUpRight from '../shared/ArrowUpRight.svelte';
	import { explorerBtcTxUrl, explorerTxUrl } from '$lib/utils';
	import type { ProposalEvent } from '$types/sbtc_config';

    export let event:ProposalEvent;

    const getReclaimUrl = (pegin:any) => {
        goto('/transactions/' + pegin.bitcoinTxid.payload.value.split('x')[1])
    }

	const getType = (eventType: string | undefined) => {
		return eventType === 'mint' ? 'deposit' : 'withdrawal';
	}

</script>

<div class="w-full grid grid-cols-2 md:grid-cols-2 justify-evenly my-4 text-sm font-extralight text-gray-300">
	<div class=" max:w-3/5">{event.proposal.split('.')[1]}</div>
	<div class=" max:w-2/5">{event.proposer}</div>
</div>
