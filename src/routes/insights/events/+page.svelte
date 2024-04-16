<script lang="ts">
	import { onMount } from 'svelte';
	import { sbtcConfig } from '$stores/stores';
	import StackingMenu from '$lib/components/dashboard/common/StackingMenu.svelte';
	import Events from '$lib/components/dashboard/contract-events/Events.svelte';

	let inited = false;
	const stacksTipHeight = $sbtcConfig.stacksInfo?.stacks_tip_height | 0;
	const burnHeight = $sbtcConfig.stacksInfo?.burn_block_height | 0;
	let signerInfo: string;
	let action: string|undefined;

	const updateSigner = (e:any) => {
		signerInfo = e.detail.signerInfo
	}

	const updateStackingAction = (e:any) => {
		action = e.detail.action
	}

	onMount(async () => {
		inited = true
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

{#if inited}

<div class="py-6 rounded-2xl sm:rounded-none">
	<div class="py-4 mx-auto max-w-7xl md:px-6">
		<StackingMenu method={1}/>
		<Events mode={'all'}/>
	</div>
</div>

{/if}