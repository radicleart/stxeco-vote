<script lang="ts">
	import { onMount } from 'svelte';
	import StackingMenu from '$lib/components/dashboard/common/StackingMenu.svelte';

	let inited = false;

	onMount(async () => {
		inited = true
	})
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="py-6 rounded-2xl sm:rounded-none">
	<div class="py-4 mx-auto max-w-7xl md:px-6">
		<StackingMenu method={1}/>
		<div class="py-4 mx-auto max-w-7xl md:px-6">
			<div class="flex flex-col w-full my-4">
			  <div>
				  <div class="space-y-6 mt-5">Coming soon !</div>
				</div>
			</div>
		</div>
	</div>
</div>
