
<script lang="ts">
	import { stackingOptions } from '$lib/pox_api';
	import { onMount } from 'svelte';
	import StackingOption from './StackingOption.svelte';
	
	onMount(async () => {
	});

</script>


<div class="py-4 mx-auto max-w-7xl md:px-6">
  	<div class="flex flex-col w-full my-4">
    	<div>
			<div class="space-y-6 mt-5">
				<h2 class="text-[#0A0A0B] text-2xl sm:text-4xl mt-2">Options for stacking</h2>
				<div class="grid lg:grid-cols-3 grid-cols-3 py-10 px-10 bg-[#F4F3F0] rounded-2xl lg:gap-4 ">
					{#each stackingOptions as option}
					<div class="bg-lightgray py-8 px-4">
						<StackingOption {option} />
					</div>
					{/each} 
				</div>
			</div>
		</div>
  	</div>
</div>
