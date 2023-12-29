<script lang="ts">
import { onMount } from 'svelte';
import { CONFIG } from '$lib/config';
import Invoice from './Invoice.svelte';
import { sbtcConfig } from '$stores/stores';
	import type { ProposalEvent } from '$types/stxeco.type';

export let proposalEvent: ProposalEvent;
let stacksTipHeight = $sbtcConfig.stacksInfo.stacks_tip_height;
let yesAddress:string;
let noAddress:string;

const doClicked = () => {

}

onMount(async () => {
  const addresses = $sbtcConfig.soloPoolData?.poolAddresses!
  yesAddress = addresses.yAddress as string
  noAddress = addresses.nAddress as string
})

</script>
<div class="bg-white/5 rounded-md p-4 border border-gray-900 flex flex-col gap-y-6">
  <p>Voting starts in {proposalEvent.proposalData.startBlockHeight - stacksTipHeight} blocks.</p>
</div>
