
<script lang="ts">
	import { stackingFeatures } from '$lib/pox_api';
	import { onMount } from 'svelte';
	import StackingFeatureAction from './StackingFeatureAction.svelte';

	onMount(async () => {
	});
</script>



<div class="py-4 mx-auto md:max-w-7xl md:px-6">
  	<div class="flex flex-col w-full my-4">
    	<div>
			<div class="space-y- mt-5">
				<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-2">What are you looking for?</h2>
				<div class="py-6 px-3 bg-[#F4F3F0] rounded-2xl lg:grid lg:gap-8 lg:grid-cols-3  lg:space-y-0">
				{#each stackingFeatures as option}
				<div class="bg-lightgray py-2 px-2">
					<StackingFeatureAction {option} />
				</div>
				{/each} 
				</div>
			</div>
		</div>
  	</div>
</div>
