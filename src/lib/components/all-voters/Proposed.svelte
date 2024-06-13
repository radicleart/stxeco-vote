<script lang="ts">
	import { sessionStore } from '$stores/stores';
	import { onMount } from 'svelte';
	import Holding from './Holding.svelte';
	import type { ProposalEvent } from '@mijoco/stx_helpers/dist/index';
	import { fmtNumber } from '$lib/utils';

	export let proposal:ProposalEvent;
	let stacksTipHeight = $sessionStore.stacksInfo.stacks_tip_height;
	let startHeightMessage:string;
	let durationMessage:string;

	onMount(async () => {
		const proposalDuration = proposal.funding.parameters.proposalDuration
		const proposalStartDelay = proposal.funding.parameters.proposalStartDelay
		startHeightMessage = 'The earliest start for voting is in ' + proposalStartDelay + ' blocks ' + ((proposalStartDelay) / 144).toFixed(2) + ' days after proposal is funded at block ~ ' + (fmtNumber(stacksTipHeight + proposalStartDelay));
		durationMessage = 'The voting window is ' + (proposalDuration)+ ' blocks, roughly ' + ((proposalDuration) / 144).toFixed(2) + ' days, after voting starts.';
	})
</script>


<div class="flex flex-col gap-y-5 bg-warning-01 p-2 ">
	<Holding />
</div>
