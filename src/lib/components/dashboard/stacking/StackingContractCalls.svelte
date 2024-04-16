
<script lang="ts">
	import { goto } from '$app/navigation';
	import { stackingContractCalls } from '$lib/pox_api';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import StackingAction from './StackingAction.svelte';

	let method:string = 'solo-stackers';
	const soloOptions = stackingContractCalls.filter((o) => o.type === 'solo-stackers')
	const poolOptions = stackingContractCalls.filter((o) => o.type === 'pool-stackers')
	const operatorOptions = stackingContractCalls.filter((o) => o.type === 'pool-operators')

	const changeMethod = async (e:any, newMethod:string) => {
    	e.preventDefault();
		method = newMethod
		$page.url.searchParams.set('method', '' + method)
		goto(`?${$page.url.searchParams.toString()}`);
		const getMeTo = document.getElementById("tabs-header");
		await tick();
  		if (getMeTo) getMeTo.scrollTo({behavior: 'smooth'});
		return false;
	}

	onMount(async () => {
	});
</script>



<div class="py-4 mx-auto max-w-7xl md:px-6">
  	<div class="flex flex-col w-full my-4">
    	<div>
			<div class="space-y-6 mt-5">
				<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-6">Stacking scenarios</h2>
				<Tabs  style="underline" contentClass="py-4">
					<TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
							open={method === 'solo-stackers'} on:keyup={(e) => changeMethod(e, 'solo-stackers')} title="Solo Stackers" >
						<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
							{#each soloOptions as option}
							<div class="bg-lightgray py-8 px-4">
								<StackingAction {option} />
							</div>
							{/each} 
						</div>
					</TabItem>
					<TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
					open={method === 'solo-stackers'} on:keyup={(e) => changeMethod(e, 'solo-stackers')} title="Pool Stackers" >
					<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
						{#each poolOptions as option}
						<div class="bg-lightgray py-8 px-4">
							<StackingAction {option} />
						</div>
						{/each}
					</div>
				</TabItem>
					<TabItem class="bg-lightgray relative top-[20px] text-black rounded-t-lg border-t border-r border-l border-b-none border-x-sand-100 border-y-sand-100"
							open={method === 'pool-operators'} on:keyup={(e) => changeMethod(e, 'pool-operators')} title="Pool operators" >

						<div class="py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
							{#each operatorOptions as option}
							<div class="bg-lightgray py-8 px-4">
								<StackingAction {option} />
							</div>
							{/each}
						</div>
					</TabItem>
				</Tabs>
			</div>
		</div>
  	</div>
</div>
