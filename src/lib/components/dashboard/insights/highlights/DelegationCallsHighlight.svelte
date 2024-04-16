
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fmtNumberStacksFloor, truncateEnd } from '$lib/utils';
	import { stacksStore } from '$stores/stacksStore';
	import { ChevronDown, ChevronRight, Icon } from 'svelte-hero-icons';
	import * as echarts from 'echarts/core';

	// Import bar charts, all suffixed with Chart
	import { BarChart } from 'echarts/charts';

	// Import the tooltip, title, rectangular coordinate system, dataset and transform components
	import {
		TitleComponent,
		TooltipComponent,
		GridComponent,
		DatasetComponent,
		TransformComponent
	} from 'echarts/components';

	// Features like Universal Transition and Label Layout
	import { LabelLayout, UniversalTransition } from 'echarts/features';

	// Import the Canvas renderer
	// Note that including the CanvasRenderer or SVGRenderer is a required step
	import { CanvasRenderer } from 'echarts/renderers';
	import { onMount } from 'svelte';

	// Register the required components
	echarts.use([
		BarChart,
		TitleComponent,
		TooltipComponent,
		GridComponent,
		DatasetComponent,
		TransformComponent,
		LabelLayout,
		UniversalTransition,
		CanvasRenderer
	]);
	let myChart:echarts.ECharts;

	let aggDelegationData:any = $stacksStore.aggDelegationData
	let showAll = false;

	const getTotalDelegeted = () => {
		if (!aggDelegationData.result2 || aggDelegationData.result2.length === 0) return {totalUstx: 0, totalDelegations: 0}
		let result1 = aggDelegationData.result2.map((x:any) => x.total)
		result1 = result1.reduce((sum:number, num:number) => sum + num);
		const result2 = aggDelegationData.result2.map((x:any) => x.delegations).reduce((sum:number, num:number) => sum + num);
		return {totalUstx: result1, totalDelegations: result2}
	}

	const getStackStx = () => {
		const stackStx = aggDelegationData.result3.find((o:any) => o._id.event === 'stack-stx')
		return (stackStx) ? stackStx.count : 0
	}

	const labels = () => {
		return aggDelegationData.result3.map((o:any) => o._id.event)
	}

	const values = () => {
		return aggDelegationData.result3.map((o:any) => o.count)
	}


	onMount(async () => {

		//await tick()
		myChart = echarts.init(document.getElementById('dhcalls-chart'));
		myChart.setOption({
			title: {
				text: 'Stacking contract calls'
			},
			tooltip: {},
			xAxis: {
				data: labels()
			},
			yAxis: {},
			series: [
				{
					name: 'delegations',
					type: 'bar',
					data: values(),
					label: {
						show: true,
						position: 'top',
						color: "green",
						fontSize: 10,
						formatter: function(d:any) {
							return d.name.replace('delegate', 'del').replace('stack', 'stk').replace('aggregation', 'ag').replace('indexed', 'idx');
						}
					},
				}
			]
		});
		//myChart.
		})
</script>

<div class="h-full flex flex-col items-stretch min-h-[200px]">
	<div class="h-full text-sm flex flex-col  z-[1]">

		<div class="flex-0">
			<h4 class="text-lg mt-0 text-[#131416] mb-3">Stacking call overview</h4>
			<p class="text-sm mt-0 text-[#131416] mb-3">{fmtNumberStacksFloor(getTotalDelegeted().totalUstx)} STX delegated over {getTotalDelegeted().totalDelegations} calls</p>
		</div>

		<div class="flex flex-col justify-start">
			<div class="p-1 border-white rounded-lg">
				<div role="contentinfo" class="flex flex-col items-start gap-1 md:text-sand-700 py-1 px-0">
					<a href={'/insights/events?event=delegate-stx'}>{getTotalDelegeted().totalDelegations} Delegations:</a> 
					<span class="text-[#131416]/[0.64] inline-flex items-start gap-0">
						{fmtNumberStacksFloor(getTotalDelegeted().totalUstx)} STX
					</span>
				</div>
			</div>
			<div class="p-1 border-white rounded-lg flex-nowrap">
				<span role="contentinfo" class="inline-flex items-start gap-1 md:text-sand-700 py-1 px-0">
					<a href="/" on:click|preventDefault={() => goto('/insights/events?event=stack-stx&chain=testnet')}>{getStackStx()} Solo stacking call(s)</a>
				</span>
			</div>
		</div>

	</div>

	<div id="dhcalls-chart" class="w-full min-h-[200px]">
	</div>

	<div class="h-full text-sm flex flex-col  z-[1]">
		<a href="/" on:click|preventDefault={() => showAll = !showAll}>
			{#if showAll}<Icon src={ChevronDown} mini class="inline-block h-6 w-6 text-bloodorange" aria-hidden="true" />
			{:else}<Icon src={ChevronRight} mini class="inline-block h-6 w-6 text-bloodorange" aria-hidden="true" />{/if}
			show raw data
		</a>
		{#if showAll}
		{#each aggDelegationData.result3 as option}
		<div class="py-2 text-xs">
			<div class="flex justify-start text-xs">
				<div>{option._id.event}</div>
			</div>
			<div class="flex justify-start">
				<div class="w-2/5">number of calls:</div><div class="grow-0 w-4/5">{option.count}</div>
			</div>
		</div>
		{/each}
		{/if}
	</div>

	<div class="mt-3 text-center w-full text-sm font-mono uppercase items-baseline block bg-lightpurple px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
		<a href="/" on:click|preventDefault={() => goto('/insights/events?chain=testnet')}>Show all stacking calls</a>
	</div>

</div>