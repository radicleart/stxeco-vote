
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fmtAmount, fmtNumber, fmtNumberStacksFloor } from '$lib/utils';
	import { ChevronDown, ChevronRight, Icon } from 'svelte-hero-icons';
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import { stacksStore } from '$stores/stacksStore';

	const aggDelegationData:any = $stacksStore.aggDelegationData

	const rewardPhaseLength = $sbtcConfig.poxInfo.reward_phase_block_length
	const preparePhaseLength = $sbtcConfig.poxInfo.prepare_phase_block_length
	const blocksTillNextPrepare = $sbtcConfig.poxInfo.next_cycle.blocks_until_prepare_phase
	const blocksTillNextReward = $sbtcConfig.poxInfo.next_cycle.blocks_until_reward_phase
	const currentHeight = $sbtcConfig.poxInfo.current_burnchain_block_height

	const preparePhase = blocksTillNextPrepare > rewardPhaseLength

	const signersCount = () => {
		const solo = aggDelegationData.result3.find((o:any) => o._id.event === 'stack-stx')
		return aggDelegationData.result2.length + solo.count
	}

	const signersSoloCount = () => {
		const solo = aggDelegationData.result3.find((o:any) => o._id.event === 'stack-stx')
		return solo.count
	}

	const signersPoolCount = () => {
		return aggDelegationData.result2.length
	}

	onMount(async () => {
	});
</script>

<div class="h-full flex flex-col items-stretch min-h-[200px]">
	<div class="h-full text-sm flex flex-col  z-[1]">

		<div class="flex-0">
			<h4 class="text-lg mt-0 text-[#131416] mb-3">Pox info</h4>
			<p class="text-sm mt-0 text-[#131416] mb-3">Total liquid supply: {fmtNumberStacksFloor($sbtcConfig.poxInfo.total_liquid_supply_ustx)} STX</p>
		</div>
		
		<div class="flex justify-between mx-10 border-b border-lightpurple">
			<div class="">Phase</div>
			<p class="">{(preparePhase) ? 'prepare phase' : 'reward phase'}</p>
		</div>
		
		<div class="flex justify-between mx-10">
			<div class="">Prepare phase length</div>
			<div class="">{preparePhaseLength}</div>
		</div>
		<div class="flex justify-between mx-10">
			<div class="">Next prepare phase starts in {fmtNumber(blocksTillNextPrepare)} blocks</div>
		</div>
		<div class="flex justify-between mx-10">
			<div class="">Reward phase length</div>
			<div class="">{rewardPhaseLength}</div>
		</div>
		
		<div class="flex justify-between mt-5 mx-10 border-b border-lightpurple">
			<div class="">Signers</div>
			<p class="">{signersCount()}</p>
		</div>
		<div class="flex justify-between mx-10">
			<div class="">Solo stackers</div>
			<div class="">{signersSoloCount()}</div>
		</div>
		<div class="flex justify-between mx-10">
			<div class="">Pool operators</div>
			<div class="">{signersPoolCount()}</div>
		</div>


	</div>

	<div class="mt-3 text-center w-full text-sm font-mono uppercase items-baseline block bg-lightpurple px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
		<a href="/" on:click|preventDefault={() => goto('/insights/events?chain=testnet')}>Show all stacking calls</a>
	</div>

</div>