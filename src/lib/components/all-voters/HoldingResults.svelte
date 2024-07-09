<script>
	import NakamotoBackground from "$lib/ui/NakamotoBackground.svelte";
	import NakamotoShield from "$lib/ui/NakamotoShield.svelte";

</script>
<div>
	<div class="flex flex-col w-full my-8 bg-[#F4F3F0] rounded-2xl">
		<div class="py-10 px-10 md:px-12 md:grid md:gap-12 md:grid-flow-col md:auto-cols-auto overflow-hidden relative">
			
            <div class="">
                <div class="mb-4">
                    <h2 class="text-[#131416] text-2xl mb-3">Count in progress</h2>
                </div>
                <div class="rounded-lg relative bg-[#E6E4E2] px-6 py-6 space-y-3 max-w-xl">
                    <p>Results will be displayed here soon.</p>
                </div>
            </div>
                    
			<NakamotoBackground />
			<NakamotoShield />
		</div>
	</div>
</div>
