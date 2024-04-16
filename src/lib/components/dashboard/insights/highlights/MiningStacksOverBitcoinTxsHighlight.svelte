
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fmtMicroToStx, fmtNumberStacksFloor, truncate, truncateEnd } from '$lib/utils';
	import { stacksStore } from '$stores/stacksStore';
	import { ChevronDown, ChevronRight, Icon } from 'svelte-hero-icons';
	import { onMount, tick } from 'svelte';
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
	import { getMiningAggregates } from '$lib/signers_api';

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
	let showAll = false;
	const openStackingFeature = () => {
		//goto('/insights/events')
	}

	const valuesStacks = () => {
		return stacksOverBitcoinTransactionCounts.result1.map((o:any) => o.total)
	}

	const labels = () => {
		return stacksOverBitcoinTransactionCounts.result1.map((o:any) => o._id.name.replace('registrations', 'reg').replace('leader', 'ldr'))
	}

	let stacksOverBitcoinTransactionCounts = {} as any

	onMount(async () => {

		stacksOverBitcoinTransactionCounts = await getMiningAggregates()

		myChart = echarts.init(document.getElementById('mining1-chart'));
		myChart.setOption({
			title: {
				text: stacksOverBitcoinTransactionCounts?.result1Query?.name
			},
			tooltip: {},
			xAxis: {
				data: labels()
			},
			yAxis: {},
			series: [
				{
					name: 'tx types',
					type: 'bar',
					data: valuesStacks(),
					label: {
						show: true,
						position: 'top',
						color: "green",
						fontSize: 10,
						formatter: function(d:any) {
							return d.name.replace('registrations', 'reg').replace('leader', 'ldr');
						}
					},
				}
			]
		});
		//myChart.
	})

</script>

<div class="h-full flex flex-col items-stretch">

	<div class="h-full text-sm flex flex-col  z-[1]">
		<div class="">
			<h4 class="text-lg mt-0 text-[#131416] mb-3">
				{stacksOverBitcoinTransactionCounts?.result1Query?.name || 'loading..'}
			</h4>
			<p class="text-sm mt-0 text-[#131416] mb-3">{stacksOverBitcoinTransactionCounts?.result1Query?.description || 'Mining graphs loading..'}</p>
		</div>
	</div>

	<div id="mining1-chart" class="w-full min-h-[200px]">
	</div>

	<div class="h-full text-sm flex flex-col  z-[1]">
		<a href="/" on:click|preventDefault={() => showAll = !showAll}>
			{#if showAll}<Icon src={ChevronDown} fill="currentColor" mini class="inline-block h-6 w-6 text-bloodorange" aria-hidden="true" />
			{:else}<Icon src={ChevronRight} fill="currentColor" mini class="inline-block h-6 w-6 text-bloodorange" aria-hidden="true" />{/if}
			show raw data
		</a>
		{#if showAll}
		{#each stacksOverBitcoinTransactionCounts.result1 as option}
		<div class="py-2 text-xs">
			<div class="flex justify-start text-xs">
				<div>{option._id.name}</div>
			</div>
			<div class="flex justify-start">
				<div class="w-2/5">total:</div><div class="grow-0 w-4/5">{option.total}</div>
			</div>
		</div>
		{/each}
		{/if}
	</div>

	<div class="mt-3 text-center w-full text-sm font-mono uppercase items-baseline block bg-lightpurple px-4 py-2 text-[#0A0A0B] rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" role="button">
		<a href="/" on:click|preventDefault={() => openStackingFeature()}>Show all stacks bitcoin data</a>
	</div>

</div>
