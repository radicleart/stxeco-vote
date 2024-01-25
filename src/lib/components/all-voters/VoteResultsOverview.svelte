<script lang="ts">
	import NakamotoResultsBackground from "../shared/NakamotoResultsBackground.svelte";

</script>

  
<div class="mb-8 lg:grid lg:gap-8 lg:grid-cols-3 space-y-4 lg:space-y-0">
	<div class="p-8 bg-[#121314] rounded-2xl">
	  	<h3 class="text-3xl text-white">Vote results</h3>
	</div>
	<div class="p-8 bg-primary-01 rounded-2xl relative">
		<NakamotoResultsBackground />
	</div>
	<div class="p-8 bg-[#F4F3F0] rounded-2xl relative">
		<NakamotoResultsBackground />
	</div>
</div>
