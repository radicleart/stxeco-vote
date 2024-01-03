<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	//const { deserializeCV, cvToJSON } = require("@stacks/transactions");
	import { deserializeCV, cvToJSON } from "micro-stacks/clarity";
	import ChainUtils from '$lib/service/ChainUtils';
	import bnsJpg from '$lib/assets/bns.jpg'
	import questionmark from '$lib/assets/questionmark.png'
	const dispatch = createEventDispatcher();

	export let item:any;
	let owner: string;
	let fallback: string;
	let bnsName: string;
	let bnsNamespace: string;
	let src:string;

	const imageSrc = () => {
		return (item?.metaData?.image) ? item?.metaData.image : fallback;
	}
	const handleError = () => {
		src = questionmark;
	}
	const contractName = () => {
		return (item?.asset_identifier) ? item?.asset_identifier.split('::')[0].split('.')[1] : '';
	}
	const toggleCanvas = (item: any) => {
		dispatch("select_item", { item });
	}
	
	onMount(async () => {
		owner = (item?.token?.owner) ? item?.token?.owner + ':' : '';
		fallback = bnsJpg; //'https://images.prismic.io/edao/ab7c56c4-b1a0-4d3b-ad5a-dc95018b6816_stx_eco_vote_image.png?auto=compress,format';
		let bnsName: any;
		let bnsNamespace: any;
		if (item.asset_identifier.indexOf('bns::names') > -1) {
			const result = cvToJSON(deserializeCV(item.value.hex));
			bnsName = ChainUtils.hexToAscii(result.value.name.value);
			bnsNamespace = ChainUtils.hexToAscii(result.value.namespace.value);
			item.bnsName = bnsName + '.' + bnsNamespace;
			//bnsName = Buffer.from(bnsName, 'hex');
		}
		if (item.metaData && item.metaData.image) src = item.metaData.image

	})

</script>

{#if typeof item === 'object' && item.metaData && item.metaData.image}
<div class="col-4">
	<div class="text-white">
		{#if item.metaData}
		<h6 class={(owner) ? 'text-warning' : 'text-info'} title={owner}>{contractName()} #{item?.token?.id} n/f </h6>
		<a href="/" on:click|preventDefault={() => {toggleCanvas(item)}}><img class="w-60" {src} on:error={handleError} alt={'Image for ' + item?.token?.id}/></a>
		{:else if item.asset_identifier.indexOf('bns::names') > -1}
		<h6 class="text-info" title={owner}>{contractName()}: {bnsName + '.' + bnsNamespace} </h6>
		<a href="/" on:click|preventDefault={() => {toggleCanvas(item)}}><img class="w-60" src={'/img/bns.jpg'} alt={bnsName}/></a>
		{:else}
		<h6 class={(owner) ? 'text-warning' : 'text-info'} title={owner}>{contractName()} #{item?.token?.id} n/f </h6>
		<img class="w-60" src={questionmark} alt={'Missing Image for ' + item?.token?.id}/>
		{/if}
	</div>
</div>
{/if}
