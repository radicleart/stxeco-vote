
<script lang="ts">
	import { onMount } from 'svelte';
	import SbtcTvlHighlight from './highlights/SbtcTvlHighlight.svelte';
	import DelegationsPerOperatorHighlight from './highlights/DelegationsPerOperatorHighlight.svelte';
	import DelegationTotalsHighlight from './highlights/DelegationCallsHighlight.svelte';
	import SignerWeightsHighlight from './highlights/SignerWeightsHighlight.svelte';
	import { getRecentSigners, getSignerSlots } from '$lib/signers_api';
	import SignerSlotsHighlight from './highlights/SignerSlotsHighlight.svelte';
	import SbtcTransactionHighlight from './highlights/SbtcTransactionHighlight.svelte';
	import SignerAccumulatedHighlight from './highlights/SignerAccumulatedHighlight.svelte';
	import DelegatedStacksPerOperatorHighlight from './highlights/DelegatedStacksPerOperatorHighlight.svelte';
	import StackingHighlightMenu from './StackingHighlightMenu.svelte';
	import DelegationPoxHighlight from './highlights/DelegationPoxHighlight.svelte';
	import MiningStacksOverBitcoinTxsHighlight from './highlights/MiningStacksOverBitcoinTxsHighlight.svelte';

	let filter:string|undefined;

	const changeFilter = (e:any) => {
		filter = (e.detail.filter) ? e.detail.filter : undefined
	}
</script>


<div class="py-4 mx-auto max-w-7xl md:px-6">
  	<div class="flex flex-col w-full my-4">
    	<div>
			<div class="space-y-6 mt-5">
				<StackingHighlightMenu {filter} on:change_filter={changeFilter} />
				<div class="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:gap-4 ">
					{#if !filter || filter === 'mining'}
					<div class="group flex flex-col overflow-hidden border border-bloodorange hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<MiningStacksOverBitcoinTxsHighlight />
					</div>
					{/if}
					{#if !filter || filter === 'stacking'}
					<div class="group flex flex-col overflow-hidden border border-lightpurple hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<DelegationPoxHighlight />
					</div>
					<div class="group flex flex-col overflow-hidden border border-lightpurple hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<DelegationTotalsHighlight />
					</div>
					<div class="group flex flex-col overflow-hidden border border-lightpurple hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<DelegationsPerOperatorHighlight />
					</div>
					<div class="group flex flex-col overflow-hidden border border-lightpurple hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<DelegatedStacksPerOperatorHighlight />
					</div>
					{/if}
					{#if !filter || filter === 'signer'}
					<div class="group flex flex-col overflow-hidden border border-bloodorange hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<SignerWeightsHighlight />
					</div>
					{/if}
					{#if !filter || filter === 'signer'}
					<div class="group flex flex-col overflow-hidden border border-bloodorange hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<SignerSlotsHighlight/>
					</div>
					{/if}
					{#if !filter || filter === 'signer'}
					<div class="group flex flex-col overflow-hidden border border-bloodorange hover:border-black rounded-lg relative bg-lightgray px-6 py-6 transition duration-300 ease-in-out">
						<SignerAccumulatedHighlight/>
					</div>
					{/if}
					{#if !filter || filter === 'sbtc'}
					<div class="p-[1.2px] bg-[linear-gradient(126.12deg,rgba(237,105,60,0.5)11.8%,rgba(254,219,99,0.2)72.43%)] rounded-lg">
						<div class="h-full p-6 bg-[linear-gradient(126.12deg,rgba(0,0,0,0.95)21.1%,rgba(18,18,18,0.5)53.58%);] rounded-lg">
							<SbtcTvlHighlight />
						</div>
					</div>
					{/if}
					{#if !filter || filter === 'sbtc'}
					<div class="p-[1.2px] bg-[linear-gradient(126.12deg,rgba(237,105,60,0.5)11.8%,rgba(254,219,99,0.2)72.43%)] rounded-lg">
						<div class="h-full p-6 bg-[linear-gradient(126.12deg,rgba(0,0,0,0.95)21.1%,rgba(18,18,18,0.5)53.58%);] rounded-lg">
							<SbtcTransactionHighlight />
						</div>
					</div>
					{/if}
				</div>
			</div>
		</div>
  	</div>
</div>
